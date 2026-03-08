FROM continuumio/miniconda3:latest

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y ffmpeg libsndfile1 && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Montreal Forced Aligner via conda first, along with Python 3.10
RUN conda create -n flora_env -c conda-forge python=3.10 montreal-forced-aligner -y

# Make RUN commands use the new environment
SHELL ["conda", "run", "-n", "flora_env", "/bin/bash", "-c"]

# Install Python requirements
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download models to make the container ready-to-run.
# This includes MFA assets, NLTK cmudict, and HF models for the engine (Whisper + Wav2Vec2).
RUN mfa model download acoustic english_us_arpa && \
    mfa model download dictionary english_us_arpa && \
    python -m nltk.downloader cmudict && \
    python -c "from faster_whisper import WhisperModel; WhisperModel('tiny.en', device='cpu', compute_type='int8')" && \
    python -c "from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC; Wav2Vec2Processor.from_pretrained('facebook/wav2vec2-base-960h'); Wav2Vec2ForCTC.from_pretrained('facebook/wav2vec2-base-960h')"

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start FastAPI server
CMD ["conda", "run", "-n", "flora_env", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
