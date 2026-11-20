
import { Heart } from "lucide-react";
import "./LoveStory.css";

function LoveStory() {
  return (
    <section
      className="love-story"
      aria-labelledby="love-story-title"
    >
      <div className="love-story-content">

        {/* ORNAMEN DUA CINCIN */}
        <div
          className="love-story-ornament"
          aria-hidden="true"
        >
          <Heart
            className="love-story-heart"
            size={24}
            strokeWidth={1.5}
          />

          <div className="love-story-rings">
            <span className="love-story-ring ring-left" />
            <span className="love-story-ring ring-right" />
          </div>
        </div>

        {/* JUDUL */}
        <h2
          className="love-story-title"
          id="love-story-title"
        >
          QS Ar-Rum 21
        </h2>

        {/* KUTIPAN AYAT */}
        <p className="love-story-verse">
          “Dan di antara tanda-tanda (kebesaran)-Nya
          ialah Dia menciptakan pasangan-pasangan
          untukmu dari jenismu sendiri, agar kamu
          cenderung dan merasa tenteram kepadanya,
          dan Dia menjadikan di antaramu rasa kasih
          dan sayang.”
        </p>

      </div>
    </section>
  );
}

export default LoveStory;
