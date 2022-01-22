window.addEventListener('DOMContentLoaded', function() {

    let myMap;
    const address = document.querySelector('.address');
    const searchCloseBtn = document.querySelector('.search-form__close');
    const searchBtn = document.querySelector('.search-btn');
    const searchForm = document.querySelector('.search-form');
    const navList = document.querySelector('.nav-list');
    const burger = document.querySelector('.burger');
    const navCloseBtn = document.querySelector('.nav-list__close');

    // contacts - карта
    // Функция ymaps.ready() будет вызвана, когда
    // загрузятся все компоненты API, а также когда будет готово DOM-дерево.
    try {
        ymaps.ready(init);
    } catch {
        console.log('Карта не загрузилась (');
    }

    function init(){
        // Создание карты.
        myMap = new ymaps.Map("map", {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: [55.760048926355296,37.61851887435427],

            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 13,
        });
        
        var myPlacemark = new ymaps.Placemark([55.76957995058716,37.639752236300616], {}, {
            iconLayout: 'default#image',
            iconImageHref: 'img/marker.svg',
            iconImageSize: [12, 12],
            iconImageOffset: [-3, -42],
        });

        // Размещение геообъекта на карте.
        myMap.geoObjects.add(myPlacemark);
    };

    // открытие и закрытие адреса на карте
    document.querySelector('.address-close').addEventListener('click', function(event) {
        if (event.target.tagName !== 'DIV') {
            address.classList.remove('is-active');
        }
    });

    document.querySelector('.address').addEventListener('click', function(event) {
        if (event.target.tagName === 'DIV' && !address.classList.contains('is-active')) {
            address.classList.add('is-active');
        }
    });

    // валидация формы 1
    new JustValidate('.subs-form', {
        rules: {
            email: {
                required: true,
                email: true
            },
        },
        colorWrong: '#F06666',
        colorWrongText: '#CACACA',
        focusWrongField: true,
        messages: {
            email: {
                required: 'Поле "E-mail" обязательно для заполнения',
                email: 'Недопустимый формат',
            },
        },
    })

    // валидация формы 2
    new JustValidate('.contacts__form', {
        rules: {
            name: {
                required: true,
                minLength: 2,
                maxLength: 30,
                function: onlyRussianLetters,
            },
            email: {
                required: true,
                email: true
            },
        },
        colorWrong: '#FF3030',
        colorWrongText: '#202020',
        focusWrongField: true,
        messages: {
            name: {
                required: 'Поле "Имя" обязательно для заполнения',
                minLength: 'Имя должно содержать не менее 2-х символов',
                maxLength: 'Имя должно содержать не более 30-ти символов',
                function: 'Недопустимый формат',
            },
            email: {
                required: 'Поле "E-mail" обязательно для заполнения',
                email: 'Недопустимый формат',
            },
        },
    })

    // нажатие на кнопку закрытия Поиска и закрытия поиска
    searchBtn.addEventListener('click', function(event) {
        event.preventDefault();
        searchForm.classList.add('is-active-form');
    })

    searchCloseBtn.addEventListener('click', function(event) {
        event.preventDefault();
        searchForm.classList.remove('is-active-form');
    })

    // нажатие на кнопку бургера и закрытия навигационного меню
    burger.addEventListener('click', function(event) {
        event.preventDefault();
        navList.classList.add('is-active');
    })

    navCloseBtn.addEventListener('click', function(event) {
        event.preventDefault();
        navList.classList.remove('is-active');
    })

    // плавная навигация по элементам главного меню
    document.querySelectorAll('.nav-link').forEach(function(navLink) {
        navLink.addEventListener('click', function(event) {

            event.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            const targetPosition = section.offsetTop;
            const startPosition = window.scrollY;            
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;

            window.requestAnimationFrame(step);

            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
        
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            }
        })
    })

    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2* (t * t * t + 2) + b;
    } 

    function onlyRussianLetters(name, value) {
        const regex = /[а-я А-ЯёЁ]/g;
        return (value.match(regex) !== null) && (value.match(regex).length === value.length);
    }
})