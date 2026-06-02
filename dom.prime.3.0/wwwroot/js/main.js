/* ===========================
   DOM PRIME BARBEARIA — JS
   =========================== */

/* ===========================
   CUSTOM CURSOR
   =========================== */

const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

let mx = 0, my = 0;
let rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

/* ===========================
   CURSOR HOVER EFFECT
   =========================== */

document.querySelectorAll('a, button, .service-card, .testimonial, .pillar').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width     = '20px';
    cursor.style.height    = '20px';
    cursorRing.style.width = '52px';
    cursorRing.style.height= '52px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width     = '12px';
    cursor.style.height    = '12px';
    cursorRing.style.width = '36px';
    cursorRing.style.height= '36px';
  });
});

/* ===========================
   NAVBAR SCROLL
   =========================== */

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===========================
   SCROLL REVEAL
   =========================== */

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

/* ===========================
   AGENDAMENTO — ENVIO PARA API
   URL relativa: funciona em qualquer porta
   =========================== */

const API_URL = '/api/agendamento';

const btnSubmit = document.getElementById('btnSubmit');

if (btnSubmit) {

  btnSubmit.addEventListener('click', async () => {

    const nome     = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const servico  = document.getElementById('servico').value;
    const data     = document.getElementById('data').value;
    const horario  = document.getElementById('horario').value;

    /* VALIDAÇÃO */
    if (!nome || !telefone || !servico || !data || !horario) {
      mostrarErro('⚠ Preencha todos os campos');
      return;
    }

    /* Desabilita botão durante requisição */
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Enviando...';

    try {

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome:     nome,
          whatsapp: telefone,
          servico:  servico,
          data:     data + 'T00:00:00',   // formato ISO esperado pelo C#
          horario:  horario
        })
      });

      const resultado = await response.json();

      if (response.ok) {
        mostrarSucesso('✓ ' + resultado.mensagem);
        limparFormulario();
      } else {
        mostrarErro(resultado.mensagem || 'Erro ao agendar');
      }

    } catch (error) {
      console.error('Erro de conexão:', error);
      mostrarErro('Servidor indisponível. Tente novamente.');
    }

    setTimeout(resetBtn, 3500);
    btnSubmit.disabled = false;

  });
}

/* ===========================
   FUNÇÕES AUXILIARES
   =========================== */

function mostrarSucesso(msg) {
  btnSubmit.textContent       = msg;
  btnSubmit.style.background  = '#4a7c59';
  btnSubmit.style.color       = '#ffffff';
}

function mostrarErro(msg) {
  btnSubmit.textContent       = msg;
  btnSubmit.style.background  = '#8b5e3c';
  btnSubmit.style.color       = '#fff';
  setTimeout(resetBtn, 2500);
}

function resetBtn() {
  btnSubmit.textContent      = 'Confirmar Agendamento';
  btnSubmit.style.background = '';
  btnSubmit.style.color      = '';
  btnSubmit.disabled         = false;
}

function limparFormulario() {
  document.getElementById('nome').value     = '';
  document.getElementById('telefone').value = '';
  document.getElementById('servico').value  = '';
  document.getElementById('data').value     = '';
  document.getElementById('horario').value  = '09:00';
}

/* ===========================
   NAV LINK ACTIVE
   =========================== */

const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120)
      current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--gold-light)' : '';
  });
});

/* ===========================
   DROPDOWN MENU
   =========================== */

const menuBtn      = document.getElementById('menuBtn');
const navDropdown  = document.getElementById('navDropdown');

menuBtn.addEventListener('click', e => {
  e.stopPropagation();
  menuBtn.classList.toggle('active');
  navDropdown.classList.toggle('open');
});

document.querySelectorAll('.dropdown-link').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('active');
    navDropdown.classList.remove('open');
  });
});

document.addEventListener('click', e => {
  if (!menuBtn.contains(e.target) && !navDropdown.contains(e.target)) {
    menuBtn.classList.remove('active');
    navDropdown.classList.remove('open');
  }
});

/* ===========================
   MODAL LOGIN
   =========================== */

const btnLogin    = document.getElementById('btnLogin');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose  = document.getElementById('modalClose');

const openModal = () => {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
};

btnLogin.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});