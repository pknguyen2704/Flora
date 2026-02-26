"""MFA-based rule pronunciation scorer."""
import os
import subprocess
import tempfile
import shutil
import json
import time
from typing import Dict, Any, List, Optional, Tuple
import nltk
from textgrid import TextGrid
import whisper

try:
    nltk.data.find('corpora/cmudict')
except LookupError:
    nltk.download('cmudict', quiet=True)

from nltk.corpus import cmudict

class MFAPronunciationScorer:
    """Rule-based Pronunciation Scoring Engine using Whisper + MFA + CMU_Dict."""
    
    def __init__(self):
        # Load whisper small model
        print("Loading Whisper 'small' model on CPU...")
        try:
            self.whisper_model = whisper.load_model("small", device="cpu")
        except Exception as e:
            print(f"Warning: Failed to load whisper: {e}")
            self.whisper_model = None
            
        try:
            self.cmu_dict = cmudict.dict()
        except Exception:
            self.cmu_dict = {}
        
        # Vowels in Arpabet
        self.vowels = {'AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW'}

    def get_target_phonemes(self, word: str) -> List[str]:
        """Get phonemes for a word from CMU dict, stripping stress markers."""
        word = word.lower().strip(",.?!;")
        if word in self.cmu_dict:
            # Use the first pronunciation variant
            ph = self.cmu_dict[word][0]
            # Strip numbers (stress marks) e.g., 'AH0' -> 'AH'
            return [p.rstrip('012') for p in ph]
        return []

    def is_vowel(self, phoneme: str) -> bool:
        return phoneme in self.vowels

    async def assess_pronunciation(
        self,
        audio_file_path: str,
        target_text: str
    ) -> Dict[str, Any]:
        """
        Assess pronunciation using:
        1. Whisper transcription
        2. MFA Alignment
        3. Rule-based comparison
        """
        try:
            if not self.whisper_model:
                raise ValueError("Whisper model not loaded.")
                
            # 1. Transcribe audio with Whisper
            import time
            start_transcribe = time.time()
            result = self.whisper_model.transcribe(audio_file_path)
            transcript = result["text"].strip()
            print(f"Whisper inference time: {time.time() - start_transcribe:.2f}s")
            
            print(f"Whisper Transcript: {transcript}")
            print(f"Target Text: {target_text}")
            
            # Since MFA takes audio + text, we create a temp workspace
            with tempfile.TemporaryDirectory() as temp_dir:
                corpus_dir = os.path.join(temp_dir, "corpus")
                output_dir = os.path.join(temp_dir, "output")
                os.makedirs(corpus_dir, exist_ok=True)
                os.makedirs(output_dir, exist_ok=True)
                
                # Copy audio to corpus
                audio_filename = os.path.basename(audio_file_path)
                corpus_audio_path = os.path.join(corpus_dir, audio_filename)
                shutil.copy2(audio_file_path, corpus_audio_path)
                
                # Write transcript to .lab file (same name as audio)
                base_name = os.path.splitext(audio_filename)[0]
                lab_path = os.path.join(corpus_dir, f"{base_name}.lab")
                with open(lab_path, "w", encoding="utf-8") as f:
                    f.write(transcript)
                
                # 2. Run Montreal Forced Aligner (MFA)
                # Assumes 'mfa' is globally available, using provided english acoustic model and dict
                try:
                    subprocess.run(
                        ["mfa", "align", "--clean", corpus_dir, "english_us_arpa", "english_us_arpa", output_dir],
                        check=True,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE
                    )
                except FileNotFoundError:
                    # Fallback if MFA isn't installed.
                    print("MFA command not found. Falling back to simple Word evaluation without MFA.")
                    return self._fallback_scoring(transcript, target_text)
                except subprocess.CalledProcessError as e:
                    print("MFA alignment failed:", e.stderr.decode())
                    return self._fallback_scoring(transcript, target_text)

                # 3. Parse MFA TextGrid output
                textgrid_path = os.path.join(output_dir, f"{base_name}.TextGrid")
                if not os.path.exists(textgrid_path):
                    print("MFA output missing, fallback.")
                    return self._fallback_scoring(transcript, target_text)
                
                tg = TextGrid.fromFile(textgrid_path)
                words_tier = tg.getFirst('words')
                phones_tier = tg.getFirst('phones')
                
                return self._calculate_scores(target_text, words_tier, phones_tier, transcript)

        except Exception as e:
            print(f"Assessment error: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                "total_score": 0,
                "errors": [{"word": "All", "error_type": "system_error", "message": str(e), "penalty": 100}],
                "asr_transcript": "",
                "overall_feedback": "System error during assessment."
            }

    def _fallback_scoring(self, transcript: str, target_text: str) -> Dict[str, Any]:
        """Simple rule-based scoring without MFA durations, fallback."""
        target_words = [w.strip(" ,.?!") for w in target_text.lower().split() if w.strip(" ,.?!")]
        spoken_words = [w.strip(" ,.?!") for w in transcript.lower().split() if w.strip(" ,.?!")]
        
        errors = []
        total_penalty = 0
        total_word_score = 0
        
        for i, target_word in enumerate(target_words):
            target_phones = self.get_target_phonemes(target_word)
            
            # Find closest spoken word
            match_score = 0
            if i < len(spoken_words):
                spoken_word = spoken_words[i]
                spoken_phones = self.get_target_phonemes(spoken_word)
                match_score, messages = self._compute_word_score_detailed(target_phones, spoken_phones, None)
            else:
                match_score = 0
                messages = ["Word missing"]
                
            total_word_score += match_score
            
            if match_score < 75 and i < len(spoken_words):
                for msg in messages:
                    errors.append({
                        "word_index": i,
                        "word": target_word,
                        "error_type": "phoneme_error",
                        "severity": "moderate",
                        "message": msg,
                        "penalty": 0 # accounted in score
                    })
            elif match_score == 0:
                 errors.append({
                    "word_index": i,
                    "word": target_word,
                    "error_type": "missing_word",
                    "severity": "severe",
                    "message": "Word completely missing or incorrect",
                    "penalty": 0 # accounted in score
                })

        avg_score = total_word_score / len(target_words) if target_words else 0
        total_score = max(0.0, min(100.0, float(avg_score)))

        return {
            "total_score": round(total_score),
            "errors": errors,
            "asr_transcript": transcript,
            "overall_feedback": f"Processed using text-matching without exact phonetic alignment. (Score: {round(total_score)}%)"
        }
        
    def _calculate_scores(self, target_text: str, words_tier, phones_tier, transcript: str) -> Dict[str, Any]:
        """Parse MFA Tiers and score against target."""
        # 1. Structure the spoken phonemes from MFA
        spoken_mfa_words = []
        for interval in words_tier:
            word = interval.mark.strip()
            if not word or word == 'sil' or word == 'sp':
                continue
                
            word_phones = []
            for p_int in phones_tier:
                if p_int.minTime >= interval.minTime and p_int.maxTime <= interval.maxTime:
                    p = p_int.mark.strip()
                    if p and p != 'sil' and p != 'sp':
                        word_phones.append({
                            "phone": p.rstrip('012'),
                            "duration": p_int.maxTime - p_int.minTime
                        })
            spoken_mfa_words.append({
                "word": word,
                "phones": word_phones
            })

        target_words = [w.strip(" ,.?!") for w in target_text.lower().split() if w.strip(" ,.?!")]
        
        errors = []
        total_word_score = 0
        
        for i, target_word in enumerate(target_words):
            target_phones = self.get_target_phonemes(target_word)
            
            if i < len(spoken_mfa_words):
                spoken_phones_data = spoken_mfa_words[i]["phones"]
                spoken_phones = [p["phone"] for p in spoken_phones_data]
                
                score, penalty_messages = self._compute_word_score_detailed(target_phones, spoken_phones, spoken_phones_data)
                total_word_score += score
                
                if score < 80:
                    for msg in penalty_messages:
                        errors.append({
                            "word_index": i,
                            "word": target_word,
                            "error_type": "phoneme_error",
                            "severity": "moderate",
                            "message": msg,
                            "penalty": 0
                        })
            else:
                total_word_score += 0
                errors.append({
                    "word_index": i,
                    "word": target_word,
                    "error_type": "missing_word",
                    "severity": "severe",
                    "message": "Word missing in spoken text",
                    "penalty": 0
                })

        avg_score = total_word_score / len(target_words) if target_words else 0
        
        return {
            "total_score": round(max(0.0, min(100.0, float(avg_score)))),
            "errors": errors,
            "asr_transcript": transcript,
            "overall_feedback": f"MFA aligned: Word Score: {round(avg_score)}%"
        }
        
    def _compute_word_score_detailed(self, target_phones: List[str], spoken_phones: List[str], spoken_data: Optional[List[Dict]] = None) -> Tuple[float, List[str]]:
        """
        Word Score = 
          50% phoneme match
          20% vowel accuracy
          15% consonant ending
          15% duration similarity
        """
        if not target_phones:
            return 100.0, [] 
            
        if not spoken_phones:
            return 0.0, ["Word skipped or completely wrong"]
            
        messages = []
        
        # 1. Phoneme Match (50%)
        matches = sum(1 for p in target_phones if p in spoken_phones)
        phoneme_match_pct = matches / len(target_phones)
        score_match = 50.0 * phoneme_match_pct
        
        if phoneme_match_pct < 1.0:
            missing = set(target_phones) - set(spoken_phones)
            if missing:
                messages.append(f"Missing sound: {', '.join(missing)}")
        
        # 2. Vowel accuracy (20%)
        target_vowels = [p for p in target_phones if self.is_vowel(p)]
        spoken_vowels = [p for p in spoken_phones if self.is_vowel(p)]
        
        score_vowel = 20.0
        if target_vowels:
            vowel_matches = sum(1 for v in target_vowels if v in spoken_vowels)
            score_vowel = 20.0 * (vowel_matches / len(target_vowels))
            if vowel_matches < len(target_vowels):
                messages.append("Mispronounced vowel.")
                
        # 3. Consonant ending (15%)
        score_ending = 15.0
        last_is_cons = not self.is_vowel(target_phones[-1])
        if last_is_cons:
            if spoken_phones[-1] != target_phones[-1]:
                score_ending = 0.0
                messages.append(f"Wrong or missing consonant ending.")
                
        # 4. Duration similarity (15%)
        score_duration = 15.0
        if spoken_data and len(spoken_data) > 0:
            avg_duration = sum(p["duration"] for p in spoken_data) / len(spoken_data)
            if avg_duration < 0.03 or avg_duration > 0.4:
                score_duration -= 10.0
                messages.append("Duration problem: too fast or held too long.")
                
        total = score_match + score_vowel + score_ending + score_duration
        return total, messages

# Singleton instance
rule_engine = MFAPronunciationScorer()
