document.addEventListener('DOMContentLoaded', () => {
    // --- Калькулятор растаможки ---
    const calculatorForm = document.getElementById('customs-calculator-form');
    const calculationResult = document.getElementById('calculation-result');

    calculatorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const carPrice = parseFloat(document.getElementById('car-price').value);
        const engineVolume = parseFloat(document.getElementById('engine-volume').value);
        const carAge = document.getElementById('car-age').value;
        const fuelType = document.getElementById('fuel-type').value;

        let customsDuty = 0; // Таможенная пошлина
        let exciseTax = 0;   // Акциз
        let vat = 0;         // НДС (20% от суммы + пошлина + акциз)
        let totalCustoms = 0;

        // Примеры расчетов (упрощено, реальные ставки сложнее)
        // Эти значения нужно будет уточнить в соответствии с актуальными тарифами
        // ВЛАДЕЛЕЦ: Здесь можно менять логику расчета и ставки
        switch (carAge) {
            case '0-3':
                customsDuty = carPrice * 0.2; // Пример: 20% от стоимости
                if (engineVolume > 3000) exciseTax = engineVolume * 1.5; // Пример: 1.5 USD за куб. см для больших объемов
                break;
            case '3-5':
                customsDuty = carPrice * 0.3; // Пример: 30%
                exciseTax = engineVolume * 0.8; // Пример: 0.8 USD за куб. см
                break;
            case '5+':
                customsDuty = carPrice * 0.4; // Пример: 40%
                exciseTax = engineVolume * 0.5; // Пример: 0.5 USD за куб. см
                break;
        }

        // Пример НДС
        vat = (carPrice + customsDuty + exciseTax) * 0.20;

        totalCustoms = customsDuty + exciseTax + vat;

        // Форматирование для вывода
        const formattedResult = `
            Примерный расчет растаможки:<br>
            Пошлина: $${customsDuty.toFixed(2)}<br>
            Акциз: $${exciseTax.toFixed(2)}<br>
            НДС: $${vat.toFixed(2)}<br>
            <br>
            <strong>Общая сумма: $${totalCustoms.toFixed(2)}</strong>
        `;

        calculationResult.innerHTML = formattedResult;
        calculationResult.classList.add('show'); // Показать результат
    });

    // --- Анимация логотипа при скролле ---
    const logo = document.getElementById('ugpodborauto-logo');
    const heroSection = document.getElementById('hero');
    const heroSectionHeight = heroSection.offsetHeight;

    window.addEventListener('scroll', () => {
        if (window.scrollY > heroSectionHeight * 0.1) { // Если проскроллили 10% Hero-секции
            logo.classList.add('scrolled');
        } else {
            logo.classList.remove('scrolled');
        }
    });

    // --- Parallax Effect (простая реализация на JS) ---
    const parallaxElements = document.querySelectorAll('.parallax-effect');

    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const speed = el.dataset.parallaxSpeed || 0.2; // Можно задать скорость в data-parallax-speed
            const yPos = -(window.scrollY * speed);
            el.style.backgroundPositionY = `${yPos}px`;
        });
    });

    // --- Fallback для видео (если видео не поддерживается или не загрузилось) ---
    const heroVideo = document.getElementById('hero-video');

    if (heroVideo) {
        heroVideo.addEventListener('error', () => {
            document.body.classList.add('video-disabled');
            console.log('Видео не загрузилось или не поддерживается. Отображено фоновое изображение.');
        });

        // Проверяем возможность воспроизведения видео
        const canPlayMp4 = heroVideo.canPlayType('video/mp4');
        const canPlayWebm = heroVideo.canPlayType('video/webm');

        if (!canPlayMp4 && !canPlayWebm) {
            document.body.classList.add('video-disabled');
            console.log('Браузер не поддерживает форматы MP4 и WebM. Отображено фоновое изображение.');
        }
    }

    // --- 3D-эффект для галереи при наведении (можно сделать на CSS, но JS для большей гибкости) ---
    // В данном случае, эффект реализован в CSS через transform: rotateY, что более производительно.
    // Если бы требовались более сложные 3D-манипуляции, JS был бы необходим.

    // Дополнительно: Smooth Scroll для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
