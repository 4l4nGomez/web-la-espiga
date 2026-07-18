/* ============================================================
   main.js — La Espiga | Entry point
   ============================================================ */

'use strict';

// ----------------------------------------------------------
// NAVBAR — scroll state & smart auto-hide
// ----------------------------------------------------------
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

if (navbar) {
  const onScroll = () => {
    const currentScrollY = window.scrollY;

    // 1. Alternar estilo opaco/vidrio al hacer scroll
    navbar.classList.toggle('is-scrolled', currentScrollY > 30);

    // 2. Lógica de ocultar/mostrar navbar (Smart Navbar)
    const mobileNav = document.getElementById('mobile-nav');
    const isMobileMenuOpen = mobileNav && mobileNav.classList.contains('is-open');

    if (!isMobileMenuOpen) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll abajo y pasado el límite inicial: ocultar menu
        navbar.classList.add('is-hidden');
      } else if (currentScrollY < lastScrollY) {
        // Scroll arriba: mostrar menu
        navbar.classList.remove('is-hidden');
      }
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


// ----------------------------------------------------------
// HERO — Ken Burns al cargar imagen
// ----------------------------------------------------------
const hero = document.getElementById('hero');
const heroBgImg = hero?.querySelector('.hero__bg-img');

if (heroBgImg && hero) {
  const activate = () => hero.classList.add('is-loaded');
  heroBgImg.complete ? activate() : heroBgImg.addEventListener('load', activate);
}

// ----------------------------------------------------------
// HERO — Parallax del mouse y botón interactivo "Ver video"
// ----------------------------------------------------------
const heroSection = document.getElementById('hero');
if (heroSection) {
  // 1. Efecto Parallax de profundidad elástica
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // rango -0.5 a 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // rango -0.5 a 0.5

    heroSection.style.setProperty('--mouse-x', x.toFixed(3));
    heroSection.style.setProperty('--mouse-y', y.toFixed(3));
  });

  // Limpieza al salir
  heroSection.addEventListener('mouseleave', () => {
    heroSection.style.setProperty('--mouse-x', '0');
    heroSection.style.setProperty('--mouse-y', '0');
  });

  // 2. Botón interactivo para revelar el fondo y pausar distracciones
  const revealBtn = document.getElementById('hero-reveal-btn');
  if (revealBtn) {
    revealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      heroSection.classList.toggle('hero--reveal-active');

      const labelSpan = revealBtn.querySelector('span');
      if (labelSpan) {
        if (heroSection.classList.contains('hero--reveal-active')) {
          labelSpan.textContent = 'Cerrar';
        } else {
          labelSpan.textContent = 'Ver video';
        }
      }
    });
  }
}


// ----------------------------------------------------------
// HERO — Carrusel desactivado (Diapositiva Única Editorial)
// ----------------------------------------------------------


// ----------------------------------------------------------
// MOBILE MENU — toggle
// ----------------------------------------------------------
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

if (menuToggle && mobileNav) {
  const open = () => {
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', () => {
    mobileNav.classList.contains('is-open') ? close() : open();
  });

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => e.key === 'Escape' && close());
}

// ----------------------------------------------------------
// SMOOTH SCROLL — anchor links
// ----------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ----------------------------------------------------------
// SCROLL REVEAL — IntersectionObserver
// ----------------------------------------------------------
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

// ----------------------------------------------------------
// UTILS
// ----------------------------------------------------------
function debounce(fn, delay = 200) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ----------------------------------------------------------
// DYNAMIC TEXT ROTATOR — Hecho especialmente...
// ----------------------------------------------------------
const rotatorWords = ["para ti.", "con pasión.", "cada mañana.", "con alma."];
let rotatorIndex = 0;
const rotatorEl = document.getElementById('rotator-text');

