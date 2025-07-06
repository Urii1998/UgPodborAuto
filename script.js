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
