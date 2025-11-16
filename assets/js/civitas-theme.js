(function(){
  const BG_IMAGE = 'https://images.ctfassets.net/rz1oowkt5gyp/2xn1DqX37pQzUPjpxEi4Dh/2f0b0c4fdf04eb6043edd9bc4f393dfe/Hero_2x.png';
  const DETAIL_IMG_A = 'https://s3-ap-south-1.amazonaws.com/static.awfis.com/wp-content/uploads/2017/07/07184649/ProjectManagement.jpg';
  const DETAIL_IMG_B = 'https://s3-ap-south-1.amazonaws.com/static.awfis.com/wp-content/uploads/2017/07/07184649/ProjectManagement.jpg';
  const STORAGE_KEY = 'supermod_theme_pref';
  const html = document.documentElement;
  const body = document.body;

  function applyInitialTheme(){
    try{
      const stored = localStorage.getItem(STORAGE_KEY);
      if(stored === 'dark') html.classList.add('dark');
      else if(stored === 'light') html.classList.remove('dark');
      else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if(prefersDark) html.classList.add('dark');
      }
    }catch(e){}
  }

  applyInitialTheme();

  function wireDarkToggle(){
    const toggle = document.querySelector('[data-dark-toggle]');
    if(!toggle) return;
    toggle.addEventListener('click', function(e){
      const isDark = html.classList.toggle('dark');
      try { localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light'); } catch(e){}
      toggle.setAttribute('aria-pressed', String(isDark));
    });
  }

  function wireMobileNav(){
    const navToggle = document.querySelector('.nav-toggle');
    const mobilePanel = document.querySelector('.mobile-nav-panel');
    if(!navToggle || !mobilePanel) return;
    navToggle.addEventListener('click', function(){
      const open = body.classList.toggle('mobile-nav-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function(e){
      if(!body.classList.contains('mobile-nav-open')) return;
      if(navToggle.contains(e.target)) return;
      if(mobilePanel.contains(e.target)) return;
      body.classList.remove('mobile-nav-open');
      navToggle.setAttribute('aria-expanded','false');
    });
  }

  function enhanceProjectCards(){
    const cards = document.querySelectorAll('.project-card');
    if(!cards.length) return;
    cards.forEach(card=>{
      // if card already has .project-hero img, do nothing; else create hero img with BG_IMAGE
      let hero = card.querySelector('.project-hero');
      if(!hero){
        hero = document.createElement('div');
        hero.className = 'project-hero';
        const img = document.createElement('img');
        img.src = BG_IMAGE;
        img.alt = card.querySelector('.card-title') ? card.querySelector('.card-title').textContent + ' image' : 'Project image';
        img.loading = 'lazy';
        hero.appendChild(img);
        const grad = document.createElement('div'); grad.className = 'hero-gradient'; hero.appendChild(grad);
        const titleWrap = document.createElement('div'); titleWrap.className = 'hero-title';
        titleWrap.textContent = card.querySelector('.card-title') ? card.querySelector('.card-title').textContent : '';
        hero.appendChild(titleWrap);
        // insert hero at top of card
        card.insertBefore(hero, card.firstChild);
      } else {
        // ensure first child is img with BG_IMAGE as fallback
        const img = hero.querySelector('img');
        if(!img){
          const i = document.createElement('img'); i.src = BG_IMAGE; i.alt='Project image'; i.loading='lazy'; hero.insertBefore(i, hero.firstChild);
        }
      }
      // ensure images inside card use lazy loading
      card.querySelectorAll('img').forEach(img=>{ if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy') });
    });
  }

  function populateProjectDetails(){
    const details = document.querySelectorAll('.project-details');
    if(!details.length) return;
    details.forEach(detail=>{
      if(detail.dataset.civitasInjected === '1') return;
      // If project hero placeholder exists higher on page (project-detail-header), ensure hero image present
      const headerHero = document.querySelector('.project-detail-image');
      if(headerHero){
        // if header hero is styled element, prepend an actual img above it
        // but keep existing visual; we will insert image node before headerHero
        const img = document.createElement('img');
        img.src = BG_IMAGE;
        img.alt = 'Project hero';
        img.style.width = '100%'; img.style.height = 'auto'; img.loading = 'lazy';
        headerHero.parentNode.insertBefore(img, headerHero);
      }

      const imagesWrap = document.createElement('div'); imagesWrap.className = 'detail-images';
      const imgA = document.createElement('img'); imgA.src = DETAIL_IMG_A; imgA.alt = 'Project image A'; imgA.loading = 'lazy';
      const imgB = document.createElement('img'); imgB.src = DETAIL_IMG_B; imgB.alt = 'Project image B'; imgB.loading = 'lazy';
      imagesWrap.appendChild(imgA); imagesWrap.appendChild(imgB);
      detail.appendChild(imagesWrap);
      detail.dataset.civitasInjected = '1';
    });
  }

  if(document.readyState === 'loading'){  
    document.addEventListener('DOMContentLoaded', function(){ wireDarkToggle(); wireMobileNav(); enhanceProjectCards(); populateProjectDetails(); });
  } else { wireDarkToggle(); wireMobileNav(); enhanceProjectCards(); populateProjectDetails(); }

  window.CivitasTheme = { toggleDark: function(){ const isDark = html.classList.toggle('dark'); try{ localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light'); }catch(e){} }, applyCards: enhanceProjectCards, refreshDetails: populateProjectDetails };
})();
