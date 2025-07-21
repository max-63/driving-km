@echo off
REM Ajout du token ngrok (inutile si déjà configuré une fois)
ngrok config add-authtoken 2zN52wTS0BPYkfPOOdJhkJ0RHF3_4jVLHrPjeb1Kjo95pCQug

REM Lancer le serveur Django en arrière-plan (dans une nouvelle fenêtre)
start python manage.py runserver 8000

REM Lancer ngrok sur le port 8000
ngrok http 8000