if (rotatorEl) {
  setInterval(() => {
    // 1. Iniciar animación de salida (slide up + fade out)
    rotatorEl.classList.add('slide-out');

    setTimeout(() => {
      // 2. Cambiar al siguiente texto
      rotatorIndex = (rotatorIndex + 1) % rotatorWords.length;
      rotatorEl.textContent = rotatorWords[rotatorIndex];

      // 3. Posicionar instantáneamente abajo sin animación
      rotatorEl.classList.remove('slide-out');
      rotatorEl.classList.add('slide-in-prep');

      // Forzar reflow para asegurar que el navegador aplique la posición inicial
      rotatorEl.offsetHeight;

      // 4. Iniciar animación de entrada (quitar preparación para deslizar a 0)
      rotatorEl.classList.remove('slide-in-prep');
    }, 380); // Corresponde al tiempo de transición en CSS (0.38s)
  }, 4200); // Cambiar cada 4.2 segundos
}


// ----------------------------------------------------------
// CALIDAD Y PROMOCIONES — Sincronización de Slider y Categorías
// ----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const catItems = document.querySelectorAll('.calidad__cat-item');
  const visualSlides = document.querySelectorAll('.promo-mockup-img');
  const contentSlides = document.querySelectorAll('.promo-content-slide');
  const navDots = document.querySelectorAll('.offer-nav-dot');

  let currentPromoIdx = 0;
  let autoplayTimer = null;
  const autoplayDelay = 5500; // 5.5 segundos por slide

  if (catItems.length > 0 && visualSlides.length > 0) {

    const showPromoSlide = (index) => {
      // 1. Sincronizar pestañas de categorías superiores
      catItems.forEach((cat, idx) => {
        cat.classList.toggle('active', idx === index);
      });

      // 2. Sincronizar maquetas visuales (mockups)
      visualSlides.forEach((slide, idx) => {
        slide.classList.toggle('is-active', idx === index);
      });

      // 3. Sincronizar textos descriptivos
      contentSlides.forEach((slide, idx) => {
        slide.classList.toggle('is-active', idx === index);
      });

      // 4. Sincronizar botones de pasos numéricos a la derecha
      navDots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === index);
      });

      currentPromoIdx = index;
    };

    const nextPromoSlide = () => {
      const nextIdx = (currentPromoIdx + 1) % catItems.length;
      showPromoSlide(nextIdx);
    };

    // Temporizador automático
    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = setInterval(nextPromoSlide, autoplayDelay);
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    // Eventos: Clicks en pestañas de categoría superiores
    catItems.forEach((cat, index) => {
      cat.addEventListener('click', () => {
        showPromoSlide(index);
        startAutoplay(); // Reinicia el temporizador tras click manual
      });
    });

    // Eventos: Clicks en botones numéricos de pasos
    navDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showPromoSlide(index);
        startAutoplay();
      });
    });

    // Iniciar temporizador
    startAutoplay();
  }
});

// ----------------------------------------------------------
// SECCIÓN UBICACIÓN — Lógica de Horarios y Geolocalización
// ----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 1. Horario en tiempo real
  const statusBadge = document.getElementById('realtime-status-badge');
  if (statusBadge) {
    const checkBakeryStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // La Espiga abre de 7:00 AM (7) a 10:00 PM (22)
      const openHour = 7;
      const closeHour = 22;

      statusBadge.classList.remove('loading', 'open', 'closed');

      if (currentHour >= openHour && currentHour < closeHour) {
        statusBadge.textContent = 'Abierto ahora';
        statusBadge.classList.add('open');
      } else {
        statusBadge.textContent = 'Cerrado';
        statusBadge.classList.add('closed');
      }
    };

    checkBakeryStatus();
    // Actualizar cada minuto
    setInterval(checkBakeryStatus, 60000);
  }

  // 2. Calcular Ruta por Geolocalización
  const btnCalcularRuta = document.getElementById('btn-calcular-ruta');
  if (btnCalcularRuta) {
    btnCalcularRuta.addEventListener('click', () => {
      const destino = "19.1077854,-98.1708727"; // Coordenadas exactas de La Espiga

      // Deshabilitar botón temporalmente para indicar carga
      btnCalcularRuta.disabled = true;
      const originalText = btnCalcularRuta.innerHTML;
      btnCalcularRuta.innerHTML = '<span class="loc-btn-icon">⏳</span> Localizando...';

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          window.open(`https://www.google.com/maps/dir/${lat},${lng}/${destino}`, '_blank');

          // Restaurar botón
          btnCalcularRuta.disabled = false;
          btnCalcularRuta.innerHTML = originalText;
        },
        (error) => {
          console.warn('Error u obtención denegada de geolocalización:', error);

          // Fallback: abrir ruta desde ubicación vacía (Google Maps le pedirá al usuario ingresar origen)
          window.open(`https://www.google.com/maps/dir//${destino}`, '_blank');

          // Restaurar botón
          btnCalcularRuta.disabled = false;
          btnCalcularRuta.innerHTML = originalText;
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0
        }
      );
    });
  }
});


