/* ============================================================
   أطياف مبدعة | Atyaf Creative — سكربت المدونة (Blog)
   — عرض شبكة المقالات من posts-data.js + البحث + القائمة المتجاوبة.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ----- سنة التذييل ----- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- قائمة الجوال (Hamburger) ----- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  const closeMenu = () => {
    if (!hamburger || !navMenu || !navOverlay) return;
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    navOverlay.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      navOverlay.classList.toggle('show', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);

  /* ----- القائمة المنسدلة (التعليم الرقمي) ----- */
  const eduDropdown = document.getElementById('eduDropdown');
  const dropdownToggle = eduDropdown ? eduDropdown.querySelector('.nav-dropdown-toggle') : null;

  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = eduDropdown.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
  document.addEventListener('click', (e) => {
    if (eduDropdown && !eduDropdown.contains(e.target)) eduDropdown.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && eduDropdown) eduDropdown.classList.remove('open');
  });

  /* ----- تأثير شريط التنقل عند التمرير + زر العودة للأعلى ----- */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');
  const onScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ----- تنسيق التاريخ بالعربية ----- */
  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return iso;
    }
  };

  /* ----- 1) عرض شبكة المقالات (blog.html) ----- */
  const blogGrid = document.getElementById('blogGrid');
  const blogCount = document.getElementById('blogCount');
  const searchInput = document.getElementById('blogSearch');

  if (blogGrid && Array.isArray(window.POSTS)) {
    const posts = window.POSTS.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

    const cardHTML = (p) => `
      <article class="blog-card">
        <div class="blog-card-cover ${p.gradient || 'grad-purple'}">
          <span class="blog-card-emoji" aria-hidden="true">${p.emoji || '📝'}</span>
          <span class="blog-card-category">${p.category || 'عام'}</span>
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span>📅 ${formatDate(p.date)}</span>
            <span class="meta-dot"></span>
            <span>⏱️ ${p.readTime || '—'}</span>
          </div>
          <h3><a href="posts/post-template.html?slug=${encodeURIComponent(p.slug)}">${p.title}</a></h3>
          <p class="blog-card-excerpt">${p.excerpt || ''}</p>
          <a class="blog-card-link" href="posts/post-template.html?slug=${encodeURIComponent(p.slug)}">
            اقرأ المقال <span class="arrow">←</span>
          </a>
        </div>
      </article>`;

    const render = (list) => {
      if (list.length === 0) {
        blogGrid.innerHTML = `
          <div class="blog-empty">
            <div class="empty-emoji">🔍</div>
            <h3>لا توجد مقالات مطابقة</h3>
            <p>جرّب كلمة بحث أخرى أو تصفّح كل المقالات.</p>
          </div>`;
      } else {
        blogGrid.innerHTML = list.map(cardHTML).join('');
      }
      if (blogCount) blogCount.textContent = `${list.length} مقالاً`;
    };

    render(posts);

    // البحث الفوري
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        const filtered = posts.filter((p) =>
          (p.title + ' ' + p.excerpt + ' ' + (p.category || '')).toLowerCase().includes(q)
        );
        render(filtered);
      });
    }
  }
});
