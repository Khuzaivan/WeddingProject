
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./Gallery.css";

gsap.registerPlugin(ScrollTrigger);

// =========================================
// GALLERY PHOTOS
// =========================================

// Enam foto pertama mengikuti urutan
// yang ada di project terbaru lu.

const photos = [
  "/images/gallery-8.jpeg",
  "/images/gallery-2.jpeg",
  "/images/gallery-7.jpeg",
  "/images/gallery-4.jpeg",
  "/images/gallery-5.jpeg",
  "/images/gallery-6.jpeg",
  "/images/gallery-1.jpeg",
  "/images/gallery-3.jpeg",
  "/images/gallery-9.jpeg",
  "/images/hero.jpeg",
];

// Jika gallery-10.jpeg sudah ditambahkan,
// ganti "/images/hero.jpeg" menjadi:
// "/images/gallery-10.jpeg"

function Gallery() {
  const sectionRef = useRef(null);
  const closeButtonRef = useRef(null);
  const touchStartRef = useRef(null);

  const [selectedPhoto, setSelectedPhoto] =
    useState(null);

  const isOpen = selectedPhoto !== null;

  // =========================================
  // GSAP SCROLL ANIMATION
  // =========================================

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) return;

      const items = gsap.utils.toArray(
        ".gallery-photo",
        sectionRef.current
      );

      items.forEach((item) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  // =========================================
  // LIGHTBOX FUNCTIONS
  // =========================================

  function openPhoto(index) {
    setSelectedPhoto(index);
  }

  function closePhoto() {
    setSelectedPhoto(null);
  }

  function nextPhoto() {
    setSelectedPhoto((current) => {
      if (current === null) return null;

      return (current + 1) % photos.length;
    });
  }

  function previousPhoto() {
    setSelectedPhoto((current) => {
      if (current === null) return null;

      return (
        current - 1 + photos.length
      ) % photos.length;
    });
  }

  // =========================================
  // KEYBOARD & SCROLL LOCK
  // =========================================

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    const previousFocus =
      document.activeElement;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();

        setSelectedPhoto((current) =>
          current === null
            ? null
            : (current + 1) % photos.length
        );
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();

        setSelectedPhoto((current) =>
          current === null
            ? null
            : (
                current - 1 + photos.length
              ) % photos.length
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      previousFocus?.focus?.();
    };
  }, [isOpen]);

  // =========================================
  // TOUCH SWIPE - MOBILE
  // =========================================

  function handleTouchStart(event) {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  function handleTouchEnd(event) {
    const start = touchStartRef.current;

    touchStartRef.current = null;

    if (!start) return;

    const touch = event.changedTouches[0];

    if (!touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    // Minimal jarak swipe 45px.
    // Abaikan gerakan yang lebih vertikal.
    if (Math.abs(deltaX) < 45) return;

    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      nextPhoto();
    } else {
      previousPhoto();
    }
  }

  // =========================================
  // PRELOAD ADJACENT IMAGES
  // =========================================

  useEffect(() => {
    if (selectedPhoto === null) return;

    const nextIndex =
      (selectedPhoto + 1) % photos.length;

    const previousIndex =
      (
        selectedPhoto - 1 + photos.length
      ) % photos.length;

    [nextIndex, previousIndex].forEach(
      (index) => {
        const image = new Image();
        image.src = photos[index];
      }
    );
  }, [selectedPhoto]);

  // =========================================
  // RENDER
  // =========================================

  return (
    <section
      className="photo-gallery"
      ref={sectionRef}
      aria-labelledby="gallery-title"
    >
      {/* GALLERY HEADING */}

      <div className="gallery-heading">
        <p className="gallery-label">
          OUR PRECIOUS MOMENTS
        </p>

        <h2 id="gallery-title">
          Captured With Love
        </h2>

        <span className="gallery-subtitle">
          Some moments last forever.
        </span>
      </div>

      {/* GALLERY GRID */}

      <div className="wedding-gallery-grid">
        {photos.map((photo, index) => (
          <button
            key={`${photo}-${index}`}
            type="button"
            className={`gallery-photo gallery-photo--${
              index + 1
            }`}
            onClick={() => openPhoto(index)}
            aria-label={`Buka foto ${index + 1} dari ${
              photos.length
            }`}
          >
            <img
              src={photo}
              alt={`Foto prewedding ${
                index + 1
              }`}
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {/* FULLSCREEN GALLERY */}

      {isOpen &&
        createPortal(
          <div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Galeri foto pernikahan"
            onClick={(event) => {
              if (
                event.target === event.currentTarget
              ) {
                closePhoto();
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* CLOSE BUTTON */}

            <button
              ref={closeButtonRef}
              type="button"
              className="lightbox-close"
              onClick={closePhoto}
              aria-label="Tutup galeri"
            >
              <X size={23} strokeWidth={1.6} />
            </button>

            {/* PREVIOUS BUTTON */}

            <button
              type="button"
              className="lightbox-arrow lightbox-prev"
              onClick={previousPhoto}
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft
                size={25}
                strokeWidth={1.5}
              />
            </button>

            {/* ACTIVE PHOTO */}

            <div className="gallery-lightbox-stage">
              <img
                key={selectedPhoto}
                src={photos[selectedPhoto]}
                alt={`Foto prewedding ${
                  selectedPhoto + 1
                } dari ${photos.length}`}
                className="gallery-lightbox-image"
                draggable="false"
              />
            </div>

            {/* NEXT BUTTON */}

            <button
              type="button"
              className="lightbox-arrow lightbox-next"
              onClick={nextPhoto}
              aria-label="Foto berikutnya"
            >
              <ChevronRight
                size={25}
                strokeWidth={1.5}
              />
            </button>

            {/* COUNTER */}

            <div className="gallery-lightbox-footer">
              <p className="gallery-lightbox-counter">
                {String(
                  selectedPhoto + 1
                ).padStart(2, "0")}
                <span> / </span>
                {String(
                  photos.length
                ).padStart(2, "0")}
              </p>

              <p className="gallery-lightbox-hint">
                Swipe to explore
              </p>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

export default Gallery;
