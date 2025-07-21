@echo off
REM Active l'environnement virtuel
call .venv\Scripts\activate.bat

REM Ajout du token ngrok (inutile si déjà configuré une fois)
ngrok config add-authtoken 2zN52wTS0BPYkfPOOdJhkJ0RHF3_4jVLHrPjeb1Kjo95pCQug

REM Lance le serveur Django en arrière-plan (avec start pour ne pas bloquer)
start /b python manage.py runserver 8000

REM Lance ngrok sur le port 8000 (affiche l'URL publique)
ngrok http 8000
