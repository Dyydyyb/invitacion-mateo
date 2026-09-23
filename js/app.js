/**
 * Invitación de Cumpleaños de Mateo
 * Lógica interactiva: Countdown, Copiar Alias, Lightbox de Galería y Sonido Ambiente
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initCopyAlias();
  initLightbox();
  initAmbientAudio();
});

/* ==========================================================================
   1. Cuenta Regresiva (Viernes 23 de Octubre a las 22:00 hs)
   ========================================================================== */
function initCountdown() {
  // Fecha del evento: 23 de Octubre de 2026 a las 22:00:00 (Hora Argentina UTC-3)
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
   2. Copiar Alias (Teomp.15) con Notificación Toast
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

      // Feedback en botón
      const originalText = copyBtn.innerHTML;
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>¡Copiado!</span>
      `;

      showToast(`¡Alias ${aliasText} copiado al portapapeles!`);

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = originalText;
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
   3. Lightbox para Galería de Fotos
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const cards = document.querySelectorAll('.gallery-card');

  if (!modal || !modalImg || !closeBtn) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-img');
      const title = card.querySelector('.gallery-caption-title')?.textContent || '';
      const desc = card.querySelector('.gallery-caption-desc')?.textContent || '';

      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Foto de Mateo';
        modalCaption.textContent = title ? `${title} - ${desc}` : '';
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
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   4. Reproductor de Melodía Ambiente Sofisticada (Web Audio API)
   ========================================================================== */
function initAmbientAudio() {
  const audioBtn = document.getElementById('audioToggleBtn');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let timerId = null;

  // Secuencia de arpegio elegante y cálida en Do Mayor / La menor
  const notes = [
    523.25, // C5
    659.25, // E5
    783.99, // G5
    987.77, // B5
    880.00, // A5
    659.25, // E5
    783.99, // G5
    587.33  // D5
  ];

  let noteIdx = 0;

  function playChimeNote(freq) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Envolvente suave estilo caja de música / campana fina
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio note play error:', e);
    }
  }

  function startMelody() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    audioBtn.classList.add('playing');
    const labelSpan = audioBtn.querySelector('.audio-label');
    if (labelSpan) labelSpan.textContent = 'Música: On';

    playStep();
    timerId = setInterval(playStep, 550);
  }

  function playStep() {
    if (!isPlaying) return;
    const freq = notes[noteIdx % notes.length];
    playChimeNote(freq);
    noteIdx++;
  }

  function stopMelody() {
    isPlaying = false;
    audioBtn.classList.remove('playing');
    const labelSpan = audioBtn.querySelector('.audio-label');
    if (labelSpan) labelSpan.textContent = 'Música: Off';
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startMelody();
    } else {
      stopMelody();
    }
  });
}
