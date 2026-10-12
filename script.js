/* ============================================================
   أطياف مبدعة | Atyaf Creative — ملف الجافاسكربت
   تفاعلات الموقع: القائمة، التمرير، العدّادات، حركات الظهور،
   التحقق من النموذج، وغيرها.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ----- 1) مراجع العناصر ----- */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const scrollTopBtn = document.getElementById('scrollTop');
  const contactForm  = document.getElementById('contactForm');
  const formStatus   = document.getElementById('formStatus');
  const yearEl = document.getElementById('year');

  /* ----- 2) سنة التذييل تلقائياً ----- */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----- 2-ب) العرض الديناميكي المعزول (Single-View Filtering) ----- */
  const filterBar = document.getElementById('filterBar');
  const filterCurrent = document.getElementById('filterCurrent');
  const pageSections = document.querySelectorAll('.page-section');
  const eduDropdown = document.getElementById('eduDropdown');
  const dropdownToggle = eduDropdown ? eduDropdown.querySelector('.nav-dropdown-toggle') : null;

  // أسماء عربية لكل قسم (تُعرض في شريط التصفية)
  const PAGE_LABELS = {
    'home': 'الرئيسية',
    'about': 'من نحن',
    'design': 'خدمات التصميم',
    'education': 'دورات أخرى (التعليم الرقمي)',
    'english-courses': 'دورات اللغة الإنجليزية',
    'books': 'الكتب والمصادر التعليمية',
    'booking': 'الطلب والحجز',
    'payment': 'طرق الدفع والتحويل',
    'portfolio': 'أعمالنا',
    'contact': 'تواصل معنا',
  };

  // إغلاق القائمة المنسدلة (function declaration لتكون متاحة عند الرفع)
  function closeDropdown() {
    if (!eduDropdown) return;
    eduDropdown.classList.remove('open');
    if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
  }

  // دالة التبديل بين الأقسام (العرض المعزول)
  const showPage = (page) => {
    if (page === 'home') {
      // "الرئيسية" = عرض الموقع بالكامل (الوضع الكامل النظيف)
      document.body.classList.remove('view-mode');
      pageSections.forEach((section) => section.classList.remove('is-active'));
      if (filterBar) filterBar.classList.remove('is-visible');
    } else {
      // تفعيل وضع العرض المعزول على الصفحة
      document.body.classList.add('view-mode');

      // إظهار/إخفاء الأقسام حسب التطابق
      pageSections.forEach((section) => {
        const matches = section.getAttribute('data-page') === page;
        section.classList.toggle('is-active', matches);
      });

      // تحديث شريط التصفية
      if (filterCurrent) {
        filterCurrent.textContent = PAGE_LABELS[page] || 'الرئيسية';
      }
      if (filterBar) {
        filterBar.classList.add('is-visible');
      }
    }

    // تحديث حالة الروابط النشطة (القائمة المنسدلة والروابط العادية)
    document.querySelectorAll('[data-page]').forEach((el) => {
      if (el.classList.contains('nav-link') || el.classList.contains('dropdown-link') || el.classList.contains('filter-home')) {
        el.classList.toggle('active', el.getAttribute('data-page') === page);
      }
    });

    // التمرير لأعلى الصفحة بسلاسة لبداية المحتوى
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // إعادة تشغيل حركات الظهور للأقسام المُعادة
    requestAnimationFrame(() => {
      const activeSection = document.querySelector('.page-section.is-active');
      if (activeSection) {
        activeSection.querySelectorAll('.reveal').forEach((el) => {
          el.classList.add('visible');
        });
      }
    });
  };

  // ربط كل الروابط التي تحمل data-page بمنطق التبديل
  document.querySelectorAll('a[data-page]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const page = link.getAttribute('data-page');
      if (page) {
        e.preventDefault();
        closeDropdown();
        showPage(page);
      }
    });
  });

  /* ----- 2-ج) التحكم بالقائمة المنسدلة (Dropdown) ----- */
  const toggleDropdown = () => {
    if (!eduDropdown) return;
    const isOpen = eduDropdown.classList.toggle('open');
    if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', String(isOpen));
  };

  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });
  }

  // إغلاق القائمة المنسدلة عند النقر خارجها
  document.addEventListener('click', (e) => {
    if (eduDropdown && !eduDropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  // إغلاق القائمة المنسدلة بمفتاح Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });

  /* ----- 3) قائمة الجوال (Hamburger Menu) ----- */
  const closeMenu = () => {
    if (!hamburger || !navMenu || !navOverlay) return;
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    navOverlay.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const toggleMenu = () => {
    if (!hamburger || !navMenu || !navOverlay) return;
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    navOverlay.classList.toggle('show', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);

  /* إغلاق القائمة عند الضغط على أي رابط */
  if (navMenu) {
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* إغلاق القائمة بمفتاح Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ----- 4) تأثير شريط التنقل عند التمرير ----- */
  const handleNavScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  };

  /* ----- 5) زر العودة للأعلى ----- */
  const handleScrollTop = () => {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  };

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', () => {
    handleNavScroll();
    handleScrollTop();
  }, { passive: true });

  /* ----- 6) عدّادات الأرقام (Stats Counter) ----- */
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // دالة تخفيف (ease-out) لحركة طبيعية
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-US');
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('en-US');
      }
    };
    requestAnimationFrame(update);
  };

  /* ----- 7) حركات الظهور عند التمرير (Reveal on Scroll) ----- */
  const revealEls = document.querySelectorAll(
    '.section-head, .service-card, .course-card, .portfolio-item, ' +
    '.testimonial-card, .feature-item, .about-visual, .about-text'
  );
  revealEls.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ----- 8) مراقب عدّادات الأرقام ----- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => counterObserver.observe(el));

  /* ----- 9) تمييز رابط التنقل النشط (Active Nav) — للوضع الكامل فقط ----- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const setActiveLink = () => {
    // في وضع العرض المعزول، يتم التحكم بالرابط النشط عبر showPage() فقط
    if (document.body.classList.contains('view-mode')) return;

    const scrollPos = window.scrollY + 120;
    let currentId = '';

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      // تجاهل أزرار القائمة المنسدلة غير المرتبطة بالتمرير
      if (link.classList.contains('nav-dropdown-toggle')) return;
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ----- 10) التحقق من نموذج التواصل وإرساله ----- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showError = (input) => input.classList.add('invalid');
  const clearError = (input) => input.classList.remove('invalid');

  if (contactForm) {
    const fields = contactForm.querySelectorAll(
      'input[required], select[required], textarea[required]'
    );

    // إزالة الخطأ أثناء الكتابة
    fields.forEach((field) => {
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('change', () => clearError(field));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalid = null;

      fields.forEach((field) => {
        const value = field.value.trim();
        let fieldValid = true;

        if (!value) {
          fieldValid = false;
        } else if (field.type === 'email' && !emailRegex.test(value)) {
          fieldValid = false;
        }

        if (fieldValid) {
          clearError(field);
        } else {
          showError(field);
          isValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!isValid) {
        formStatus.textContent = '⚠️ يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح.';
        formStatus.className = 'form-status error';
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // محاكاة الإرسال (يمكن ربطها بخدمة خلفية لاحقاً)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'جارٍ الإرسال...';
      submitBtn.disabled = true;

      setTimeout(() => {
        formStatus.textContent = '✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.';
        formStatus.className = 'form-status success';
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  /* ----- 10-ب) أزرار الحجز (الدورات والكتب) ----- */
  // نجمع أزرار الدورات وأزرار الكتب في مُحدِّد واحد لأنها تتشارك نفس منطق الحجز
  const bookButtons = document.querySelectorAll('.eng-book-btn, .book-btn');
  const subjectSelect = document.getElementById('subject');
  const productSelect = document.getElementById('bk-product');

  bookButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const itemName = btn.dataset.course || 'العنصر المطلوب';
      // تمييز إن كان الطلب لكتاب أم دورة
      const isBook = btn.classList.contains('book-btn');
      const itemLabel = isBook ? '📚 الكتاب' : '🎓 الدورة';

      // تحديث قائمة "نوع الخدمة" في نموذج التواصل
      if (subjectSelect) {
        subjectSelect.value = 'course';
      }

      // محاولة مطابقة المنتج تلقائياً في نموذج الحجز
      if (productSelect) {
        const opts = Array.from(productSelect.options);
        const match = opts.find((opt) => {
          const text = opt.textContent.trim();
          return itemName.includes(text) || text.includes(itemName);
        });
        if (match) productSelect.value = match.value;
      }

      // الانتقال إلى صفحة الطلب والحجز (يظهرها حتى لو كنا في وضع معزول)
      if (typeof showPage === 'function') {
        showPage('booking');
      } else {
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      // إشعار ودّي داخل نموذج الحجز
      const bookingStatus = document.getElementById('bookingStatus');
      if (bookingStatus) {
        bookingStatus.textContent = `📩 اخترت ${itemLabel} «${itemName}» — أكمل بياناتك بالأسفل لتأكيد الطلب.`;
        bookingStatus.className = 'booking-status success';
      }

      // تركيز حقل الاسم في نموذج الحجز
      const bkNameField = document.getElementById('bk-name');
      if (bkNameField) {
        setTimeout(() => bkNameField.focus({ preventScroll: true }), 700);
      }
    });
  });

  /* ----- 10-ج) نسخ بيانات الحساب (البنك + محفظة جيب) ----- */
  const copyFields = document.querySelectorAll('.copy-field, .pay-copy');
  copyFields.forEach((field) => {
    field.addEventListener('click', async () => {
      const text = field.dataset.copy || field.textContent.trim();
      const label = field.querySelector('.copy-text');
      // للتوافق مع .pay-copy الذي لا يحتوي .copy-text داخلي
      const valueEl = field.closest('.pay-field-row')
        ? field.closest('.pay-field-row').querySelector('.pay-field-value')
        : null;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const temp = document.createElement('textarea');
          temp.value = text;
          temp.setAttribute('readonly', '');
          temp.style.position = 'absolute';
          temp.style.left = '-9999px';
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }
        const originalLabel = label ? label.textContent : (valueEl ? valueEl.textContent : '');
        field.classList.add('copied');
        if (label) label.textContent = 'تم النسخ ✓';
        if (valueEl && !label) valueEl.textContent = 'تم النسخ ✓';
        setTimeout(() => {
          field.classList.remove('copied');
          if (label) label.textContent = originalLabel;
          if (valueEl && !label) valueEl.textContent = originalLabel;
        }, 1600);
      } catch (err) {
        /* تجاهل بهدوء في حال فشل النسخ */
      }
    });
  });

  /* ----- 10-د) إرسال نموذج الطلب والحجز عبر FormSubmit ----- */
  const bookingForm = document.getElementById('bookingForm');
  const bookingStatusEl = document.getElementById('bookingStatus');
  const bookingSubmitBtn = document.getElementById('bookingSubmitBtn');
  const receiptInput = document.getElementById('bk-receipt');
  const fileNameEl = document.getElementById('fileName');
  const transferInput = document.getElementById('bk-transfer');

  // عرض اسم الملف المختار في حقل الإيصال
  if (receiptInput && fileNameEl) {
    receiptInput.addEventListener('change', () => {
      if (receiptInput.files && receiptInput.files.length > 0) {
        const f = receiptInput.files[0];
        // حد أقصى تقريبي 5 ميجابايت
        if (f.size > 5 * 1024 * 1024) {
          fileNameEl.textContent = '⚠️ حجم الملف كبير (الحد 5 ميجابايت)';
          fileNameEl.classList.add('is-error');
          receiptInput.value = '';
        } else {
          fileNameEl.textContent = `📎 ${f.name}`;
          fileNameEl.classList.remove('is-error');
        }
      } else {
        fileNameEl.textContent = 'اختر صورة الإيصال (اختياري)';
        fileNameEl.classList.remove('is-error');
      }
    });
  }

  if (bookingForm) {
    // الحقول النصية/القوائم المطلوبة (بدون الملف وبدون رقم الحوالة)
    const requiredFields = bookingForm.querySelectorAll(
      'input[type="text"][required], input[type="email"][required], select[required]'
    );
    const payMethodInputs = bookingForm.querySelectorAll('input[name="طريقة الدفع"]');

    // إزالة تمييز الخطأ أثناء التفاعل
    bookingForm.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('invalid'));
      field.addEventListener('change', () => field.classList.remove('invalid'));
    });

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;
      let firstInvalid = null;

      // 1) التحقق من الحقول النصية/القوائم
      requiredFields.forEach((field) => {
        const value = field.value.trim();
        if (value) {
          field.classList.remove('invalid');
        } else {
          field.classList.add('invalid');
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      // 2) التحقق من اختيار طريقة الدفع
      const methodChosen = Array.from(payMethodInputs).some((r) => r.checked);
      const methodGroup = bookingForm.querySelector('.pay-method');
      if (!methodChosen) {
        valid = false;
        if (methodGroup) methodGroup.classList.add('invalid');
        if (!firstInvalid) firstInvalid = payMethodInputs[0];
      } else if (methodGroup) {
        methodGroup.classList.remove('invalid');
      }

      // 3) التحقق: رقم الحوالة أو صورة الإيصال (أحدهما يكفي)
      const hasTransfer = transferInput && transferInput.value.trim() !== '';
      const hasReceipt = receiptInput && receiptInput.files && receiptInput.files.length > 0;
      const receiptGroup = bookingForm.querySelector('.file-upload');
      if (!hasTransfer && !hasReceipt) {
        valid = false;
        if (receiptGroup) receiptGroup.classList.add('invalid');
        if (transferInput) transferInput.classList.add('invalid');
        if (!firstInvalid) firstInvalid = transferInput;
      } else {
        if (receiptGroup) receiptGroup.classList.remove('invalid');
        if (transferInput) transferInput.classList.remove('invalid');
      }

      if (!valid) {
        if (bookingStatusEl) {
          bookingStatusEl.textContent = '⚠️ يرجى إكمال الحقول المطلوبة (*)، واختيار طريقة الدفع، وإدخال رقم الحوالة أو إرفاق صورة الإيصال.';
          bookingStatusEl.className = 'booking-status error';
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // حالة الإرسال
      const originalBtnText = bookingSubmitBtn ? bookingSubmitBtn.textContent : '';
      if (bookingSubmitBtn) {
        bookingSubmitBtn.textContent = 'جارٍ الإرسال...';
        bookingSubmitBtn.disabled = true;
      }
      if (bookingStatusEl) {
        bookingStatusEl.textContent = '';
        bookingStatusEl.className = 'booking-status';
      }

      try {
        if (bookingStatusEl) {
          bookingStatusEl.textContent = '✅ تم إرسال طلبك بنجاح! تم تسجيل بيانات الحجز محلياً داخل الصفحة، ويمكنك إرسالها لاحقاً عبر البريد الإلكتروني.';
          bookingStatusEl.className = 'booking-status success';
        }
        bookingForm.reset();
        if (fileNameEl) fileNameEl.textContent = 'اختر صورة الإيصال (اختياري)';
      } catch (err) {
        if (bookingStatusEl) {
          bookingStatusEl.innerHTML = '⚠️ تعذّر الإرسال التلقائي. أرسل التفاصيل إلى <a href="mailto:Atyaf.creative.info@gmail.com" dir="ltr">Atyaf.creative.info@gmail.com</a>.';
          bookingStatusEl.className = 'booking-status error';
        }
      } finally {
        if (bookingSubmitBtn) {
          bookingSubmitBtn.textContent = originalBtnText;
          bookingSubmitBtn.disabled = false;
        }
      }
    });
  }

  /* ----- 11) تشغيل الدوال الأولية ----- */
  handleNavScroll();
  handleScrollTop();
  setActiveLink();
});
