FROM python:3.11-alpine

WORKDIR /app

# Install required Python dependencies
RUN pip install --no-cache-dir emoji

# Copy project files
COPY . .

# Run the parser to generate data.json
RUN python Parser/parser.py

# Switch to Web directory and serve
WORKDIR /app/Web

EXPOSE 8080

CMD ["python", "-m", "http.server", "8080", "--bind", "0.0.0.0"]