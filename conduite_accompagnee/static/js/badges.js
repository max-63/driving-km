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
  cercle_qui_contient_l_image.style.backgroundColor = "#8bffffff";
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
      title: 'Badges',
      html: `
      
        <div id="progress-container">
        <div id="badges">

          

          <!-- Badge 100 -->
          <div class="wrapper wrapper-100">
            <div class="badge" data-km="100">
              <img src="${static_url}imgs/badges/100.png" alt="Badge 100 km" />
            </div>
            <div class="segment"></div>
          </div>

          <!-- Badge 250 -->
          <div class="wrapper">
            <div class="badge" data-km="250">
              <img src="${static_url}imgs/badges/250.png" alt="Badge 250 km" />
            </div>
            <div class="segment"></div>
          </div>

          <!-- Badge 500 -->
          <div class="wrapper">
            <div class="badge" data-km="500">
              <img src="${static_url}imgs/badges/500.png" alt="Badge 500 km" />
            </div>
            <div class="segment"></div>
          </div>

          <!-- Badge 1000 -->
          <div class="wrapper">
            <div class="badge" data-km="1000">
              <img src="${static_url}imgs/badges/1000.png" alt="Badge 1000 km" />
            </div>
            <div class="segment"></div>
          </div>

          <!-- Badge 1500 -->
          <div class="wrapper">
            <div class="badge" data-km="1500">
              <img src="${static_url}imgs/badges/1500.png" alt="Badge 1500 km" />
            </div>
            <div class="segment"></div>
          </div> 

          <!-- Badge 2000 -->
          <div class="wrapper">
            <div class="badge" data-km="2000">
              <img src="${static_url}imgs/badges/2000.png" alt="Badge 2000 km" />
            </div>
            <div class="segment"></div>
          </div>

          <!-- Badge 3000 (dernier, pas de segment) -->
          <div class="wrapper">
            <div class="badge" data-km="3000">
              <img src="${static_url}imgs/badges/3000.png" alt="Badge 3000 km" />
            </div>
          </div>
        </div>
      </div>
      
      `,
      showCloseButton: true,
      showConfirmButton: false,
      showCancelButton: false,
      didOpen: () => {
        const popupContainer = document.querySelector("#progress-container");
        updateProgress(parseInt(totalKm), popupContainer);

      },
    })
  })
});