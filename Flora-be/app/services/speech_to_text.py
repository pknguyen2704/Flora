"""Speech-to-text service using Gemini AI with native audio support."""
import google.generativeai as genai
from app.core.config import settings
from typing import Optional
import base64


class SpeechToTextService:
    """Service for converting audio to text using Gemini AI."""
    
    def __init__(self):
        """Initialize the Gemini client."""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Use Gemini 1.5 Flash which has excellent audio support and is faster
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    async def transcribe_audio(
        self,
        audio_content: bytes,
        language_code: str = "en-US"
    ) -> Optional[str]:
        """
        Transcribe audio to text using Gemini with inline audio.
        
        Args:
            audio_content: Audio file content in bytes
            language_code: Language code (default: en-US)
            
        Returns:
            Transcribed text or None if transcription fails
        """
        try:
            print(f"Transcribing audio ({len(audio_content)} bytes) with {settings.GEMINI_MODEL}")
            
            # Create inline audio data
            audio_data = {
                "mime_type": "audio/webm",
                "data": base64.b64encode(audio_content).decode('utf-8')
            }
            
            # Create prompt for transcription
            prompt = """Please transcribe this audio exactly as spoken in English. 
            Return ONLY the transcribed text, nothing else.
            Do not add any explanations, formatting, or extra text."""
            
            # Configure safety settings to be permissive for educational transcription
            # This helps prevent false-positive blocks
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

            # Generate transcription with inline audio
            response = self.model.generate_content(
                [
                    prompt,
                    {"mime_type": "audio/webm", "data": audio_content}
                ],
                safety_settings=safety_settings
            )
            
            # Robust response handling
            if not response.candidates or not response.candidates[0].content.parts:
                print(f"Gemini returned an empty or blocked response. Finish reason: {response.candidates[0].finish_reason if response.candidates else 'Unknown'}")
                return None

            transcript = response.text.strip()
            print(f"Transcription successful: {transcript}")
            
            return transcript if transcript else None
            
        except Exception as e:
            print(f"Gemini transcription error: {str(e)}")
            import traceback
            traceback.print_exc()
            return None


# Singleton instance
speech_service = SpeechToTextService()
