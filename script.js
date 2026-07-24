(() => {
  "use strict";

  const HEADER_DELAY = 2500;
  const FIRST_OVERLAY_DELAY = 4800;
  const OVERLAY_INTERVAL = 30000;
  const OVERLAY_DURATION = 5000;
  const FINAL_VIDEO_DELAY = 30000;
  const FINAL_VIDEO_FADE_DURATION = 1200;

  function init() {
    const backgroundVideo = document.getElementById("lataVideo");
    const backgroundMusic = document.getElementById("backgroundMusic");
    const finalVideo = document.getElementById("finalVideo");
    const finalVideoWrapper = document.getElementById("final-video-wrapper");
    const header = document.getElementById("image-header");
    const contentSection = document.getElementById("comprar");

    if (!backgroundVideo || !finalVideo || !finalVideoWrapper || !header || !contentSection) return;

    let headerTimer;
    let firstOverlayTimer;
    let finalVideoTimer;
    let overlayInterval;
    let hideOverlayTimer;
    let removeOverlayTimer;
    let musicFadeTimer;
    let musicStartTimers = [];
    let isFinalVideoPlaying = false;
    let finalFadeStarted = false;

    const play = (video) => video.play().catch(() => {});

    const playMusic = () => {
      if (!backgroundMusic || isFinalVideoPlaying) return;
      backgroundMusic.muted = false;
      backgroundMusic.play().catch(() => {});
    };

    const fadeMusicTo = (targetVolume, duration) => {
      if (!backgroundMusic) return;

      window.clearInterval(musicFadeTimer);
      const initialVolume = backgroundMusic.volume;
      const steps = 24;
      let step = 0;

      musicFadeTimer = window.setInterval(() => {
        step += 1;
        backgroundMusic.volume = initialVolume + (targetVolume - initialVolume) * (step / steps);

        if (step >= steps) {
          window.clearInterval(musicFadeTimer);
          backgroundMusic.volume = targetVolume;
        }
      }, duration / steps);
    };

    const startMusicWhenReady = () => {
      musicStartTimers.forEach((timer) => window.clearTimeout(timer));
      musicStartTimers = [0, 500, 1500].map((delay) => window.setTimeout(playMusic, delay));
    };

    const hideOverlay = () => {
      window.clearTimeout(hideOverlayTimer);
      window.clearTimeout(removeOverlayTimer);
      contentSection.classList.remove("show-overlay");
      contentSection.classList.remove("overlay-ready");
      contentSection.setAttribute("aria-hidden", "true");
    };

    const showOverlay = () => {
      window.clearTimeout(hideOverlayTimer);
      window.clearTimeout(removeOverlayTimer);
      contentSection.classList.add("overlay-ready");
      contentSection.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => contentSection.classList.add("show-overlay"));

      hideOverlayTimer = window.setTimeout(() => {
        contentSection.classList.remove("show-overlay");
        contentSection.setAttribute("aria-hidden", "true");
      }, OVERLAY_DURATION);
      removeOverlayTimer = window.setTimeout(() => {
        contentSection.classList.remove("overlay-ready");
      }, OVERLAY_DURATION + 600);
    };

    const clearPageTimers = () => {
      window.clearTimeout(headerTimer);
      window.clearTimeout(firstOverlayTimer);
      window.clearTimeout(finalVideoTimer);
      window.clearInterval(overlayInterval);
      window.clearTimeout(hideOverlayTimer);
      window.clearTimeout(removeOverlayTimer);
      window.clearInterval(musicFadeTimer);
      musicStartTimers.forEach((timer) => window.clearTimeout(timer));
      musicStartTimers = [];
    };

    const startFinalVideo = () => {
      clearPageTimers();
      isFinalVideoPlaying = true;
      finalFadeStarted = false;
      hideOverlay();
      header.classList.add("hide-header");
      backgroundVideo.pause();
      fadeMusicTo(0.12, 1200);
      finalVideo.currentTime = 0;
      finalVideoWrapper.classList.add("show-final-video");
      finalVideoWrapper.setAttribute("aria-hidden", "false");
      play(finalVideo);
    };

    const startFinalFadeOut = () => {
      if (finalFadeStarted) return;
      finalFadeStarted = true;
      finalVideoWrapper.classList.remove("show-final-video");
      finalVideoWrapper.setAttribute("aria-hidden", "true");
      document.body.classList.add("page-fade-out");
      play(backgroundVideo);
    };

    const startPageCycle = () => {
      clearPageTimers();
      isFinalVideoPlaying = false;
      finalVideo.pause();
      finalVideo.currentTime = 0;
      finalVideoWrapper.classList.remove("show-final-video");
      finalVideoWrapper.setAttribute("aria-hidden", "true");
      document.body.classList.remove("page-fade-out");
      hideOverlay();
      header.classList.remove("hide-header");
      play(backgroundVideo);
      if (backgroundMusic) {
        backgroundMusic.currentTime = 0;
        backgroundMusic.volume = 0.45;
        startMusicWhenReady();
      }

      headerTimer = window.setTimeout(() => header.classList.add("hide-header"), HEADER_DELAY);
      firstOverlayTimer = window.setTimeout(showOverlay, FIRST_OVERLAY_DELAY);
      overlayInterval = window.setInterval(showOverlay, OVERLAY_INTERVAL);
      finalVideoTimer = window.setTimeout(startFinalVideo, FINAL_VIDEO_DELAY);
    };

    finalVideo.addEventListener("timeupdate", () => {
      const remainingTime = finalVideo.duration - finalVideo.currentTime;
      if (Number.isFinite(remainingTime) && remainingTime <= FINAL_VIDEO_FADE_DURATION / 1000) {
        startFinalFadeOut();
      }
    });
    finalVideo.addEventListener("ended", startPageCycle);
    if (backgroundMusic) {
      backgroundMusic.addEventListener("canplay", playMusic, { once: true });
    }
    startPageCycle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
