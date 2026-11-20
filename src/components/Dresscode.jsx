
import "./Dresscode.css";

const colors = [
  { name: "Ivory", code: "#F4F0E8" },
  { name: "Sage", code: "#A2A58C" },
  { name: "Taupe", code: "#B8B2A5" },
  { name: "Charcoal", code: "#383632" },
];

function Dresscode() {
  return (
    <section className="dresscode-section">
      <div className="dresscode-heading">
        <p>OUR WEDDING PALETTE</p>
        <h2>Dresscode</h2>
        <span>
          Your presence is our greatest gift.
        </span>
      </div>

      <p className="dresscode-description">
        We would love for you to celebrate with us
        wearing these beautiful colors.
      </p>

      <div className="dresscode-colors">
        {colors.map((color) => (
          <div className="dresscode-color" key={color.name}>
            <div
              className="dresscode-swatch"
              style={{ backgroundColor: color.code }}
            />
            <p>{color.name}</p>
          </div>
        ))}
      </div>

      <p className="dresscode-note">
        * Sample palette for the wedding demo.
      </p>
    </section>
  );
}

export default Dresscode;
