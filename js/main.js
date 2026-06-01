// Load data (from localStorage if admin saved changes, else from data.js)
function getData() {
  const saved = localStorage.getItem('shriraam_comics_data');
  return saved ? JSON.parse(saved) : SITE_DATA;
}

const data = getData();

// Populate hero
document.getElementById('hero-name').textContent = data.name + "'s Comics";
document.getElementById('hero-tagline').textContent = data.tagline;
document.getElementById('hero-line').textContent = data.heroLine;

// Populate about
document.getElementById('about-text').textContent = data.about;

// Populate comics grid
const grid = document.getElementById('comics-grid');
if (data.comics.length === 0) {
  grid.innerHTML = `<div class="empty-state"><span>✏️</span>Comics coming soon — check back!</div>`;
} else {
  data.comics.forEach(comic => {
    const card = document.createElement('div');
    card.className = 'comic-card reveal';
    card.innerHTML = `
      <div class="comic-img-wrap">
        ${comic.image
          ? `<img src="${comic.image}" alt="${comic.title}" onerror="this.parentElement.innerHTML='<div class=comic-placeholder>🖼️</div>'" />`
          : `<div class="comic-placeholder">✏️</div>`}
      </div>
      <div class="comic-info">
        <div class="comic-title">${comic.title}</div>
        <div class="comic-desc">${comic.description}</div>
        <span class="comic-date">${comic.date}</span>
      </div>`;
    card.addEventListener('click', () => openLightbox(comic));
    grid.appendChild(card);
  });
}

// Social links
const socialWrap = document.getElementById('social-links');
if (data.social.instagram) {
  socialWrap.innerHTML += `<a href="https://instagram.com/${data.social.instagram}" class="btn btn-primary" target="_blank">📸 Instagram</a>`;
}
if (data.social.youtube) {
  socialWrap.innerHTML += `<a href="https://youtube.com/@${data.social.youtube}" class="btn btn-primary" target="_blank">▶ YouTube</a>`;
}
if (!data.social.instagram && !data.social.youtube) {
  socialWrap.innerHTML = `<p style="color:#999;">More ways to connect coming soon!</p>`;
}

// Footer year
document.getElementById('footer-year').textContent = new Date().getFullYear();

// Sticky nav
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// Lightbox
const lightbox = document.getElementById('lightbox');
function openLightbox(comic) {
  document.getElementById('lightbox-img').src = comic.image || '';
  document.getElementById('lightbox-title').textContent = comic.title;
  document.getElementById('lightbox-desc').textContent = comic.description;
  document.getElementById('lightbox-date').textContent = comic.date;
  lightbox.classList.add('open');
}
document.getElementById('lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
