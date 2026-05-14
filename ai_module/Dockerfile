FROM python:3.9-slim

WORKDIR /app

# Сначала копируем только файл со списком библиотек
COPY requirements.txt .

# Устанавливаем их
RUN pip install --no-cache-dir -r requirements.txt

# И только потом копируем всё остальное
COPY . .

EXPOSE 8000

CMD ["python", "main.py"]