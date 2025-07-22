#!/bin/bash

# Active l'environnement virtuel
source ../.venv/bin/activate

# Ajout du token ngrok (inutile si déjà configuré une fois)
ngrok config add-authtoken 2zN52wTS0BPYkfPOOdJhkJ0RHF3_4jVLHrPjeb1Kjo95pCQug

# Lancer le serveur Django en arrière-plan
python manage.py runserver 8000 &

# Lancer ngrok sur le port 8000 (affiche l'URL publique)
ngrok http 8000

NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | grep -o 'https://[^"]*')
echo "🔗 URL publique : $NGROK_URL"