// ----------------------------------------------------------
// RESEÑAS — CARRUSEL
// ----------------------------------------------------------
(function () {
  const slides = document.querySelectorAll('.rev-slide');
  const avatars = document.querySelectorAll('.rev-avatar-wrap');
  const dots = document.querySelectorAll('.rev-dot');
  const btnPrev = document.getElementById('rev-prev');
  const btnNext = document.getElementById('rev-next');

  if (!slides.length) return;

  let current = 0;
  let timer = null;
  const DELAY = 5000;

  function goTo(index) {
    index = (index + slides.length) % slides.length;

    slides[current].classList.remove('active');
    if (avatars[current]) avatars[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = index;

    slides[current].classList.add('active');
    if (avatars[current]) avatars[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');

    // Re-trigger CSS animation
    [slides[current], avatars[current]].forEach(el => {
      if (!el) return;
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = '';
    });
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), DELAY);
  }

  btnPrev?.addEventListener('click', () => { goTo(current - 1); startTimer(); });
  btnNext?.addEventListener('click', () => { goTo(current + 1); startTimer(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.goto));
      startTimer();
    });
  });

  const section = document.getElementById('resenas');
  section?.addEventListener('mouseenter', () => clearInterval(timer));
  section?.addEventListener('mouseleave', startTimer);

  // Touch swipe support
  let touchStartX = 0;
  section?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  section?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); startTimer(); }
  });

  startTimer();
})();


// ----------------------------------------------------------
// PRODUCTOS — CARRUSEL (Fan Stack)
// ----------------------------------------------------------
(function () {
  const stage = document.getElementById('prd-carousel');
  if (!stage) return;

  const slides = stage.querySelectorAll('.prd-text-slide');
  const cards = stage.querySelectorAll('.prd-card');
  const dots = stage.querySelectorAll('.prd-dot');
  const btnPrev = document.getElementById('prd-prev');
  const btnNext = document.getElementById('prd-next');

  if (!cards.length) return;

  let current = 1; // empezamos con la del centro (Country Sourdough)
  let timer = null;
  const DELAY = 5500;

  function update() {
    const total = cards.length;

    // 1. Actualizar textos
    slides.forEach((slide) => {
      const prdIndex = parseInt(slide.getAttribute('data-prd'));
      slide.classList.toggle('active', prdIndex === current);
    });

    // 2. Actualizar dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === current);
    });

    // 3. Posicionar tarjetas
    cards.forEach((card, idx) => {
      let diff = idx - current;

      // Manejar wrapping circular para 3 tarjetas
      if (diff < -1) diff += total;
      if (diff > 1) diff -= total;

      card.setAttribute('data-pos', diff.toString());
      card.classList.toggle('prd-card--active', idx === current);
    });
  }

  function goTo(index) {
    const total = cards.length;
    current = (index + total) % total;
    update();
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), DELAY);
  }

  // Controles
  btnPrev?.addEventListener('click', () => { goTo(current - 1); startTimer(); });
  btnNext?.addEventListener('click', () => { goTo(current + 1); startTimer(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.prdGoto));
      startTimer();
    });
  });

  // Clic en tarjetas laterales las trae al centro
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      const pos = parseInt(card.getAttribute('data-pos'));
      if (pos !== 0) {
        goTo(idx);
        startTimer();
      }
    });
  });

  // Pausar con hover
  stage.addEventListener('mouseenter', () => clearInterval(timer));
  stage.addEventListener('mouseleave', startTimer);

  // Inicializar
  update();
  startTimer();
})();


