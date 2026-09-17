document.addEventListener('DOMContentLoaded', () => {
  const viberChatUrl = 'viber://chat?number=38761967914/';
  const body = document.body;
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
  const bookingForm = document.querySelector('#booking-form');
  const bookingStatus = document.querySelector('.booking-status');
  const backToTop = document.querySelector('.back-to-top');
  const sections = Array.from(document.querySelectorAll('section[id], footer[id]'));
  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  const dateInput = document.querySelector('input[name="date"]');
  const galleryButtons = Array.from(document.querySelectorAll('.gallery-button'));
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let activeGalleryIndex = 0;

  if (dateInput && !dateInput.min) {
    dateInput.min = new Date().toISOString().slice(0, 10);
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      body.classList.toggle('nav-open', !expanded);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      body.classList.remove('nav-open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');

      const top = Math.max(target.offsetTop - 70, 0);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  if (bookingForm && bookingStatus) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (typeof bookingForm.checkValidity === 'function' && !bookingForm.checkValidity()) {
        bookingStatus.textContent = 'Odaberite broj gostiju, datum i vrijeme za upit za sto.';
        bookingStatus.classList.add('is-visible');
        return;
      }
      bookingStatus.textContent = 'Otvaramo Viber za slanje upita.';
      bookingStatus.classList.add('is-visible');
      window.location.href = viberChatUrl;
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const galleryItems = galleryButtons
    .map((button) => {
      const image = typeof button.querySelector === 'function' ? button.querySelector('img') : null;
      return {
        src: button.dataset.lightboxSrc || (image ? image.getAttribute('src') : ''),
        alt: button.dataset.lightboxAlt || (image ? image.getAttribute('alt') : ''),
      };
    })
    .filter((item) => item.src);

  const setLightboxImage = (index) => {
    if (!galleryItems.length || !lightboxImage) return;

    activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[activeGalleryIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt || '';
  };

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImage || !galleryItems.length) return;

    setLightboxImage(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    body.classList.add('lightbox-open');

    if (lightboxClose && typeof lightboxClose.focus === 'function') {
      lightboxClose.focus();
    }
  };

  const closeLightbox = () => {
    if (!lightbox) return;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    body.classList.remove('lightbox-open');

    if (lightboxImage) {
      lightboxImage.src = '';
      lightboxImage.alt = '';
    }

    const activeButton = galleryButtons[activeGalleryIndex];
    if (activeButton && typeof activeButton.focus === 'function') {
      activeButton.focus();
    }
  };

  const showLightboxOffset = (offset) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    setLightboxImage(activeGalleryIndex + offset);
  };

  galleryButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => showLightboxOffset(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => showLightboxOffset(1));
  }

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  window.addEventListener('keydown', (event) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowLeft') {
      if (typeof event.preventDefault === 'function') event.preventDefault();
      showLightboxOffset(-1);
    }

    if (event.key === 'ArrowRight') {
      if (typeof event.preventDefault === 'function') event.preventDefault();
      showLightboxOffset(1);
    }
  });

  const updateScrollState = () => {
    const scrollY = window.pageYOffset || 0;

    if (backToTop) {
      backToTop.classList.toggle('is-visible', scrollY > 520);
    }

    let activeId = '';
    sections.forEach((section) => {
      const id = section.getAttribute ? section.getAttribute('id') : '';
      if (id && scrollY >= section.offsetTop - 140) {
        activeId = id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
    });
  };

  window.addEventListener('scroll', updateScrollState);
  updateScrollState();

  if (typeof IntersectionObserver === 'function') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
});
