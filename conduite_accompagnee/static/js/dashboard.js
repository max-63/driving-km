
let sessionActive = false;
let meteoHistory = [];
let positions = [];
let totalDistance = 0;
let startTime = null;
let lastTimestamp = null;
let watchId = null;

const url_meteo = document.getElementById("url_meteo").getAttribute("data");

const MIN_DISTANCE_THRESHOLD = 0.01; // 10m
const distanceDiv = document.getElementById("distanceValue");
const speedDiv = document.getElementById("speedValue");
const distanceInput = document.getElementById("distanceInput");
const durationInput = document.getElementById("durationInput");
const meteoInput = document.getElementById("meteoInput");
const distanceForm = document.getElementById("distanceForm");

// Fonction de calcul distance
function haversine(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Récupération météo
async function fetchMeteo(lat, lon) {
  try {

    const url = `${url_meteo}?lat=${lat}&lon=${lon}`;
    const response = await fetch(url);
    const meteo = await response.json();
    meteoHistory.push(meteo);
    console.log("📡 Météo ajoutée :", meteo);
  } catch (error) {
    console.error("❌ Erreur fetch météo :", error);
  }
}

// Stat météo dominante
function getMeteoLaPlusFrequente() {
  const compteur = new Map();
  for (const meteo of meteoHistory) {
    const key = JSON.stringify(meteo);
    compteur.set(key, (compteur.get(key) || 0) + 1);
  }

  let frequentKey = null;
  let max = 0;

  for (const [key, count] of compteur.entries()) {
    if (count > max) {
      max = count;
      frequentKey = key;
    }
  }

  return frequentKey ? JSON.parse(frequentKey) : null;
}

// Démarrage session
function startSession() {
  if (sessionActive) return;
  if (!navigator.geolocation) {
    alert("Géolocalisation non supportée");
    return;
  }

  sessionActive = true;
  document.getElementById("startBtn").disabled = true;
  document.getElementById("stopBtn").disabled = false;

  positions = [];
  totalDistance = 0;
  lastTimestamp = null;
  meteoHistory = [];
  distanceDiv.textContent = "0 km";
  speedDiv.textContent = "0 km/h";
  startTime = new Date();

  watchId = navigator.geolocation.watchPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      const currentTime = new Date().getTime();

      if (positions.length > 0) {
        const last = positions[positions.length - 1];
        const timeDelta = (currentTime - lastTimestamp) / 1000;
        const dist = haversine(last.latitude, last.longitude, latitude, longitude);

        if (dist >= MIN_DISTANCE_THRESHOLD && timeDelta > 0) {
          const speed = (dist / timeDelta) * 3600;

          speedDiv.textContent = `Vitesse instantanée : ${speed.toFixed(1)} km/h`;
          totalDistance += dist;
          distanceDiv.textContent = `Distance parcourue : ${totalDistance.toFixed(2)} km`;

          positions.push({ latitude, longitude });
          lastTimestamp = currentTime;

          // Météo liée à cette position
          await fetchMeteo(latitude, longitude);
        }
      } else {
        positions.push({ latitude, longitude });
        lastTimestamp = currentTime;
        await fetchMeteo(latitude, longitude); // météo du tout début
      }
    },
    (err) => alert("Erreur géolocalisation: " + err.message),
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000,
    }
  );

  console.log("🚦 Session démarrée");
}

// Arrêt session
function stopSession() {
  if (!sessionActive) return;
  sessionActive = false;

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;

  const endTime = new Date();
  const durationSec = Math.floor((endTime - startTime) / 1000);
  const meteoFinale = getMeteoLaPlusFrequente();

  console.log("🛑 Session arrêtée");
  console.log("📊 Météo retenue :", meteoFinale);

  distanceInput.value = totalDistance.toFixed(3);
  durationInput.value = durationSec;
  console.log("📡 Météo finale envoyée :", meteoFinale);
  meteoInput.value = JSON.stringify(meteoFinale);

  distanceForm.submit();
}

// Boutons
document.getElementById("startBtn").addEventListener("click", startSession);
document.getElementById("stopBtn").addEventListener("click", stopSession);
