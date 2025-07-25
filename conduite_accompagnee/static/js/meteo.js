// let meteoHistory1 = [];
// let meteoInterval = null;
// let sessionActive = false;


// function get_coordonnees() {
//     return new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject);
//     });
// }

// // === Météo ===
// async function fetchMeteo() {
//   try {
//     const position = await get_coordonnees(); // attend la position
//     lastCoords = position.coords;

//     const url = `/api/meteo?lat=${lastCoords.latitude}&lon=${lastCoords.longitude}`;
//     const response = await fetch(url);

//     const meteo = await response.json();
//     meteoHistory1.push(meteo);
//     console.log("📡 Météo ajoutée :", meteo);
//   } catch (error) {
//     console.error("❌ Erreur fetch météo :", error);
//   }
// }


// function getMeteoLaPlusFrequente() {
//   const compteur = new Map();

//   for (const meteo of meteoHistory1) {
//     const key = JSON.stringify(meteo);
//     compteur.set(key, (compteur.get(key) || 0) + 1);
//   }

//   let frequentKey = null;
//   let max = 0;

//   for (const [key, count] of compteur.entries()) {
//     if (count > max) {
//       max = count;
//       frequentKey = key;
//     }
//   }

//   return frequentKey ? JSON.parse(frequentKey) : null;
// }

// // === Session GPS ===
// let watchId = null;

// let lastCoords = null;


// function startSession() {
//   if (sessionActive) return;
//   sessionActive = true;

//   document.getElementById("startBtn").disabled = true;
//   document.getElementById("stopBtn").disabled = false;

//   // Reset session
//   meteoHistory1 = [];
//   lastCoords = null;


//   fetchMeteo(); // premier fetch météo immédiat
//   meteoInterval = setInterval(fetchMeteo, 60000); // toutes les minutes

//   // Démarrer la géolocalisation
//   watchId = navigator.geolocation.watchPosition(
//     handlePosition,
//     error => console.error("Erreur GPS :", error),
//     { enableHighAccuracy: true }
//   );

//   console.log("🚦 Session démarrée");
// }

// function stopSession() {
//   if (!sessionActive) return;
//   sessionActive = false;

//   clearInterval(meteoInterval);
//   navigator.geolocation.clearWatch(watchId);


//   const meteoFinale = getMeteoLaPlusFrequente();
//   console.log("🛑 Session arrêtée");
//   console.log("📊 Météo retenue :", meteoFinale);

// }



// // === Événements boutons ===
// document.getElementById("startBtn").addEventListener("click", startSession);
// document.getElementById("stopBtn").addEventListener("click", stopSession);
