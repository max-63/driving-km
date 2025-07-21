#!/bin/bash

# Ajout du token ngrok (inutile si déjà configuré une fois)
ngrok config add-authtoken 2zN52wTS0BPYkfPOOdJhkJ0RHF3_4jVLHrPjeb1Kjo95pCQug

# Lancer le serveur Django en arrière-plan
python mana.py runserver 8000 &

# Lancer ngrok sur le port 8000 (affiche l'URL publique)
ngrok http 8000
