/**
 * Invitación de Cumpleaños de Mateo
 * Lógica interactiva: Countdown, Slider de Fotos Touch, Copiar Alias,
 * Animaciones on-scroll, Confeti festivo y RSVP flotante.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCountdown();
  initCopyAlias();
  initPhotoSlider();
  initLightbox();
  initFloatingRsvp();
  initMusicPlayer();
  initConfetti();
});

/* ==========================================================================
   1. Animaciones al Scrollear (Scroll Reveal)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   2. Cuenta Regresiva (Viernes 23 de Octubre a las 22:00 hs)
   ========================================================================== */
function initCountdown() {
  const eventDate = new Date('2026-10-23T22:00:00-03:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   3. Copiar Alias (Teomp.15) con Notificación Toast
   ========================================================================== */
function initCopyAlias() {
  const copyBtn = document.getElementById('btnCopyAlias');
  const toast = document.getElementById('toastNotice');
  const aliasText = 'Teomp.15';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(aliasText);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = aliasText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      const originalHTML = copyBtn.innerHTML;
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>¡Copiado!</span>
      `;

      showToast(`¡Alias ${aliasText} copiado al portapapeles!`);

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = originalHTML;
      }, 2500);
    } catch (err) {
      showToast(`Alias: ${aliasText}`);
    }
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/* ==========================================================================
   4. Slider de Fotos Interactivo con Touch / Swipe y Autoplay
   ========================================================================== */
function initPhotoSlider() {
  const track = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slider-slide');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const dotsContainer = document.getElementById('sliderDots');
  const counterEl = document.getElementById('sliderCounter');
  const wrapper = document.getElementById('sliderWrapper');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Actualizar dots
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Actualizar contador
    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1} / ${totalSlides}`;
    }
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateSlider();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Dot clicks
  if (dotsContainer) {
    dotsContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('.slider-dot');
      if (dot) {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        goToSlide(index);
        resetAutoplay();
      }
    });
  }

  // Autoplay continuo cada 3.5 segundos
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 3500);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
    wrapper.addEventListener('touchstart', stopAutoplay, { passive: true });
    wrapper.addEventListener('touchend', startAutoplay, { passive: true });
  }

  startAutoplay();

  // Soporte Touch Swipe para celulares
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 45;
    const diff = startX - endX;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoplay();
    }
  }
}

/* ==========================================================================
   5. Lightbox para Fotos del Slider
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const slideCards = document.querySelectorAll('.slide-card');

  if (!modal || !modalImg || !closeBtn) return;

  slideCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.slide-image');
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Foto de Mateo';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. Botón Flotante Persistente de RSVP
   ========================================================================== */
function initFloatingRsvp() {
  const floatingBtn = document.getElementById('floatingRsvpWrapper');
  const heroSection = document.getElementById('inicio');

  if (!floatingBtn || !heroSection) return;

  window.addEventListener('scroll', () => {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    if (heroBottom < 100) {
      floatingBtn.classList.add('show');
    } else {
      floatingBtn.classList.remove('show');
    }
  }, { passive: true });
}

/* ==========================================================================
   7. Confeti Festivo Sutil (Canvas en Azul, Celeste y Plata)
   ========================================================================== */
function initConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const colors = ['#0f244a', '#1e3a8a', '#2563eb', '#93c5fd', '#cbd5e1'];
  let particles = [];
  const maxParticles = 40;

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * -50,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 1.5 + 0.8,
      speedX: Math.random() * 1 - 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
      opacity: Math.random() * 0.7 + 0.3
    };
  }

  for (let i = 0; i < maxParticles; i++) {
    const p = createParticle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();

      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > canvas.height + 20) {
        Object.assign(p, createParticle());
      }
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   8. Reproductor de Música Premium ("Ayer Hablé Con Dios")
   ========================================================================== */
