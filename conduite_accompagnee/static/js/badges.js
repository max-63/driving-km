document.addEventListener("DOMContentLoaded", () => {
  const totalKm = document.getElementById("tt-km").getAttribute("data");
  const static_url = document.getElementById("static_url").getAttribute("data");
  console.log('static_url', static_url);
  const badgeEls = Array.from(document.querySelectorAll(".badge"));
  const segmentEls = Array.from(document.querySelectorAll(".segment"));

  // Récupération des km de chaque badge
  const kmValues = badgeEls.map(el => parseInt(el.dataset.km));

  // Distances entre les badges (pour le % de progression par segment)
  const distances = [];
  for (let i = 1; i < kmValues.length; i++) {
    distances.push(kmValues[i] - kmValues[i - 1]);
  }

  // Largeur fixe pour chaque segment
  const segmentWidth = 100;
  segmentEls.forEach((segment) => {
    segment.style.flexGrow = "1"; // laisser le CSS gérer


    const fill = document.createElement("div");
    fill.classList.add("fill");
    segment.appendChild(fill);
  });

  function updateProgress(km) {
    let remainingKm = km - kmValues[0]; // km depuis le premier badge

    segmentEls.forEach((segment, i) => {
      const fill = segment.querySelector(".fill");
      const segmentDistance = distances[i];

      if (remainingKm >= segmentDistance) {
        fill.style.height = "100%";
      } else if (remainingKm > 0) {
        fill.style.height = `${(remainingKm / segmentDistance) * 100}%`;
      } else {
        fill.style.height = "0%";
      }

      remainingKm -= segmentDistance;
    });

    // Met à jour les badges débloqués
    badgeEls.forEach(el => {
      const badgeKm = parseInt(el.dataset.km);
      const img = el.querySelector("img");

      if (badgeKm <= totalKm) {
        el.classList.add("unlocked");
        el.classList.remove("locked");

        if (img) {
          // 💡 On reconstruit dynamiquement le chemin vers le badge actif
          img.src = `${static_url}imgs/badges/${badgeKm}.png`;
        }
      } else {
        el.classList.remove("unlocked");
        el.classList.add("locked");

        if (img) {
          // Image grisée ou désactivée (à adapter selon ton organisation)
          img.src = `${static_url}imgs/badges/${badgeKm}_locked.png`;
        }
      }
    });
  }

  updateProgress(totalKm);
});
