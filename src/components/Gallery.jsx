
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./Gallery.css";

gsap.registerPlugin(ScrollTrigger);

// =========================================
// GALLERY PHOTOS
// =========================================

const photos = [
  "/images/gallery-8.jpeg",
  "/images/gallery-2.jpeg",
  "/images/gallery-7.jpeg",
  "/images/gallery-4.jpeg",
  "/images/gallery-5.jpeg",
  "/images/gallery-6.jpeg",
];

function Gallery() {
  const sectionRef = useRef(null);
  const closeButtonRef = useRef(null);

  const [selectedPhoto, setSelectedPhoto] =
    useState(null);

  // =========================================
  // SCROLL REVEAL ANIMATION
  // =========================================

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) return;

      const galleryItems =
        gsap.utils.toArray(".gallery-photo");

      galleryItems.forEach((item) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
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
  // LIGHTBOX CONTROLS
  // =========================================

  useEffect(() => {
    if (selectedPhoto === null) return;

    const previousOverflow =
      document.body.style.overflow;

    const previouslyFocused =
      document.activeElement;

    // Cegah halaman belakang ikut scroll
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    // Tekan Escape untuk menutup foto
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
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

      previouslyFocused?.focus?.();
    };
  }, [selectedPhoto]);

  function openPhoto(index) {
    setSelectedPhoto(index);
  }

  function closePhoto() {
    setSelectedPhoto(null);
  }

  return (
    <section
      className="photo-gallery"
      ref={sectionRef}
      aria-labelledby="gallery-title"
    >
      {/* ===================================
          GALLERY HEADING
          =================================== */}

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

      {/* ===================================
          PHOTO GRID
          =================================== */}

      <div className="wedding-gallery-grid">
        {photos.map((photo, index) => (
          <button
            type="button"
            className={`gallery-photo gallery-photo--${
              index + 1
            }`}
            key={photo}
            onClick={() => openPhoto(index)}
            aria-label={`Perbesar foto galeri ${
              index + 1
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

      {/* ===================================
          FULLSCREEN LIGHTBOX
          =================================== */}

      {selectedPhoto !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto galeri ${
            selectedPhoto + 1
          }`}
          onClick={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closePhoto();
            }
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="lightbox-close"
            aria-label="Tutup foto"
            onClick={closePhoto}
          >
            <X size={26} />
          </button>

          <img
            src={photos[selectedPhoto]}
            alt={`Foto prewedding ${
              selectedPhoto + 1
            } diperbesar`}
            className="gallery-lightbox-image"
          />

          <p className="gallery-lightbox-counter">
            {selectedPhoto + 1} / {photos.length}
          </p>
        </div>
      )}
    </section>
  );
}

export default Gallery;
