"""Gemini AI pronunciation scorer."""
import google.generativeai as genai
from app.core.config import settings
from typing import Dict, Any, List
import json

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


class GeminiScorer:
    """AI-powered pronunciation scorer using Gemini."""
    
    def __init__(self):
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    async def assess_pronunciation_audio(
        self,
        audio_file: Any,
        target_text: str,
        penalty_config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Assess pronunciation by passing audio directly to Gemini 1.5 Pro.
        This prompt implements the exact rule-based scoring formula requested by the user.
        """
        
        prompt = f"""You are an advanced phonetics engine and English pronunciation expert.
I will provide you with an audio recording of a student speaking the following target text:
Target text: "{target_text}"

Your goal is to evaluate the student's pronunciation word-by-word, based on the following strict rule-based formula.
First, determine the correct phonemes for each word in the target text (similar to CMU Dict representation).
Then, analyze the phonemes actually spoken by the student in the audio.

CALCULATING WORD SCORE:
For each word, calculate a score out of 100 based on these exact criteria:
- 50% phoneme match: Are all the basic phonemes present? If they missed a phoneme, deduct proportionally from the 50 points.
- 20% vowel accuracy: Did they pronounce the vowel correctly? If the vowel is wrong, deduct 20 points.
- 15% consonant ending: Did they include the correct ending consonant? If missing or wrong, deduct 15 (or up to 30 if critical).
- 15% duration similarity: Was the duration of the word natural? If held too long or too short, deduct 10-15 points.

CRITICAL: If the student's speech content is COMPLETELY unrelated to the target text, set "off_topic" to true.

For each word in the target text, output any errors found. If a word was pronounced perfectly, you don't need to add it to the errors array.
If an error exists, provide:
1. word_index: The index of the word in the Target Text (0-indexed).
2. word: The specific word from the Target Text.
3. error_type: Use "phoneme_error", "missing_word", "wrong_word", "ending_sound", or "duration_error".
4. severity: "mild", "moderate", or "severe".
5. penalty: The deducted points for this word based on the rules (e.g. 20 for wrong vowel).
6. explanation: A specific explanation of what went wrong (e.g., "You pronounced the vowel 'AA' as 'AE'").

Finally, provide an overall "total_score" out of 100 for the entire sentence (average of all word scores), and the "asr_transcript" (what the student actually said).

Return ONLY a valid JSON object with this exact structure (no markdown tags, just raw JSON):
{{
  "off_topic": false,
  "total_score": 85,
  "asr_transcript": "what the student actually said",
  "errors": [
    {{
      "word_index": 0,
      "word": "example",
      "error_type": "phoneme_error",
      "severity": "moderate",
      "penalty": 20,
      "explanation": "You pronounced the vowel sound incorrectly."
    }}
  ],
  "overall_feedback": "A brief summary of their pronunciation."
}}
"""
        try:
            # Configure safety settings
            safety_settings = [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ]

            response = self.model.generate_content([audio_file, prompt], safety_settings=safety_settings)
            
            if not response.candidates or not response.candidates[0].content.parts:
                raise ValueError("No valid response parts returned from Gemini")

            result_text = response.text
            
            # Extract JSON from response
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0].strip()
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0].strip()
            
            ai_result = json.loads(result_text)
            
            if ai_result.get("off_topic", False):
                return {
                    "total_score": 0,
                    "errors": [{
                        "word_index": 0, "word": "All", "error_type": "wrong_word",
                        "severity": "severe", "penalty": 100,
                        "message": "Spoken text is completely different from target. (Deducted 100 points)"
                    }],
                    "asr_transcript": ai_result.get("asr_transcript", ""),
                    "overall_feedback": "Your speech was completely unrelated to the target text."
                }
            
            # Ensure proper message formatting for errors
            errors = ai_result.get("errors", [])
            for error in errors:
                penalty = error.get("penalty", 5)
                error["message"] = f"{error.get('explanation', 'Error')} (Deducted {penalty} points)"
                
            return {
                "total_score": ai_result.get("total_score", 0),
                "errors": errors,
                "asr_transcript": ai_result.get("asr_transcript", ""),
                "overall_feedback": ai_result.get("overall_feedback", "")
            }
            
        except Exception as e:
            return {
                "total_score": 0,
                "errors": [{"word": "All", "error_type": "system_error", "message": f"Assessment failed: {str(e)}", "penalty": 100}],
                "asr_transcript": "",
                "overall_feedback": "System error during assessment."
            }
            
# Singleton instance
gemini_scorer = GeminiScorer()
