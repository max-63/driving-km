let watchId = null;
let positions = [];
let totalDistance = 0;
let startTime = null;
let lastTimestamp = null;
const MIN_DISTANCE_THRESHOLD = 0.01; // 10 mètres




function haversine(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }
  const R = 6371; // rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const distanceDiv = document.getElementById("distanceValue");
  const speedDiv = document.getElementById("speedValue");

  const distanceInput = document.getElementById("distanceInput");
  const durationInput = document.getElementById("durationInput");
  const distanceForm = document.getElementById("distanceForm");

  startBtn.onclick = () => {
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée");
      return;
    }

    positions = [];
    totalDistance = 0;
    lastTimestamp = null;
    distanceDiv.textContent = "0 km";
    speedDiv.textContent = "0 km/h";
    startTime = new Date();

    startBtn.disabled = true;
    stopBtn.disabled = false;

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const currentTime = new Date().getTime();

        if (positions.length > 0) {
          const last = positions[positions.length - 1];
          const timeDelta = (currentTime - lastTimestamp) / 1000; // secondes
          const dist = haversine(last.latitude, last.longitude, latitude, longitude);

          if (dist >= MIN_DISTANCE_THRESHOLD && timeDelta > 0) {
            const speed = (dist / timeDelta) * 3600; // km/h

            speedDiv.textContent = `Vitesse instantanée : ${speed.toFixed(1)} km/h`;
            totalDistance += dist;
            distanceDiv.textContent = `Distance parcourue : ${totalDistance.toFixed(2)} km`;



            positions.push({ latitude, longitude });
            lastTimestamp = currentTime;
          }
        } else {
          positions.push({ latitude, longitude });
          lastTimestamp = currentTime;
        }
      },
      (err) => {
        alert("Erreur géolocalisation: " + err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );
  };

  stopBtn.onclick = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }

    startBtn.disabled = false;
    stopBtn.disabled = true;

    const endTime = new Date();
    const durationSec = Math.floor((endTime - startTime) / 1000);

    distanceInput.value = totalDistance.toFixed(3);
    durationInput.value = durationSec;

    distanceForm.submit();
  };
});
