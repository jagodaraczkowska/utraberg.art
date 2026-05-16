let currentLang = 'pl';
let currentLightboxIndex = 0;

function showSection(id, el) {
  event && event.preventDefault();
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  if (el) el.classList.add('active');
}

function setLang(lang, btn) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyLang();
}

function applyLang() {
  document.querySelectorAll('[data-pl]').forEach(el => {
    const val = el.getAttribute('data-' + currentLang);
    if (val !== null) el.innerHTML = val;
  });
}

function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid || typeof PAINTINGS === 'undefined') return;
  grid.innerHTML = PAINTINGS.map((p, i) => `
    <div class="gallery-item" onclick="openLightbox(${i})">
      <div class="gallery-thumb">
        <img src="${p.file}" alt="${p.titlePL}" loading="lazy">
        <div class="gallery-overlay">
          <span class="gallery-overlay-text">${currentLang === 'pl' ? p.titlePL : p.titleEN}</span>
        </div>
      </div>
      <div class="gallery-caption">
        <span class="gallery-dims">${p.dims} | ${p.tech}</span>
        <span class="gallery-name">&ldquo;${currentLang === 'pl' ? p.titlePL : p.titleEN}&rdquo;</span>
      </div>
    </div>
  `).join('');
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const p = PAINTINGS[index];
  document.getElementById('lightboxImg').src = p.file;
  document.getElementById('lightboxTitle').textContent = '\u201e' + (currentLang === 'pl' ? p.titlePL : p.titleEN) + '\u201d';
  document.getElementById('lightboxDims').textContent = p.dims + ' | ' + p.tech;
  document.getElementById('lightboxDesc').textContent = currentLang === 'pl' ? p.descPL : p.descEN;
  const vizDiv = document.getElementById('lightboxViz');
  const vizImg = document.getElementById('lightboxVizImg');
  if (p.vizFile) { vizImg.src = p.vizFile; vizDiv.style.display = 'block'; }
  else { vizDiv.style.display = 'none'; }
  const shopLink = document.getElementById('lightboxShopLink');
  if (p.shopUrl) { shopLink.href = p.shopUrl; shopLink.style.display = 'inline-block'; }
  else { shopLink.style.display = 'none'; }
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== document.getElementById('lightbox') && !e.target.classList.contains('lightbox-close')) return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNav(dir, e) {
  e && e.stopPropagation();
  currentLightboxIndex = (currentLightboxIndex + dir + PAINTINGS.length) % PAINTINGS.length;
  openLightbox(currentLightboxIndex);
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox({ target: lb });
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'ArrowLeft') lightboxNav(-1);
});

function handleForm(e) {
  e.preventDefault();
  alert(currentLang === 'pl' ? 'Wiadomość wysłana!' : 'Message sent!');
  e.target.reset();
}

document.addEventListener('DOMContentLoaded', () => {
  buildGallery();
  const firstLink = document.querySelector('.nav-link');
  if (firstLink) firstLink.classList.add('active');
});
