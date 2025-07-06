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

        if (isNaN(carPrice) || isNaN(engineVolume) || !carAge || !fuelType) {
            calculationResult.innerHTML = "Пожалуйста, заполните все поля калькулятора.";
            calculationResult.classList.add('show');
            return;
        }

        let customsDuty = 0; // Таможенная пошлина
        let exciseTax = 0;   // Акциз
        let vat = 0;         // НДС (20% от суммы + пошлина + акциз)
        let totalCustoms = 0;

        // ВЛАДЕЛЕЦ: Здесь можно менять логику расчета и ставки
        // Эти значения нужно будет уточнить в соответствии с актуальными тарифами
        // Примерные ставки (сильно упрощенные для демонстрации):
        const USD_TO_EUR_RATE = 0.93; // Примерный курс
        const carPriceEUR = carPrice * USD_TO_EUR_RATE;

        // Таможенная пошлина (фиксированный процент от стоимости авто)
        if (carAge === '0-3') {
            customsDuty = carPriceEUR * 0.10; // 10% для новых
        } else if (carAge === '3-5') {
            customsDuty = carPriceEUR * 0.15; // 15% для средних
        } else { // 5+ лет
            customsDuty = carPriceEUR * 0.20; // 20% для старых
        }

        // Акциз (зависит от объема и типа топлива, сильно упрощено)
        if (fuelType === 'petrol' || fuelType === 'diesel') {
            if (engineVolume <= 1500) {
                exciseTax = engineVolume * 0.1; // 0.1 EUR/куб.см
            } else if (engineVolume <= 3000) {
                exciseTax = engineVolume * 0.5; // 0.5 EUR/куб.см
            } else {
                exciseTax = engineVolume * 1.5; // 1.5 EUR/куб.см
            }
        } else if (fuelType === 'electric') {
            exciseTax = 0; // Для электромобилей обычно нет акциза
        } else if (fuelType === 'hybrid') {
            exciseTax = engineVolume * 0.2; // Меньше для гибридов
        }

        // НДС (20% от суммы: стоимость + пошлина + акциз)
        vat = (carPriceEUR + customsDuty + exciseTax) * 0.20;

        totalCustoms = (customsDuty + exciseTax + vat) / USD_TO_EUR_RATE; // Переводим обратно в USD

        // Форматирование для вывода
        const formattedResult = `
            Ориентировочный расчет:<br>
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

    // Функция для обновления состояния логотипа
    const updateLogoOnScroll = () => {
        if (heroSection) {
            // Расчет, когда логотип должен начать анимироваться
            const triggerPoint = heroSection.offsetHeight * 0.2; // 20% высоты hero-секции
            if (window.scrollY > triggerPoint) {
                logo.classList.add('scrolled');
            } else {
                logo.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', updateLogoOnScroll);
    updateLogoOnScroll(); // Вызываем один раз при загрузке, чтобы установить начальное состояние

    // --- Parallax Effect (простая реализация на JS) ---
    // Этот эффект будет работать только для фоновых изображений, не для видео.
    const parallaxElements = document.querySelectorAll('.parallax-effect');

    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallaxSpeed) || 0.15; // Скорость из data-атрибута или 0.15 по умолчанию
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

        if (!canPlayMp4 && !canPlayWebm && !(heroVideo.readyState > 0 || heroVideo.networkState === 1)) {
            // Если браузер не может воспроизвести ни один из форматов И видео не загружается
            document.body.classList.add('video-disabled');
            console.log('Браузер не поддерживает форматы MP4 и WebM. Отображено фоновое изображение.');
        }
    }

    // --- Анимация появления секций при скролле (Intersection Observer) ---
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Срабатывает, когда 10% секции видно
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                entry.target.classList.remove('section-hidden');
                observer.unobserve(entry.target); // Отключаем наблюдение после появления
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('section-hidden'); // Добавляем класс для скрытия по умолчанию
        sectionObserver.observe(section);
    });

    // --- Smooth Scroll для якорей ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
