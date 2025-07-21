# start_server.ps1

# Ajout du token ngrok (inutile si déjà fait)
ngrok config add-authtoken 2zN52wTS0BPYkfPOOdJhkJ0RHF3_4jVLHrPjeb1Kjo95pCQug

# Lancer le serveur Django en tâche de fond
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "mana.py runserver 8000"

# Lancer ngrok dans la console active
ngrok http 8000
