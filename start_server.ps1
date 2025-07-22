# Active l'environnement virtuel
& ../.venv/Scripts/Activate.ps1

# Ajout du token ngrok (inutile si déjà configuré une fois)
ngrok config add-authtoken "2zN52wTS0BPYkfPOOdJhkJ0RHF3_4jVLHrPjeb1Kjo95pCQug"

# Lancer le serveur Django en arrière-plan
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "manage.py", "runserver", "8000"

# Lancer ngrok sur le port 8000
Start-Process -NoNewWindow -FilePath "ngrok" -ArgumentList "http", "8000"

# Attendre que ngrok initialise le tunnel
Start-Sleep -Seconds 2

# Récupérer l'URL publique générée par ngrok
$response = Invoke-RestMethod http://127.0.0.1:4040/api/tunnels
$NGROK_URL = ($response.tunnels | Where-Object { $_.proto -eq "https" }).public_url

Write-Host "URL publique : $NGROK_URL"