FROM continuumio/miniconda3:latest

WORKDIR /app

# Install system dependencies (ffmpeg is needed for Whisper and MFA)
RUN apt-get update && apt-get install -y ffmpeg libsndfile1 && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Montreal Forced Aligner via conda first, along with Python 3.10
RUN conda create -n flora_env -c conda-forge python=3.10 montreal-forced-aligner -y

# Make RUN commands use the new environment
SHELL ["conda", "run", "-n", "flora_env", "/bin/bash", "-c"]

# Download English acoustic models and dictionary for MFA
RUN mfa model download acoustic english_us_arpa
RUN mfa model download dictionary english_us_arpa

# Install Python requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start FastAPI server
CMD ["conda", "run", "-n", "flora_env", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
