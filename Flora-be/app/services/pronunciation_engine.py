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

        print("Loading wav2vec2 phoneme scorer...")

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

        if word not in self.cmu:
            return []

        return [p.rstrip("012") for p in self.cmu[word][0]]

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

    def align(self, target, predicted):

        matcher = difflib.SequenceMatcher(None, target, predicted)

        phones = []

        for op,i1,i2,j1,j2 in matcher.get_opcodes():

            if op == "equal":

                for p in target[i1:i2]:

                    phones.append({
                        "phone":p,
                        "correct":True,
                        "score":100
                    })

            elif op == "replace":

                for t,s in zip(target[i1:i2], predicted[j1:j2]):

                    phones.append({
                        "phone":t,
                        "heard":s,
                        "correct":False,
                        "score":40
                    })

            elif op == "delete":

                for t in target[i1:i2]:

                    phones.append({
                        "phone":t,
                        "correct":False,
                        "score":0
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

        if dur < 0.08:
            return "vowel too short"

        if dur > 0.3:
            return "vowel too long"

        return None

    def stress_detector(self, audio):

        energy=np.mean(audio**2)

        if energy<0.001:
            return "weak stress"

        return None

    # -------------------------
    # score word
    # -------------------------

    def score_word(self, word, audio, sr):

        target=self.phonemes(word)

        if not target:
            return {"word":word,"score":100,"phones":[]}

        logits=self.wav2vec_logits(audio,sr)

        pred_ids=torch.argmax(logits,dim=-1)

        predicted=self.processor.batch_decode(pred_ids)[0]

        predicted=list(predicted.replace(" ",""))

        aligned=self.align(target,predicted)

        scores=[p["score"] for p in aligned]

        phone_score=np.mean(scores) if scores else 0

        probs=torch.softmax(logits,dim=-1)

        confidence=float(torch.max(probs))*100

        total=0.7*phone_score+0.3*confidence

        detectors=[]

        detectors+=self.rl_detector(aligned)
        detectors+=self.th_detector(aligned)

        v=self.vowel_length(audio)
        if v: detectors.append(v)

        s=self.stress_detector(audio)
        if s: detectors.append(s)

        return{
            "word":word,
            "score":round(total),
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

        for i,w in enumerate(words):

            if i<len(words_ts):

                seg=self.segment(
                    audio,
                    sr,
                    words_ts[i]["start"],
                    words_ts[i]["end"]
                )

                r=self.score_word(w,seg,sr)

            else:

                r={"word":w,"score":0,"phones":[]}

            results.append(r)
            total+=r["score"]

        avg=total/len(words) if words else 0

        return{

            "total_score":round(avg),
            "asr_transcript":transcript,
            "words":results,
            "processing_time":round(time.time()-start,2)
        }
