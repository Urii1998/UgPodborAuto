#!/usr/bin/env bash

# Создаем структуру
mkdir -p assets/{css,js,video,images,fonts}

# index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="UgPodborAuto — подбор и продажа авто из-за границы с доставкой и растаможкой">
  <title>UgPodborAuto - авто из-за границы</title>
  <!-- Критический inline CSS -->
  <style>
    body { margin:0; font-family: sans-serif; }
    .cta-button { background:#f9ca24; color:#000; padding:1rem 2rem; text-decoration:none; display:inline-block; border-radius:2rem; transition: transform .3s; }
    .cta-button:hover { transform: scale(1.05); }
  </style>
  <link rel="stylesheet" href="style.css">
  <link rel="manifest" href="manifest.json">
</head>
<body>
  <!-- Hero-секция -->
  <section id="hero">
    <video autoplay muted loop playsinline id="bg-video">
      <source src="assets/video/hero.mp4" type="video/mp4">
      <source src="assets/video/hero.webm" type="video/webm">
      <img src="assets/images/hero-fallback.webp" alt="Авто на дороге">
    </video>
    <div id="logo">
      <!-- вставьте сюда ваш SVG-логотип -->
      <img src="assets/images/logo.svg" alt="UgPodborAuto">
    </div>
    <a href="https://t.me/UgPodborA" class="cta-button">Бесплатная консультация</a>
  </section>

  <!-- Калькулятор растаможки -->
  <section id="calculator">
    <h2>Калькулятор растаможки</h2>
    <form id="calc-form">
      <label>Стоимость авто (EUR):<input type="number" name="price" placeholder="Например, 10000" required></label>
      <label>Объем двигателя (л):<input type="number" step="0.1" name="cc" placeholder="2.0" required></label>
      <button type="submit">Рассчитать</button>
    </form>
    <div id="calc-result"></div>
  </section>

  <!-- Галерея с 3D-эффектами -->
  <section id="gallery">
    <h2>Наши авто</h2>
    <div class="gallery-grid"></div>
  </section>

  <script src="script.js" defer></script>
</body>
</html>
EOF

# style.css
cat > style.css << 'EOF'
/* Mobile-first стили */
body { font-size:16px; line-height:1.5; background:#fff; color:#333; }
#hero { position:relative; height:100vh; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; }
#bg-video { position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:-1; }
.cta-button { /* см. inline */ }
#calculator { padding:2rem; background:#f4f4f4; }
#calc-form label { display:block; margin-bottom:1rem; }
#calc-form button { background:#f9ca24; border:none; padding:.5rem 1rem; cursor:pointer; }
#gallery { padding:2rem 1rem; }
.gallery-grid { display:grid; grid-template-columns:1fr; gap:1rem; }
@media(min-width:600px) { .gallery-grid { grid-template-columns: repeat(2,1fr); } }
@media(min-width:900px) { .gallery-grid { grid-template-columns: repeat(3,1fr); } }
.card { perspective:1000px; }
.card-inner { transform-style: preserve-3d; transition: transform .6s; }
.card:hover .card-inner { transform: rotateY(15deg) rotateX(5deg); }
#logo { position:fixed; top:1rem; left:1rem; width:100px; transition: transform .3s; }
.scrolled #logo { transform: scale(.8) rotate(10deg); }
EOF

# script.js
cat > script.js << 'EOF'
// Анимация логотипа при скролле
window.addEventListener('scroll', ()=>{
  document.documentElement.classList.toggle('scrolled', window.scrollY>50);
});

// Калькулятор растаможки
const form = document.getElementById('calc-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const price = +form.price.value;
  const cc = +form.cc.value;
  const duty = price*0.1 + cc*100; // пример формулы
  document.getElementById('calc-result').textContent = `Примерная растаможка: €${duty.toFixed(2)}`;
});

// Галерея с 3D-карточками
const gallery = document.querySelector('.gallery-grid');
const images = ['car1','car2','car3','car4'];
images.forEach(name=>{
  const card = document.createElement('div');
  card.className='card';
  card.innerHTML = \`
    <div class="card-inner">
      <picture>
        <source srcset="assets/images/\${name}.avif" type="image/avif">
        <source srcset="assets/images/\${name}.webp" type="image/webp">
        <img src="assets/images/\${name}.webp" alt="\${name}">
      </picture>
    </div>\`;
  gallery.append(card);
});
EOF

# manifest.json (PWA)
cat > manifest.json << 'EOF'
{
  "name": "UgPodborAuto",
  "short_name": "UgPodbor",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f9ca24",
  "icons": [
    {
      "src": "assets/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

# service-worker.js (PWA offline)
cat > service-worker.js << 'EOF'
const CACHE_NAME = 'ugpodborauto-v1';
const ASSETS = [
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
  // добавьте пути к статике: видео, изображения, шрифты
];
self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('fetch', evt => {
  evt.respondWith(
    fetch(evt.request).catch(() => caches.match(evt.request).then(r => r || caches.match('/index.html')))
  );
});
EOF

echo "Все файлы созданы! Теперь вы можете открыть проект в VSCode или любом редакторе."
