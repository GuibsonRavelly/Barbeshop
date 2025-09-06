const slider = document.querySelector('.slider-item');
const setaAvancar = document.getElementById('seta-avancar');
const setaVoltar = document.getElementById('seta-voltar');
let slides = Array.from(document.querySelectorAll('.slider-item img'));

let visibleSlides = getVisibleSlides();
let index = visibleSlides;

// --- Clonando para infinito ---
function cloneSlides() {
  // Remove clones anteriores
  document.querySelectorAll('.clone').forEach(el => el.remove());

  // Clonar últimos e primeiros slides
  for (let i = 0; i < visibleSlides; i++) {
    let firstClone = slides[i].cloneNode(true);
    firstClone.classList.add('clone');
    slider.appendChild(firstClone);

    let lastClone = slides[slides.length - 1 - i].cloneNode(true);
    lastClone.classList.add('clone');
    slider.insertBefore(lastClone, slider.firstChild);
  }

  slides = Array.from(document.querySelectorAll('.slider-item img'));
}

// Atualiza quantos slides visíveis
function getVisibleSlides() {
  if (window.innerWidth <= 425) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 4;
}

// Atualiza posição do slider
function updateSlider(animate = true) {
  slider.style.transition = animate ? "transform 0.5s ease-in-out" : "none";
  slider.style.transform = `translateX(${-index * (100 / visibleSlides)}%)`;
}

// Avançar
function nextSlide() {
  index++;
  updateSlider();

  if (index >= slides.length - visibleSlides) {
    setTimeout(() => {
      index = visibleSlides; // teleporte invisível
      updateSlider(false);
    }, 500);
  }
}

// Voltar
function prevSlide() {
  index--;
  updateSlider();

  if (index < visibleSlides) {
    setTimeout(() => {
      index = slides.length - visibleSlides * 2;
      updateSlider(false);
    }, 500);
  }
}

// Eventos setas
setaAvancar.addEventListener('click', (e) => { e.preventDefault(); nextSlide(); });
setaVoltar.addEventListener('click', (e) => { e.preventDefault(); prevSlide(); });

// Redimensionar
window.addEventListener('resize', () => {
  visibleSlides = getVisibleSlides();
  cloneSlides();
  index = visibleSlides;
  updateSlider(false);
});

// --- Drag/Swipe ---
let startX = 0;
let isDragging = false;

slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
slider.addEventListener('touchmove', (e) => { if (isDragging) endX = e.touches[0].clientX; });
slider.addEventListener('touchend', () => { handleSwipe(); });

slider.addEventListener('mousedown', (e) => { isDragging = true; startX = e.clientX; });
slider.addEventListener('mousemove', (e) => { if (isDragging) endX = e.clientX; });
slider.addEventListener('mouseup', () => { if (isDragging) { handleSwipe(); isDragging = false; } });
slider.addEventListener('mouseleave', () => { if (isDragging) { handleSwipe(); isDragging = false; } });

let endX = 0;

function handleSwipe() {
  if (startX - endX > 50) nextSlide();
  else if (endX - startX > 50) prevSlide();
}

// Inicializa
cloneSlides();
updateSlider(false);