function initMusicPlayer() {
  const audio = document.getElementById('mainAudioElement');
  const btnMainPlay = document.getElementById('btnMainPlay');
  const btnTopNav = document.getElementById('audioToggleBtn');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const btnRewind = document.getElementById('btnRewind10');
  const btnForward = document.getElementById('btnForward10');
  const btnVolume = document.getElementById('btnVolumeToggle');
  const iconVolOn = document.getElementById('iconVolOn');
  const iconVolOff = document.getElementById('iconVolOff');
  const progressWrapper = document.getElementById('musicProgressWrapper');
  const progressFill = document.getElementById('musicProgressFill');
  const currentTimeEl = document.getElementById('musicCurrentTime');
  const durationEl = document.getElementById('musicDuration');
  const vinylWrapper = document.getElementById('vinylWrapper');
  const waveBars = document.getElementById('musicWaveBars');
  const statusDot = document.getElementById('musicLiveDot');
  const statusText = document.getElementById('playerStatusText');

  if (!audio) return;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  function updateUIState(isPlaying) {
    if (iconPlay && iconPause) {
      iconPlay.style.display = isPlaying ? 'none' : 'block';
      iconPause.style.display = isPlaying ? 'block' : 'none';
    }

    if (btnMainPlay) {
      btnMainPlay.setAttribute('title', isPlaying ? 'Pausar música' : 'Reproducir música');
      btnMainPlay.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproducir música');
    }

    if (vinylWrapper) {
      vinylWrapper.classList.toggle('playing', isPlaying);
    }
    if (waveBars) {
      waveBars.classList.toggle('playing', isPlaying);
    }
    if (statusDot) {
      statusDot.classList.toggle('playing', isPlaying);
    }
    if (statusText) {
      statusText.textContent = isPlaying ? 'Reproduciendo...' : 'Pausado';
    }

    if (btnTopNav) {
      btnTopNav.classList.toggle('playing', isPlaying);
      const label = btnTopNav.querySelector('.audio-label');
      if (label) {
        label.textContent = isPlaying ? 'Música: On' : 'Música: Off';
      }
    }
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play().then(() => {
        updateUIState(true);
      }).catch((err) => {
        console.warn('Reproducción de audio bloqueada o pendiente de interacción:', err);
        updateUIState(false);
      });
    } else {
      audio.pause();
      updateUIState(false);
    }
  }

  if (btnMainPlay) {
    btnMainPlay.addEventListener('click', togglePlay);
  }

  if (btnTopNav) {
    btnTopNav.addEventListener('click', togglePlay);
  }

  audio.addEventListener('play', () => updateUIState(true));
  audio.addEventListener('pause', () => updateUIState(false));
  audio.addEventListener('ended', () => {
    updateUIState(false);
    if (progressFill) progressFill.style.width = '0%';
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
  });

  function setDuration() {
    if (durationEl && audio.duration && !isNaN(audio.duration)) {
      durationEl.textContent = formatTime(audio.duration);
    }
  }

  audio.addEventListener('loadedmetadata', setDuration);
  audio.addEventListener('durationchange', setDuration);
  audio.addEventListener('canplay', setDuration);
  if (audio.readyState >= 1) {
    setDuration();
  }

  let isDraggingProgress = false;

  audio.addEventListener('timeupdate', () => {
    if (!isDraggingProgress && audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      if (progressFill) {
        progressFill.style.width = `${percent}%`;
      }
      if (progressWrapper) {
        progressWrapper.setAttribute('aria-valuenow', Math.round(percent));
      }
    }
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  function seekByEvent(e) {
    if (!progressWrapper || !audio.duration) return;
    const rect = progressWrapper.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = clickX / rect.width;

    if (progressFill) {
      progressFill.style.width = `${percent * 100}%`;
    }
    audio.currentTime = percent * audio.duration;
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  }

  if (progressWrapper) {
    progressWrapper.addEventListener('click', (e) => {
      seekByEvent(e);
    });

    progressWrapper.addEventListener('pointerdown', (e) => {
      isDraggingProgress = true;
      seekByEvent(e);

      function onPointerMove(moveEvent) {
        if (isDraggingProgress) {
          seekByEvent(moveEvent);
        }
      }

      function onPointerUp(upEvent) {
        if (isDraggingProgress) {
          seekByEvent(upEvent);
          isDraggingProgress = false;
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
        }
      }

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });

    progressWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
      }
    });
  }

  if (btnRewind) {
    btnRewind.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    });
  }

  if (btnForward) {
    btnForward.addEventListener('click', () => {
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
    });
  }

  if (btnVolume) {
    btnVolume.addEventListener('click', () => {
      audio.muted = !audio.muted;
      if (iconVolOn && iconVolOff) {
        iconVolOn.style.display = audio.muted ? 'none' : 'block';
        iconVolOff.style.display = audio.muted ? 'block' : 'none';
      }
      btnVolume.setAttribute('title', audio.muted ? 'Activar sonido' : 'Silenciar sonido');
      btnVolume.setAttribute('aria-label', audio.muted ? 'Activar sonido' : 'Silenciar sonido');
    });
  }
}
