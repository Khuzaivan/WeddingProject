
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

// STYLES
import "./App.css";

// =========================================
// CONFIGURATION
// =========================================

const MUSIC_PATH = "/music/Tulus.mp3";
const MUSIC_VOLUME = 0.45;
const COVER_FALLBACK_MS = 2000;

function App() {
  // =========================================
  // STATE
  // =========================================

  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // =========================================
  // REFS
  // =========================================

  const audioRef = useRef(null);
  const openingRef = useRef(false);

  // Menyimpan status musik sebelum keluar tab
  const shouldResumeRef = useRef(false);

  // Mencegah pause berulang mengubah status resume
  const pausedByVisibilityRef = useRef(false);

  // =========================================
  // AUTO PAUSE & RESUME MUSIC
  // =========================================

  useEffect(() => {
    // ---------------------------------------
    // KETIKA PENGGUNA MENINGGALKAN TAB
    // ---------------------------------------

    function pauseWhenHidden() {
      const audio = audioRef.current;

      if (!audio) return;

      // Jangan menimpa status resume kalau
      // event hidden/pagehide terpanggil dua kali.
      if (pausedByVisibilityRef.current) return;

      // Ingat apakah musik sedang berjalan.
      shouldResumeRef.current = !audio.paused;

      pausedByVisibilityRef.current = true;

      // Pause tanpa reset posisi lagu.
      audio.pause();

      setIsPlaying(false);
    }

    // ---------------------------------------
    // KETIKA PENGGUNA KEMBALI KE TAB
    // ---------------------------------------

    function resumeWhenVisible() {
      const audio = audioRef.current;

      if (!audio) return;

      // Tab sudah aktif kembali.
      pausedByVisibilityRef.current = false;

      // Jangan otomatis play kalau sebelumnya
      // pengguna sudah pause secara manual.
      if (!shouldResumeRef.current) return;

      // Pastikan tab benar-benar terlihat.
      if (document.visibilityState !== "visible") {
        return;
      }

      // Reset penanda resume agar tidak
      // melakukan play berulang.
      shouldResumeRef.current = false;

      try {
        const playPromise = audio.play();

        if (playPromise?.catch) {
          playPromise.catch((error) => {
            console.warn(
              "Musik gagal dilanjutkan otomatis:",
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

    // ---------------------------------------
    // DETEKSI VISIBILITY TAB
    // ---------------------------------------

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        pauseWhenHidden();
      } else {
        resumeWhenVisible();
      }
    }

    // ---------------------------------------
    // HALAMAN KELUAR / MASUK DARI CACHE
    // ---------------------------------------

    function handlePageHide() {
      pauseWhenHidden();
    }

    function handlePageShow() {
      if (document.visibilityState === "visible") {
        resumeWhenVisible();
      }
    }

    // =====================================
    // REGISTER EVENT LISTENERS
    // =====================================

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

    // =====================================
    // CLEANUP
    // =====================================

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
            "Musik tidak dapat diputar:",
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
  // PLAY / PAUSE BUTTON
  // =========================================

  function toggleMusic() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      // Pengguna menekan Play.
      shouldResumeRef.current = false;

      startMusic();
    } else {
      // Pengguna menekan Pause.
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

    // Buat salinan visual Cover.
    const visualCover = originalCover.cloneNode(true);

    visualCover.setAttribute(
      "aria-hidden",
      "true"
    );

    visualCover.style.pointerEvents = "none";
    visualCover.style.zIndex = "10001";

    // Nonaktifkan tombol pada clone.
    const clonedButton =
      visualCover.querySelector("button");

    if (clonedButton) {
      clonedButton.disabled = true;
      clonedButton.tabIndex = -1;
    }

    // Pasang clone di luar root React.
    document.body.appendChild(visualCover);

    // Pastikan style awal diterapkan.
    void visualCover.offsetWidth;

    let fallbackTimer;

    // Hapus salinan setelah animasi.
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

    // Jalankan animasi yang ada di App.css.
    visualCover.classList.add(
      "invite-cover--opening"
    );

    // Timer hanya sebagai pengaman.
    fallbackTimer = window.setTimeout(
      cleanup,
      COVER_FALLBACK_MS
    );
  }

  // =========================================
  // OPEN INVITATION
  // =========================================

  function handleOpenInvitation() {
    if (isOpened || openingRef.current) return;

    openingRef.current = true;

    try {
      playCoverExitAnimation();
    } catch (error) {
      console.warn(
        "Animasi Cover gagal dijalankan:",
        error
      );
    }

    // Pastikan scroll tidak terkunci.
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    // Langsung tampilkan halaman utama.
    setIsOpened(true);

    // Mulai musik dari interaksi pengguna.
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
        // COVER
        // ===================================

        <Cover
          onOpen={handleOpenInvitation}
        />
      ) : (
        <>
          {/* GLOBAL FIXED BACKGROUND */}
          <div
            className="global-background"
            aria-hidden="true"
          />

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

              <Closing />
            </main>

            {/* FLOATING MUSIC CONTROL */}
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
