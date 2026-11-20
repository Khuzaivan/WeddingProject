import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { wedding } from "../data/wedding";
import "./Couple.css";

gsap.registerPlugin(ScrollTrigger);

function Couple() {
  const sectionRef = useRef(null);

  const coupleData = [
    {
      role: "THE BRIDE",
      type: "bride",
      ...wedding.bride,
    },
    {
      role: "THE GROOM",
      type: "groom",
      ...wedding.groom,
    },
  ];

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) return;

      const persons = gsap.utils.toArray(".couple-person");

      persons.forEach((person) => {
        const isGroom = person.dataset.type === "groom";

        const photo = person.querySelector(
          ".couple-photo-wrap img"
        );

        const role = person.querySelector(".couple-role");
        const name = person.querySelector(".couple-info h3");
        const divider = person.querySelector(".couple-divider");
        const parents = person.querySelector(".couple-parents");

        // PHOTO ANIMATION
        gsap.fromTo(
          photo,
          {
            scale: isGroom ? 1 : 1.3,
          },
          {
            scale: isGroom ? 1.3 : 1,
            ease: "none",
            scrollTrigger: {
              trigger: person,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          }
        );

        // TEXT ANIMATION
        const direction = isGroom ? -75 : 75;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: person,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        });

        timeline.fromTo(
          role,
          {
            opacity: 0,
            x: direction,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
          }
        );

        timeline.fromTo(
          name,
          {
            opacity: 0,
            x: direction,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.35"
        );

        timeline.fromTo(
          divider,
          {
            scaleX: 0,
            transformOrigin: isGroom
              ? "left center"
              : "right center",
          },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.65"
        );

        timeline.fromTo(
          parents,
          {
            opacity: 0,
            x: direction,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.45"
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section className="couple-section" ref={sectionRef}>
      {/* HEADING BARU */}
      <div className="couple-heading">
        <div className="couple-bismillah">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>

        <h2 className="couple-greeting">
          Assalamu’alaikum Wr. Wb.
        </h2>

        <p className="couple-opening-text">
          Tanpa mengurangi rasa hormat, perkenankan kami
          mengundang Bapak/Ibu/Saudara/i, serta kerabat
          sekalian, untuk menghadiri acara pernikahan kami:
        </p>
      </div>

      <div className="couple-container">
        {coupleData.map((person) => (
          <article
            className="couple-person"
            data-type={person.type}
            key={person.type}
          >
            {/* FULL SCREEN PHOTO */}
            <div className="couple-photo-wrap">
              <img
                src={person.photo}
                alt={person.fullName}
                loading="lazy"
              />
            </div>

            {/* TEXT OVER PHOTO */}
            <div className="couple-info">
              <p className="couple-role">
                {person.role}
              </p>

              <h3>{person.fullName}</h3>

              <div className="couple-divider" />

              <p className="couple-parents">
                {person.parents}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Couple;