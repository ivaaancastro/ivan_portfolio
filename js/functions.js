// Helpers
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Año
$('#year').textContent = new Date().getFullYear();

// Tema (oscuro/claro)
const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const THEME_KEY = 'theme';

function applyTheme(t){
  if(t === 'light'){ root.setAttribute('data-theme','light'); }
  else{ root.removeAttribute('data-theme'); }
  localStorage.setItem(THEME_KEY, t);
}
const saved = localStorage.getItem(THEME_KEY);
if(saved){ applyTheme(saved); } else if(!prefersDark.matches){ applyTheme('light'); }
$('#themeToggle')?.addEventListener('click', ()=>{
  const isLight = root.getAttribute('data-theme') === 'light';
  applyTheme(isLight ? 'dark' : 'light');
});
$('#themeToggleM')?.addEventListener('click', ()=>{
  const isLight = root.getAttribute('data-theme') === 'light';
  applyTheme(isLight ? 'dark' : 'light');
});

// Menú móvil
const mobileMenu = $('#mobileMenu');
$('#menuBtn')?.addEventListener('click', ()=>{
  const hidden = mobileMenu.hasAttribute('hidden');
  mobileMenu.toggleAttribute('hidden', !hidden);
});
$$('#mobileMenu a').forEach(a=> a.addEventListener('click', ()=> mobileMenu.setAttribute('hidden','')));

// ===== Reveal in/out con IntersectionObserver =====
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const el = entry.target;
    if(entry.isIntersecting){
      el.classList.add('in');
      if(el.hasAttribute('data-stagger')){
        Array.from(el.children).forEach((child, i)=>{
          child.style.transitionDelay = `${i * 60}ms`;
          child.classList.add('in');
        });
      }
    }else{
      // Al salir, quitamos la clase para que pueda volver a animar
      el.classList.remove('in');
      if(el.hasAttribute('data-stagger')){
        Array.from(el.children).forEach((child)=> child.classList.remove('in'));
      }
    }
  });
}, { threshold: 0.12 });

$$('.reveal, [data-stagger]').forEach(el => io.observe(el));

// ===== Continuous Scroll Animations (parallax / translate / fade) =====
const parallaxEls = $$('[data-parallax]');
const scrollYEls  = $$('[data-scroll-y]');
const fadeEls     = $$('[data-fade]');

let ticking = false;
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function updateScrollAnimations(){
  const vh = window.innerHeight;
  const scrollY = window.scrollY || window.pageYOffset;

  // Parallax (valor = factor de desplazamiento)
  parallaxEls.forEach(el=>{
    const factor = parseFloat(el.getAttribute('data-parallax')) || 0.1;
    const rect = el.getBoundingClientRect();
    const offset = (rect.top + rect.height * .5) - (vh * .5); // distancia del centro al centro
    const translate = offset * factor * -1; // movimiento contrario al scroll
    el.style.transform = `translate3d(0, ${translate.toFixed(2)}px, 0)`;
  });

  // Translate Y continuo (cards)
  scrollYEls.forEach(el=>{
    const factor = parseFloat(el.getAttribute('data-scroll-y')) || 0.04;
    const rect = el.getBoundingClientRect();
    // mapeo: cuanto más lejos del centro, más desplazamiento
    const offset = (rect.top + rect.height * .5) - (vh * .5);
    const translate = offset * factor * 0.6; // un poco más suave
    el.style.transform = `translate3d(0, ${translate.toFixed(2)}px, 0)`;
  });

  // Fade continuo (según visibilidad)
  fadeEls.forEach(el=>{
    const rect = el.getBoundingClientRect();
    const visiblePx = Math.min(vh, Math.max(0, vh - Math.max(0, rect.top) - Math.max(0, vh - rect.bottom)));
    const visRatio = clamp(visiblePx / Math.min(vh, rect.height || vh), 0, 1);
    // Empieza muy tenue y sube a 1 cuando el bloque está bien dentro
    const opacity = clamp(visRatio * 1.2, 0.08, 1);
    el.style.opacity = opacity.toFixed(3);
  });

  ticking = false;
}

function onScroll(){
  if(prefersReduced.matches) return; // respetar reduce motion
  if(!ticking){
    window.requestAnimationFrame(updateScrollAnimations);
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', ()=> updateScrollAnimations(), { passive: true });
// primera pasada
updateScrollAnimations();

// ===== Modal de proyectos =====
const modal = $('#projectModal');
const mTitle = $('#mTitle');
const mStack = $('#mStack');
const mDesc  = $('#mDesc');
const mLink  = $('#mLink');

$$('.open-modal').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const data = JSON.parse(btn.getAttribute('data-project'));
    mTitle.textContent = data.title;
    mStack.textContent = data.stack;
    mDesc.textContent  = data.desc;
    mLink.href = data.link || '#';
    if(typeof modal.showModal === 'function') modal.showModal();
    else alert(`${data.title}: ${data.desc}`);
  });
});
