
import { useEffect, useRef, useState } from "react";
import { Music2, VolumeX } from "lucide-react";

// =========================================
// COMPONENTS
// =========================================

import Cover from "./components/Cover";
import Hero from "./components/Hero";
import Couple from "./components/Couple";
import Countdown from "./components/Countdown";
import WeddingEvents from "./components/WeddingEvents";
import Gallery from "./components/Gallery";
import LoveStory from "./components/LoveStory";
import WeddingGift from "./components/WeddingGift";
import WeddingWishes from "./components/WeddingWishes";
import Closing from "./components/Closing";
import BackgroundSlideshow from "./components/BackgroundSlideshow";

import "./App.css";

// =========================================
// CONFIGURATION
// =========================================

const MUSIC_PATH = "/music/Tulus.mp3";
const MUSIC_VOLUME = 0.45;
const COVER_FALLBACK_MS = 2000;

function App() {
  // =========================================
  // STATE & REFS
  // =========================================

  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const openingRef = useRef(false);

  const shouldResumeRef = useRef(false);
  const pausedByVisibilityRef = useRef(false);

  // =========================================
  // AUTO PAUSE / RESUME MUSIC
  // =========================================

  useEffect(() => {
    function pauseWhenHidden() {
      const audio = audioRef.current;

      if (!audio) return;
      if (pausedByVisibilityRef.current) return;

      // Ingat apakah musik sedang dimainkan.
      shouldResumeRef.current = !audio.paused;

      pausedByVisibilityRef.current = true;

      // Jangan reset currentTime.
      audio.pause();
      setIsPlaying(false);
    }

    function resumeWhenVisible() {
      const audio = audioRef.current;

      if (!audio) return;

      if (document.visibilityState !== "visible") {
        return;
      }

      // Cegah resume berulang dari pageshow.
      if (!pausedByVisibilityRef.current) {
        return;
      }

      pausedByVisibilityRef.current = false;

      // Kalau sebelumnya pause manual,
      // tidak perlu diputar otomatis.
      if (!shouldResumeRef.current) {
        return;
      }

      shouldResumeRef.current = false;

      try {
        const playPromise = audio.play();

        if (playPromise?.catch) {
          playPromise.catch((error) => {
            console.warn(
              "Musik gagal dilanjutkan:",
              error
            );

            setIsPlaying(false);
          });
        }
      } catch (error) {
        console.warn(
          "Audio resume error:",
          error
        );

        setIsPlaying(false);
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        pauseWhenHidden();
      } else {
        resumeWhenVisible();
      }
    }

    function handlePageHide() {
      pauseWhenHidden();
    }

    function handlePageShow() {
      resumeWhenVisible();
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "pagehide",
      handlePageHide
    );

    window.addEventListener(
      "pageshow",
      handlePageShow
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "pagehide",
        handlePageHide
      );

      window.removeEventListener(
        "pageshow",
        handlePageShow
      );
    };
  }, []);

  // =========================================
  // START MUSIC
  // =========================================

  function startMusic() {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = MUSIC_VOLUME;

    try {
      const playPromise = audio.play();

      if (playPromise?.catch) {
        playPromise.catch((error) => {
          console.warn(
            "Musik tidak bisa diputar:",
            error
          );

          setIsPlaying(false);
        });
      }
    } catch (error) {
      console.warn("Audio error:", error);
      setIsPlaying(false);
    }
  }

  // =========================================
  // MUSIC PLAY / PAUSE BUTTON
  // =========================================

  function toggleMusic() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      shouldResumeRef.current = false;
      startMusic();
    } else {
      shouldResumeRef.current = false;
      audio.pause();
    }
  }

  // =========================================
  // COVER EXIT ANIMATION
  // =========================================

  function playCoverExitAnimation() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const originalCover =
      document.querySelector(".invite-cover");

    if (!originalCover) return;

    // Salinan Cover untuk animasi keluar.
    const visualCover = originalCover.cloneNode(true);

    visualCover.setAttribute(
      "aria-hidden",
      "true"
    );

    visualCover.style.pointerEvents = "none";
    visualCover.style.zIndex = "10001";

    const clonedButton =
      visualCover.querySelector("button");

    if (clonedButton) {
      clonedButton.disabled = true;
      clonedButton.tabIndex = -1;
    }

    document.body.appendChild(visualCover);

    // Pastikan browser menerapkan style awal.
    void visualCover.offsetWidth;

    let fallbackTimer;

    function cleanup() {
      window.clearTimeout(fallbackTimer);
      visualCover.remove();
    }

    function handleAnimationEnd(event) {
      if (
        event.target === visualCover &&
        event.animationName === "inviteCoverExit"
      ) {
        cleanup();
      }
    }

    visualCover.addEventListener(
      "animationend",
      handleAnimationEnd
    );

    visualCover.classList.add(
      "invite-cover--opening"
    );

    fallbackTimer = window.setTimeout(
      cleanup,
      COVER_FALLBACK_MS
    );
  }

  // =========================================
  // OPEN INVITATION
  // =========================================

  function handleOpenInvitation() {
    if (isOpened || openingRef.current) {
      return;
    }

    openingRef.current = true;

    try {
      playCoverExitAnimation();
    } catch (error) {
      console.warn(
        "Animasi Cover gagal:",
        error
      );
    }

    // Lepaskan scroll lock.
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    // Hero langsung muncul di belakang clone.
    setIsOpened(true);

    // Musik dimulai dari klik pengguna.
    startMusic();
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <>
      {/* BACKGROUND MUSIC */}
      <audio
        ref={audioRef}
        src={MUSIC_PATH}
        preload="metadata"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      {!isOpened ? (
        // ===================================
        // COVER — HANYA SATU
        // ===================================

        <Cover onOpen={handleOpenInvitation} />
      ) : (
        <>
          {/* BACKGROUND SLIDESHOW */}
          <BackgroundSlideshow />

          {/* MAIN INVITATION */}
          <div className="invitation-layout">

            <main className="main-invitation">

              <Hero />

              <Couple />

              <Countdown />

              <WeddingEvents />

              <Gallery />

              {/* QS AR-RUM 21 */}
              <LoveStory />

              <WeddingGift />

              <WeddingWishes />

              {/* SECTION PALING AKHIR */}
              <Closing />

            </main>

            {/* FLOATING MUSIC BUTTON */}
            <button
              type="button"
              className={`music-toggle ${
                isPlaying ? "music-playing" : ""
              }`}
              onClick={toggleMusic}
              aria-label={
                isPlaying
                  ? "Pause wedding music"
                  : "Play wedding music"
              }
              aria-pressed={isPlaying}
              title={
                isPlaying
                  ? "Pause Music"
                  : "Play Music"
              }
            >
              {isPlaying ? (
                <Music2 size={20} />
              ) : (
                <VolumeX size={20} />
              )}
            </button>

          </div>
        </>
      )}
    </>
  );
}

export default App;
