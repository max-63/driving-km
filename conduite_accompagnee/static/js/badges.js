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

  function updateProgress(km, container = document) {
    const badgeEls = Array.from(container.querySelectorAll(".badge"));
    const segmentEls = Array.from(container.querySelectorAll(".segment"));

    const kmValues = badgeEls.map(el => parseInt(el.dataset.km));

    const distances = [];
    for (let i = 1; i < kmValues.length; i++) {
      distances.push(kmValues[i] - kmValues[i - 1]);
    }

    // S’assurer que chaque segment contient un élément ".fill"
    segmentEls.forEach((segment) => {
      if (!segment.querySelector('.fill')) {
        const fill = document.createElement("div");
        fill.classList.add("fill");
        segment.appendChild(fill);
      }
    });

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

      if (badgeKm <= km) {
        el.classList.add("unlocked");
        el.classList.remove("locked");
        if (img) img.src = `${static_url}imgs/badges/${badgeKm}.png`;
      } else {
        el.classList.remove("unlocked");
        el.classList.add("locked");
        if (img) img.src = `${static_url}imgs/badges/${badgeKm}_locked.png`;
      }
    });
  }


  // Trouver le badge actuel
  let current_badge = null;
  const distance_possibles = {
    100: 0,
    250: 0,
    500: 0,
    1000: 0,
    2000: 0,
    3000: 0,
  };

  for (const distStr of Object.keys(distance_possibles)) {
    const dist = parseInt(distStr, 10);
    if (dist <= totalKm) {
      current_badge = dist;
    }
  }

  console.log("Badge actuel:", current_badge);


  const chemin_image_current_badge = `${static_url}imgs/badges/${current_badge}.png`;

  const divBtn = document.getElementById("badge-btn-popup");
  // Assure-toi que divBtn a position relative (pour positionner le cercle à l’intérieur)
  divBtn.style.position = "relative";

  const cercle_qui_contient_l_image = document.createElement("div");
  cercle_qui_contient_l_image.style.width = "50px";
  cercle_qui_contient_l_image.style.height = "50px";
  cercle_qui_contient_l_image.style.borderRadius = "50%";
  cercle_qui_contient_l_image.style.overflow = "hidden";
  cercle_qui_contient_l_image.style.display = "flex";
  cercle_qui_contient_l_image.style.justifyContent = "center";
  cercle_qui_contient_l_image.style.alignItems = "center";
  cercle_qui_contient_l_image.style.backgroundColor = "rgba(255, 255, 255, 0)";
  cercle_qui_contient_l_image.style.position = "absolute";
  cercle_qui_contient_l_image.style.top = "-15px";      // un petit espace du haut
  cercle_qui_contient_l_image.style.right = "-10px";    // un petit espace de la droite
  cercle_qui_contient_l_image.style.zIndex = "1000";
  cercle_qui_contient_l_image.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";

  const img = document.createElement("img");
  img.id="current_badge";
  img.src = chemin_image_current_badge;
  img.style.width = "auto";
  img.style.height = "40px"; // un peu plus petit que le cercle
  img.alt = "Badge actuel";

  cercle_qui_contient_l_image.appendChild(img);
  divBtn.appendChild(cercle_qui_contient_l_image);




document.getElementById('current_badge').addEventListener('click', function() {
  Swal.fire({
    title: 'Mes badges',
    html: `
      <div class="badge-list" id="badge-list" style="display: flex; flex-direction: column; gap: 15px; align-items: center;">
        <div style="display: flex; gap: 10px;">
          <img src="${static_url}imgs/badges/${totalKm >= 100 ? '100.png' : '100_locked.png'}" alt="Badge 100 km" width="60" />
          <img src="${static_url}imgs/badges/${totalKm >= 250 ? '250.png' : '250_locked.png'}" alt="Badge 250 km" width="60" />
          <img src="${static_url}imgs/badges/${totalKm >= 500 ? '500.png' : '500_locked.png'}" alt="Badge 500 km" width="60" />
        </div>
        <div style="display: flex; gap: 10px;">
          <img src="${static_url}imgs/badges/${totalKm >= 1000 ? '1000.png' : '1000_locked.png'}" alt="Badge 1000 km" width="60" />
          <img src="${static_url}imgs/badges/${totalKm >= 1500 ? '1500.png' : '1500_locked.png'}" alt="Badge 2000 km" width="60" />
          <img src="${static_url}imgs/badges/${totalKm >= 2000 ? '2000.png' : '2000_locked.png'}" alt="Badge 2000 km" width="60" />
          <img src="${static_url}imgs/badges/${totalKm >= 3000 ? '3000.png' : '3000_locked.png'}" alt="Badge 3000 km" width="60" />
        </div>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false
  });
});



});