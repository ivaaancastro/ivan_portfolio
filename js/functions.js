// Helpers
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Año en footer
$('#year').textContent = new Date().getFullYear();

// ===== Tema (oscuro/claro) =====
const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const THEME_KEY = 'theme';

function applyTheme(t){
  if(t === 'light'){ root.setAttribute('data-theme','light'); }
  else{ root.removeAttribute('data-theme'); }
  localStorage.setItem(THEME_KEY, t);
}

// Estado inicial
const saved = localStorage.getItem(THEME_KEY);
if(saved){ applyTheme(saved); }
else if(!prefersDark.matches){ applyTheme('light'); }

$('#themeToggle')?.addEventListener('click', ()=>{
  const isLight = root.getAttribute('data-theme') === 'light';
  applyTheme(isLight ? 'dark' : 'light');
});
$('#themeToggleM')?.addEventListener('click', ()=>{
  const isLight = root.getAttribute('data-theme') === 'light';
  applyTheme(isLight ? 'dark' : 'light');
});

// ===== Menú móvil =====
const mobileMenu = $('#mobileMenu');
$('#menuBtn')?.addEventListener('click', ()=>{
  const hidden = mobileMenu.hasAttribute('hidden');
  mobileMenu.toggleAttribute('hidden', !hidden);
});
$$('#mobileMenu a').forEach(a=> a.addEventListener('click', ()=> mobileMenu.setAttribute('hidden','')));

// ===== Scroll reveal accesible =====
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, {threshold:.12});
$$('.reveal').forEach(el=> io.observe(el));

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

// ===== Formulario (validación en cliente) =====
const form = $('#contactForm');
const formMsg = $('#formMsg');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(form);
  const name = (fd.get('name')||'').toString().trim();
  const email = (fd.get('email')||'').toString().trim();
  const message = (fd.get('message')||'').toString().trim();

  if(name.length < 2){ formMsg.textContent = 'Por favor, indica tu nombre.'; return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ formMsg.textContent = 'Introduce un email válido.'; return; }
  if(message.length < 10){ formMsg.textContent = 'El mensaje es demasiado corto.'; return; }

  // Ejemplo de envío fake (sustituir por Formspree u otro backend)
  formMsg.textContent = '¡Gracias! Mensaje enviado (demo).';
  form.reset();
});