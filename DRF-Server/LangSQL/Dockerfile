# Base image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# Run using gunicorn (point to LangSQL.wsgi)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "LangSQL.wsgi:application"]