// ----------------------------------------------------------
// PRODUCTOS — CARRUSEL MÓVIL (Touch Scroll & Dot Sync)
// ----------------------------------------------------------
(function () {
  const slider = document.querySelector('.prd-mob-slider');
  const dots = document.querySelectorAll('.prd-mob-dot');

  if (!slider || dots.length === 0) return;

  // Cachear el ancho del slide para evitar layout thrashing
  let card = slider.querySelector('.prd-mob-card-wrapper');
  let cardWidth = card ? card.offsetWidth : slider.clientWidth;

  // Recalcular el ancho solo en resize usando la utilidad debounce existente
  window.addEventListener('resize', debounce(() => {
    const updatedCard = slider.querySelector('.prd-mob-card-wrapper');
    if (updatedCard) {
      cardWidth = updatedCard.offsetWidth;
    }
  }, 150), { passive: true });

  // Sincronizar dots al hacer scroll de forma pasiva y optimizada
  let scrollTimeout;
  slider.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);

    scrollTimeout = requestAnimationFrame(() => {
      const scrollLeft = slider.scrollLeft;
      const index = Math.round(scrollLeft / cardWidth);

      // Asegurar que el index esté dentro del rango
      const activeIndex = Math.max(0, Math.min(dots.length - 1, index));

      dots.forEach((dot, idx) => {
        const isActive = idx === activeIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    });
  }, { passive: true });

  // Navegar al hacer clic en los dots móviles usando el valor cacheado
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-mob-idx'), 10);
      slider.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    });
  });
})();


// ----------------------------------------------------------
// HERO — Fondo Dinámico y Partículas de Harina
// ----------------------------------------------------------
(function () {
  const canvas = document.querySelector('#hero .hero__canvas');
  if (!canvas) return;

  // Generar partículas de harina flotando
  const createFlourParticles = () => {
    const particlesContainer = document.querySelector('#hero .hero__particles');
    if (!particlesContainer) return;

    // Limpiar previas
    particlesContainer.innerHTML = '';

    const particleCount = window.innerWidth <= 768 ? 14 : 24; // Más partículas en pantallas grandes
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'flour-particle';

      const size = Math.random() * 6 + 2; // entre 2px y 8px
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = Math.random() * 12 + 8; // flotación lenta entre 8s y 20s
      const sway = (Math.random() * 40 - 20) + 'px'; // balanceo lateral

      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = left + '%';
      particle.style.setProperty('--sway', sway);
      particle.style.animationDelay = delay + 's';
      particle.style.animationDuration = duration + 's';

      particlesContainer.appendChild(particle);
    }
    console.log('Partículas de harina creadas.');
  };

  createFlourParticles();

  // Regenerar partículas en cambio de tamaño de ventana
  window.addEventListener('resize', debounce(createFlourParticles, 300), { passive: true });
})();


// ----------------------------------------------------------
// HERO — Rotación de textos en el título gigante
// ----------------------------------------------------------
(function () {
  const titleEl = document.querySelector('#hero .hero__sans-title');
  if (!titleEl) return;

  const texts = [
    'Descubre el sabor de La Espiga.',
    'Donde el buen pan te espera.',
    'Tradición y calidad en cada horneada',
    'Más que una panadería, una experiencia.'
  ];
  let textIndex = 0;
  let textIntervalId = null;

  const startTextRotation = () => {
    if (!textIntervalId) {
      // Inicializar con el primer texto
      titleEl.textContent = texts[0];

      textIntervalId = setInterval(() => {
        // Desvanecer el texto
        titleEl.style.transition = 'opacity 0.4s ease';
        titleEl.style.opacity = '0';

        setTimeout(() => {
          textIndex = (textIndex + 1) % texts.length;
          titleEl.textContent = texts[textIndex];
          // Mostrar el texto de nuevo
          titleEl.style.opacity = '1';
        }, 400);
      }, 4000); // Cambiar texto cada 4 segundos
    }
  };

  startTextRotation();
})();


