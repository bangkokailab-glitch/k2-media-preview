// Keep the video visible to Safari. The separate picture covers it until a frame is ready.
export function initBackgroundVideo(siteAsset) {
  const video = document.querySelector('#background-video');
  const hero = video?.closest('.hero');
  if (!video || !hero || video.dataset.backgroundInitialized) return;
  video.dataset.backgroundInitialized = 'true';

  const poster = hero.querySelector('picture.hero-poster img, img.hero-poster');
  const mobile = matchMedia('(max-width:600px)');
  const reduce = matchMedia('(prefers-reduced-motion:reduce)');
  const bounds = hero.getBoundingClientRect();
  let inView = bounds.bottom > 0 && bounds.top < innerHeight;
  let sourceURL = '';
  let sourceGeneration = 0;
  let playSerial = 0;
  let pendingPlay = false;
  let automaticAttempts = 0;
  let needsGesture = false;
  let frameCallback = null;
  let restoreTime = 0;
  const maxAutomaticAttempts = 3;

  video.controls = false;
  video.removeAttribute('controls');
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('disablepictureinpicture', '');
  video.setAttribute('disableremoteplayback', '');

  const eligible = () => inView && !document.hidden && !reduce.matches;
  const hideFrame = () => {
    hero.classList.remove('has-video-frame');
    if (frameCallback !== null && video.cancelVideoFrameCallback) {
      video.cancelVideoFrameCallback(frameCallback);
    }
    frameCallback = null;
  };

  const stop = () => {
    playSerial++;
    pendingPlay = false;
    video.pause();
    hideFrame();
  };

  const updatePoster = () => {
    const still = siteAsset(mobile.matches ? 'poster-mobile.webp' : 'poster-desktop.webp');
    if (video.poster !== still) video.poster = still;
    if (poster && poster.src !== still) poster.src = still;
  };

  const ensureSource = () => {
    const next = siteAsset(mobile.matches ? 'k2-hero-mobile-v2.mp4' : 'k2-hero-desktop-v2.mp4');
    updatePoster();
    if (sourceURL === next) return;
    restoreTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    stop();
    sourceGeneration++;
    sourceURL = next;
    automaticAttempts = 0;
    needsGesture = false;
    // Set all autoplay properties before assigning the one selected source.
    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    video.preload = 'auto';
    video.src = next;
    video.load();
  };

  const revealFrame = () => {
    const generation = sourceGeneration;
    const reveal = () => {
      frameCallback = null;
      if (generation !== sourceGeneration || !eligible() || video.paused || video.readyState < 2) return;
      hero.classList.add('has-video-frame');
      video.dataset.autoplayStatus = 'playing';
    };
    if (frameCallback !== null || !eligible()) return;
    if (video.requestVideoFrameCallback) frameCallback = video.requestVideoFrameCallback(reveal);
    else requestAnimationFrame(reveal);
  };

  const attempt = (fromGesture = false) => {
    if (!eligible()) return;
    ensureSource();
    if (!video.paused && video.readyState >= 2) {
      revealFrame();
      return;
    }
    if (pendingPlay || (!fromGesture && (needsGesture || automaticAttempts >= maxAutomaticAttempts))) return;
    if (!fromGesture) automaticAttempts++;
    const serial = ++playSerial;
    const generation = sourceGeneration;
    pendingPlay = true;
    video.muted = true;
    video.dataset.autoplayStatus = 'starting';
    const failure = error => {
      if (serial !== playSerial || generation !== sourceGeneration) return;
      pendingPlay = false;
      needsGesture = error?.name === 'NotAllowedError';
      video.dataset.autoplayStatus = needsGesture ? 'blocked' : 'waiting';
      hideFrame();
    };
    try {
      const request = video.play();
      if (request?.then) {
        request.then(() => {
          if (serial !== playSerial || generation !== sourceGeneration) return;
          pendingPlay = false;
          needsGesture = false;
          revealFrame();
        }, failure);
      } else pendingPlay = false;
    } catch (error) {
      failure(error);
    }
  };

  const resume = () => {
    if (!eligible()) {
      stop();
      return;
    }
    automaticAttempts = 0;
    needsGesture = false;
    attempt();
  };

  video.addEventListener('loadedmetadata', () => {
    if (restoreTime > 0 && Number.isFinite(video.duration)) {
      try { video.currentTime = Math.min(restoreTime, Math.max(0, video.duration - 0.1)); } catch (_) {}
    }
    restoreTime = 0;
  });
  video.addEventListener('loadeddata', () => attempt());
  video.addEventListener('canplay', () => attempt());
  video.addEventListener('playing', () => {
    needsGesture = false;
    revealFrame();
  });
  video.addEventListener('pause', hideFrame);
  video.addEventListener('emptied', hideFrame);
  video.addEventListener('error', () => {
    playSerial++;
    pendingPlay = false;
    video.dataset.autoplayStatus = 'error';
    hideFrame();
  });

  // If platform policy requires a gesture, retry synchronously inside a natural interaction.
  const onGesture = () => { if (needsGesture && eligible()) attempt(true); };
  document.addEventListener('touchend', onGesture, { passive: true });
  document.addEventListener('pointerup', onGesture, { passive: true });
  document.addEventListener('keydown', onGesture);
  document.addEventListener('visibilitychange', resume);
  window.addEventListener('pageshow', resume);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting;
      if (visible === inView) return;
      inView = visible;
      resume();
    }, { threshold: 0 }).observe(hero);
  }

  mobile.addEventListener('change', () => {
    updatePoster();
    if (eligible()) resume();
  });
  reduce.addEventListener('change', () => {
    if (reduce.matches) {
      stop();
      video.autoplay = false;
      video.preload = 'none';
      if (sourceURL) {
        sourceGeneration++;
        sourceURL = '';
        video.removeAttribute('src');
        video.load();
      }
      video.dataset.autoplayStatus = 'reduced-motion';
    } else resume();
  });

  updatePoster();
  if (reduce.matches) {
    video.autoplay = false;
    video.preload = 'none';
    video.dataset.autoplayStatus = 'reduced-motion';
  } else attempt();
}
