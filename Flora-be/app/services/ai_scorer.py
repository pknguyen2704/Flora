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
    
    async def assess_pronunciation(
        self,
        audio_transcript: str,
        target_text: str,
        penalty_config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Assess pronunciation using Gemini AI.
        
        For now, this is a simplified version that compares transcription to target.
        In production, you would:
        1. Use speech-to-text to get the transcript
        2. Use Gemini to analyze phonetic differences
        3. Detect specific error types
        """
        
        prompt = f"""You are an English pronunciation expert. Compare the student's speech transcript with the target text and identify pronunciation errors.

Target text: "{target_text}"
Student's transcript: "{audio_transcript}"

Strictly identify errors in these categories:
1. wrong_word: Student said a different word or completely mispronounced it.
2. missing_word: Student skipped a word.
3. phoneme_error: Student pronounced a specific sound incorrectly (e.g., /θ/ as /t/, /r/ as /w/).
4. ending_sound: Student dropped the final sound of a word (e.g., 'cat' becomes 'ca').
5. clarity_speed: Speech was mumbled, unclear, too fast, or too slow.

CRITICAL: If the student's speech content is COMPLETELY unrelated to the target text (e.g., Target: "Sit down", Transcript: "One two three"), set "off_topic" to true in the JSON response and ignore specific errors.

For each error, provide:
1. word_index: The index of the word in the Target Text (0-indexed).
2. word: The specific word from the Target Text.
3. error_type: One of the 5 categories above.
4. severity: "mild", "moderate", or "severe".
5. message: A specific explanation of what went wrong (e.g., "You pronounced /θ/ as /t/").

Return ONLY a valid JSON object with this structure:
{{
  "off_topic": false, // Set to true if the speech is completely unrelated to target
  "errors": [
    {{
      "word_index": 0,
      "word": "example",
      "error_type": "phoneme_error",
      "severity": "moderate",
      "message": "You pronounced the 'th' sound like a 'd'."
    }}
  ],
  "overall_feedback": "A brief summary of the student's performance."
}}
"""
        
        try:
            # Configure safety settings to be permissive for educational analysis
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE",
                },
            ]

            response = self.model.generate_content(prompt, safety_settings=safety_settings)
            
            # Robust response handling
            if not response.candidates or not response.candidates[0].content.parts:
                print(f"Gemini returned an empty or blocked assessment response. Finish reason: {response.candidates[0].finish_reason if response.candidates else 'Unknown'}")
                raise ValueError("No valid response parts returned from Gemini")

            result_text = response.text
            
            # Extract JSON from response (handle markdown code blocks)
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0].strip()
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0].strip()
            
            ai_result = json.loads(result_text)
            
            # Check for off-topic speech (completely unrelated)
            if ai_result.get("off_topic", False):
                return {
                    "total_score": 0,
                    "errors": [{
                        "word_index": 0,
                        "word": "All",
                        "error_type": "wrong_word",
                        "severity": "severe",
                        "message": "Spoken text is completely different from target. (Deducted 100 points)",
                        "penalty": 100
                    }],
                    "asr_transcript": audio_transcript,
                    "overall_feedback": ai_result.get("overall_feedback", "Your speech was completely unrelated to the target text.")
                }
            
            # Calculate score based on errors and penalties
            errors = ai_result.get("errors", [])
            total_penalty = 0
            
            for error in errors:
                error_type = error.get("error_type", "")
                severity = error.get("severity", "mild")
                
                if error_type in penalty_config:
                    penalty = penalty_config[error_type].get(severity, 5)
                    error["penalty"] = penalty
                    total_penalty += penalty
                else:
                    error["penalty"] = 5
                    total_penalty += 5
                
                # Append penalty info to the message
                error["message"] = f"{error.get('message', '')} (Deducted {error['penalty']} points)"
            
            score = max(0, 100 - total_penalty)
            
            return {
                "total_score": score,
                "errors": errors,
                "asr_transcript": audio_transcript,
                "overall_feedback": ai_result.get("overall_feedback", "")
            }
            
        except Exception as e:
            # Fallback for errors
            return {
                "total_score": None,
                "errors": [],
                "asr_transcript": audio_transcript,
                "suggestions": ["AI service temporarily unavailable. Please try again."],
                "error": str(e)
            }
    
# Singleton instance
gemini_scorer = GeminiScorer()
