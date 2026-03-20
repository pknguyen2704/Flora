import os
import time
import numpy as np
import librosa
import torch
import nltk
import difflib

from faster_whisper import WhisperModel
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
from nltk.corpus import cmudict

os.environ["HF_HUB_DISABLE_TELEMETRY"] = "1"

try:
    nltk.data.find("corpora/cmudict")
except:
    nltk.download("cmudict")


class PronunciationEngine:

    def __init__(self):

        print("Loading faster-whisper...")

        self.asr = WhisperModel(
            "tiny.en",
            device="cpu",
            compute_type="int8"
        )

        print("Loading wav2vec2 stable character model...")

        self.processor = Wav2Vec2Processor.from_pretrained(
            "facebook/wav2vec2-base-960h"
        )

        self.wav2vec = Wav2Vec2ForCTC.from_pretrained(
            "facebook/wav2vec2-base-960h"
        )

        print("Loading CMU dictionary...")

        self.cmu = cmudict.dict()

    # -------------------------
    # audio
    # -------------------------

    def load_audio(self, path):

        audio, sr = librosa.load(path, sr=16000, mono=True)

        return audio, sr

    # -------------------------
    # ASR
    # -------------------------

    def transcribe(self, path):

        segments, _ = self.asr.transcribe(
            path,
            word_timestamps=True
        )

        words = []
        text = ""

        for seg in segments:

            text += seg.text

            if seg.words:
                for w in seg.words:

                    words.append({
                        "word": w.word.lower().strip(".,!?"),
                        "start": w.start,
                        "end": w.end
                    })

        return text.strip(), words

    # -------------------------
    # phoneme dict
    # -------------------------

    def phonemes(self, word):
        # Normalize and strip punctuation
        w = word.lower().replace("’", "'").strip(".,!?\"'()[]:;")
        
        # Handle common contractions
        if w.endswith("'s"):
            w_root = w[:-2]
            p_root = self.cmu.get(w_root, [[]])[0]
            if p_root: return [p.rstrip("012") for p in p_root] + ["S"]
        if w.endswith("n't"):
            w_root = w[:-3]
            p_root = self.cmu.get(w_root, [[]])[0]
            if p_root: return [p.rstrip("012") for p in p_root] + ["N", "T"]

        # Special casing for frequent short words to ensure accuracy
        if w == "the": return ["DH", "AH"]
        if w == "ai": return ["EY", "AY"]
        if w == "check": return ["CH", "EH", "K"]

        if w not in self.cmu:
            return []

        return [p.rstrip("012") for p in self.cmu[w][0]]

    # -------------------------
    # extract word audio
    # -------------------------

    def segment(self, audio, sr, start, end):

        s = int(start * sr)
        e = int(end * sr)

        return audio[s:e]

    # -------------------------
    # wav2vec
    # -------------------------

    def wav2vec_logits(self, audio, sr):

        inputs = self.processor(
            audio,
            sampling_rate=sr,
            return_tensors="pt"
        )

        with torch.no_grad():

            logits = self.wav2vec(
                inputs.input_values
            ).logits

        return logits

    # -------------------------
    # phoneme alignment
    # -------------------------

    def align(self, target_phones, predicted_chars, word_match_ratio=0):
        # target_phones: list of CMU phonemes (e.g. ['CH', 'EH', 'K'])
        # predicted_chars: string of characters from Wav2Vec2 (e.g. 'CHECK')
        
        predicted_str = str(predicted_chars).upper()
        
        # Phone-to-Char mapping for better fuzzy matching
        phone_to_char = {
            "CH": "CH", "SH": "SH", "TH": "TH", "DH": "DH", "ZH": "ZH", "NG": "NG",
            "EY": "AY", "IY": "EE", "AY": "I", "OW": "O", "UW": "OO", "AW": "OW",
            "ER": "ER", "OY": "OY", "AE": "A", "AA": "A", "AH": "A", "AO": "O",
            "EH": "E", "IH": "I", "UH": "U"
        }
        
        phones = []
        
        # If the word match is perfect, we can be much more lenient on the phoneme level
        min_threshold = 0.6 if word_match_ratio < 0.8 else 0.4
        
        for p in target_phones:
            char_rep = phone_to_char.get(p, p).upper()
            
            best_sub_ratio = 0
            if char_rep in predicted_str:
                best_sub_ratio = 1.0
            else:
                for i in range(len(predicted_str) - len(char_rep) + 1):
                    sub = predicted_str[i:i+len(char_rep)]
                    ratio = difflib.SequenceMatcher(None, char_rep, sub).ratio()
                    best_sub_ratio = max(best_sub_ratio, ratio)
            
            # If Whisper heard the word clearly, and we find even a faint trace of the phonemes, we mark it green
            is_correct = best_sub_ratio > min_threshold
            # Special case: if word match is very high (>0.9), assume phonemes are mostly correct
            if word_match_ratio > 0.9 and best_sub_ratio > 0.3:
                is_correct = True
                
            phones.append({
                "phone": p, 
                "correct": is_correct, 
                "score": 100 if is_correct else 25
            })
                    
        return phones

    # -------------------------
    # detectors
    # -------------------------

    def rl_detector(self, phones):

        issues=[]

        for p in phones:

            if p["phone"]=="R" and p.get("heard")=="L":
                issues.append("R/L confusion")

        return issues

    def th_detector(self, phones):

        issues=[]

        for p in phones:

            if p["phone"]=="TH" and p.get("heard") in ["T","D"]:
                issues.append("TH pronunciation issue")

        return issues

    def vowel_length(self, audio):
        dur=len(audio)/16000
        # A word segment should be at least 0.05s and less than 1.5s for modern flow
        if dur < 0.05:
            return "vowel too short"
        if dur > 1.2:
            return "vowel too long"
        return None

    def stress_detector(self, audio):
        energy=np.mean(audio**2)
        # Highly sensitive to detect even whispered voices
        if energy < 0.0001:
            return "weak stress"
        return None

    # -------------------------
    # score word
    # -------------------------

    def score_word(self, word, audio, sr, asr_word=None):
        target=self.phonemes(word)

        if not target or audio is None or len(audio) < 100:
            return {"word":word,"score":0,"phones":[],"issues":["Could not analyze word"]}

        # 1. Base Score based on Whisper accuracy
        # If Whisper (the specialized ASR) heard the word correctly, it's a very good sign.
        match_ratio = 0
        if asr_word:
            w_clean = word.lower().replace("’", "'").strip(".,!?\"'()[]:;")
            asr_clean = asr_word.lower().replace("’", "'").strip(".,!?\"'()[]:;")
            match_ratio = difflib.SequenceMatcher(None, w_clean, asr_clean).ratio()
        
        base_score = 70 * match_ratio

        # 2. Character-to-Phoneme accuracy
        logits=self.wav2vec_logits(audio,sr)
        pred_ids=torch.argmax(logits,dim=-1)
        # Using the base model which outputs text characters
        predicted_text = self.processor.batch_decode(pred_ids)[0]
        
        aligned=self.align(target, predicted_text, word_match_ratio=match_ratio)
        
        phone_scores=[p["score"] for p in aligned]
        phone_avg = np.mean(phone_scores) if phone_scores else 0

        # Weighted final score: prioritizing phoneme accuracy but with a Whisper safety net
        # 30% from Whisper word detection, 70% from phoneme-level check
        total = (0.3 * base_score) + (0.7 * phone_avg)
        
        # Safety net: If Whisper is 100% sure it's the right word, don't let the score drop too low
        if match_ratio > 0.95:
            total = max(total, 85)
        elif match_ratio > 0.8:
            total = max(total, 70)

        detectors=[]
        detectors+=self.rl_detector(aligned)
        detectors+=self.th_detector(aligned)

        v=self.vowel_length(audio)
        if v: detectors.append(v)

        s=self.stress_detector(audio)
        if s: detectors.append(s)

        return{
            "word":word,
            "score":min(100, round(total)),
            "phones":aligned,
            "issues":detectors
        }

    # -------------------------
    # main
    # -------------------------

    async def assess(self, audio_path, target_text):

        start=time.time()

        audio,sr=self.load_audio(audio_path)

        transcript,words_ts=self.transcribe(audio_path)

        words=target_text.lower().split()

        results=[]
        total=0

        # Map target words to ASR transcript words using fuzzy matching
        for i, w in enumerate(words):
            target_clean = w.lower().strip(".,!?\"'()[]:;")
            
            # Find best match in ASR results
            found_seg = None
            best_ratio = 0
            
            # Increase window to 5 and relax ratio to 0.5
            window = 5
            start_search = max(0, i - window)
            end_search = min(len(words_ts), i + window + 1)
            
            for j in range(start_search, end_search):
                asr_w = words_ts[j]["word"].replace("’", "'").strip(".,!?\"'()[]:;")
                ratio = difflib.SequenceMatcher(None, target_clean, asr_w).ratio()
                if ratio > 0.45 and ratio > best_ratio:
                    best_ratio = ratio
                    found_seg = words_ts[j]

            if found_seg:
                seg = self.segment(audio, sr, found_seg["start"], found_seg["end"])
                # Pass the detected word from ASR to help with base scoring
                r = self.score_word(target_clean, seg, sr, asr_word=found_seg["word"])
            else:
                r={"word":w,"score":0,"phones":[],"issues":["Word not detected in audio"]}

            results.append(r)
            total+=r["score"]

        avg=total/len(words) if words else 0

        return{

            "total_score":round(avg),
            "asr_transcript":transcript,
            "words":results,
            "processing_time":round(time.time()-start,2)
        }
