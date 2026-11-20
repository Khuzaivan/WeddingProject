
import { useEffect, useState } from "react";
import "./BackgroundSlideshow.css";

// =========================================
// BACKGROUND PHOTOS
// =========================================

// Foto pertama tetap foto background lama.
// Urutan foto bisa kamu ganti kapan saja.
const BACKGROUND_IMAGES = [
  "/images/gallery-4.jpeg",
  "/images/gallery-2.jpeg",
  "/images/gallery-5.jpeg",
];

// Waktu setiap foto ditampilkan
const SLIDE_INTERVAL = 5000;

function BackgroundSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(
    () => document.visibilityState === "visible"
  );

  // =========================================
  // PRELOAD PHOTOS
  // =========================================

  useEffect(() => {
    const preloadedImages = BACKGROUND_IMAGES.map(
      (src) => {
        const image = new Image();
        image.src = src;
        return image;
      }
    );

    return () => {
      preloadedImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, []);

  // =========================================
  // MONITOR TAB VISIBILITY
  // =========================================

  useEffect(() => {
    function handleVisibilityChange() {
      setIsVisible(
        document.visibilityState === "visible"
      );
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // =========================================
  // AUTO CHANGE BACKGROUND
  // =========================================

  useEffect(() => {
    if (!isVisible) return;
    if (BACKGROUND_IMAGES.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((previousIndex) => {
        return (
          (previousIndex + 1) %
          BACKGROUND_IMAGES.length
        );
      });
    }, SLIDE_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [isVisible]);

  // =========================================
  // RENDER
  // =========================================

  return (
    <div
      className="global-background"
      aria-hidden="true"
    >
      {BACKGROUND_IMAGES.map((image, index) => (
        <div
          key={image}
          className={`background-slide ${
            activeIndex === index
              ? "background-slide--active"
              : ""
          }`}
          style={{
            backgroundImage: `url("${image}")`,
          }}
        />
      ))}

      {/* Overlay untuk menjaga keterbacaan teks */}
      <div className="background-slideshow-overlay" />
    </div>
  );
}

export default BackgroundSlideshow;