// ----------------------------------------------------------
// HERO — Carrusel de fondos en versión móvil
// ----------------------------------------------------------
(function () {
  const mobileBgSlides = document.querySelectorAll('.hero__mobile-bg-slide');
  if (mobileBgSlides.length < 2) return;

  let currentMobileSlide = 0;
  setInterval(() => {
    // Quitar is-active del actual
    mobileBgSlides[currentMobileSlide].classList.remove('is-active');

    // Pasar al siguiente
    currentMobileSlide = (currentMobileSlide + 1) % mobileBgSlides.length;

    // Poner is-active al nuevo
    mobileBgSlides[currentMobileSlide].classList.add('is-active');
  }, 4500); // Cambiar de imagen cada 4.5 segundos
})();


// ----------------------------------------------------------
// HERO — Carrusel de fondos en versión escritorio
// ----------------------------------------------------------
(function () {
  const desktopBgSlides = document.querySelectorAll('.hero__desktop-bg-slide');
  if (desktopBgSlides.length < 2) return;

  let currentDesktopSlide = 0;
  setInterval(() => {
    desktopBgSlides[currentDesktopSlide].classList.remove('is-active');
    currentDesktopSlide = (currentDesktopSlide + 1) % desktopBgSlides.length;
    desktopBgSlides[currentDesktopSlide].classList.add('is-active');
  }, 6500); // Cambiar de imagen cada 6.5 segundos
})();


// ----------------------------------------------------------
// WHATSAPP — Dynamic Order Templates
// ----------------------------------------------------------
(function () {
  const waLinks = document.querySelectorAll('a[href^="https://wa.me/522211846420"]');
  
  waLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      let message = "Hola La Espiga, me gustaría hacer un pedido.";
      
      // 1. Mobile Products (Tienen aria-label con la descripción)
      const ariaLabel = this.getAttribute('aria-label');
      if (ariaLabel && ariaLabel.toLowerCase().includes('ordenar')) {
        message = "Hola La Espiga, me interesa: " + ariaLabel;
      } 
      // 2. Desktop Products (Están dentro de un .prd-text-slide)
      else if (this.closest('.prd-text-slide')) {
        // Obtenemos el nombre del producto de la imagen activa en la columna central
        const activeImg = document.querySelector('.prd-card.prd-card--active img');
        const activeCardTitle = activeImg ? activeImg.getAttribute('alt') : null;
        const price = this.closest('.prd-text-slide').querySelector('.prd-price')?.innerText;
        
        if (activeCardTitle && price) {
           message = `Hola La Espiga, me interesa ordenar: ${activeCardTitle.trim()} por ${price.trim()}`;
        }
      }
      // 3. Promociones (Están dentro de un .promo-content-slide)
      else if (this.closest('.promo-content-slide')) {
        // Buscamos el título de la promo y el texto del botón si tiene código
        const promoTitle = this.closest('.promo-content-slide').querySelector('.offer-title, h5')?.innerText;
        const btnText = this.innerText;
        
        if (promoTitle) {
           message = `Hola La Espiga, quiero aprovechar la promoción: ${promoTitle.trim()}`;
           if (btnText.includes('Cupón')) {
             message += ` (${btnText.trim()})`;
           }
        }
      }
      // 4. Botones genéricos (Hero o Pedidos Especiales)
      else {
        const btnText = this.innerText.toLowerCase();
        if (btnText.includes('especiales')) {
          message = "Hola La Espiga, me gustaría hacer un pedido especial para un evento.";
        } else if (btnText.includes('pedidos')) {
          message = "Hola La Espiga, me gustaría hacer un pedido.";
        }
      }
      
      // Redirigir a WhatsApp con el texto codificado
      const encodedMessage = encodeURIComponent(message);
      const baseUrl = this.href.split('?')[0];
      window.open(`${baseUrl}?text=${encodedMessage}`, '_blank');
    });
  });
})();
