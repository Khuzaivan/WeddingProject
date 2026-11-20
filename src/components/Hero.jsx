import { wedding } from "../data/wedding";
import "./Hero.css";

function Hero() {
  const brideInitial =
    wedding.bride?.fullName?.trim()?.charAt(0)?.toUpperCase() || "P";

  const groomInitial =
    wedding.groom?.fullName?.trim()?.charAt(0)?.toUpperCase() || "A";

  return (
    <section className="wedding-hero">
      <div className="wedding-hero__overlay" />

      <div className="wedding-hero__content">
        <p className="wedding-hero__label">THE WEDDING OF</p>

        {/* INISIAL SAJA */}
        <h1 className="wedding-hero__initials">
          <span>{brideInitial}</span>
          <span>{groomInitial}</span>
        </h1>

        <p className="wedding-hero__date">26 Desember 2026</p>

        <p className="wedding-hero__tagline">
          you're invited to our wedding ceremony
        </p>
      </div>

      <p className="wedding-hero__footer">WITH LOVE AND BLESSINGS</p>
    </section>
  );
}

export default Hero;
