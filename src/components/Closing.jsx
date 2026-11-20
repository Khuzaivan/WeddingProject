import { Heart } from "lucide-react";
import "./Closing.css";

function Closing() {
  return (
    <footer className="wedding-closing">
      <div className="closing-content">
        <p className="closing-label">
          WITH LOVE & GRATITUDE
        </p>

        <h2>Thank You</h2>

        <p className="closing-message">
          It would be our greatest joy to have you
          celebrate this beautiful beginning with us.
        </p>

        <div className="closing-line" />

        <h3>Pandji & Agung</h3>

        <p className="closing-date">
          26 Desember 2026
        </p>

        <Heart size={20} strokeWidth={1.2} />
      </div>
    </footer>
  );
}

export default Closing;
