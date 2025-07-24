let map;
let userMarker;
let routeLine;

window.onload = () => {
  initMap();
  locateUser();
};

function initMap() {
  map = L.map("map").setView([46.5, 2.5], 6); // Centré France

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 19,
  }).addTo(map);
}

function locateUser() {
  if (!navigator.geolocation) {
    alert("Ton navigateur ne supporte pas la géolocalisation.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      console.log("🛰 Position détectée :", latitude, longitude);

      // if (userMarker) map.removeLayer(userMarker);
      // userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("📍 Tu es ici").openPopup();
      // map.setView([latitude, longitude], 13);

      // Stockage position pour itinéraire
      window.currentLocation = [longitude, latitude]; // ordre lng, lat pour ORS
    },
    err => {
      console.error("Erreur géolocalisation :", err);
      alert("Impossible de te localiser.");
    }
  );
}

async function getRoute() {
  const address = document.getElementById("destination").value;
  if (!address || !window.currentLocation) {
    alert("Remplis une adresse et attends la géolocalisation.");
    return;
  }

  const coords = await geocodeAddress(address);
  if (!coords) {
    alert("Adresse introuvable.");
    return;
  }

  fetchRoute(window.currentLocation, coords);
}

async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.length === 0) return null;
  const { lon, lat } = data[0];
  return [parseFloat(lon), parseFloat(lat)]; // ordre lng, lat
}

async function fetchRoute(start, end) {
  try {
    const res = await fetch("/api/ors_proxy/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coordinates: [start, end] })
    });

    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    const data = await res.json();

    displayRoute(data.features[0].geometry.coordinates);
  } catch (e) {
    console.error("Erreur itinéraire :", e);
    alert("Impossible de récupérer l'itinéraire.");
  }
}

function displayRoute(orsCoords) {
  const latlngs = orsCoords.map(([lng, lat]) => [lat, lng]); // Leaflet = [lat, lng]

  if (routeLine) map.removeLayer(routeLine);
  routeLine = L.polyline(latlngs, { color: "blue", weight: 5 }).addTo(map);
  map.fitBounds(routeLine.getBounds());
}
