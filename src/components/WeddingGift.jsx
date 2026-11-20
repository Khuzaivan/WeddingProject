
import { useState } from "react";
import { Gift, Copy, Check } from "lucide-react";
import "./WeddingGift.css";

const demoGift = {
  bank: "BANK CONTOH",
  number: "DEMO-ONLY",
  holder: "Nama Pemilik Rekening (Demo)",
};

function WeddingGift() {
  const [copied, setCopied] = useState(false);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(demoGift.number);
      setCopied(true);
    } catch {
      setCopied(false);
      window.alert("Gagal menyalin. Coba lagi.");
    }
  }

  return (
    <section className="wedding-gift">
      <div className="gift-heading">
        <Gift size={30} strokeWidth={1.2} />

        <p>SHARING HAPPINESS</p>
        <h2>Wedding Gift</h2>

        <span>
          Your love and blessings mean the world to us.
        </span>
      </div>

      <p className="gift-description">
        For those who wish to send a wedding gift,
        we have provided the following information.
      </p>

      <div className="gift-card">
        <p className="gift-bank">{demoGift.bank}</p>

        <h3>{demoGift.number}</h3>

        <p>{demoGift.holder}</p>

        <button
          type="button"
          className="gift-copy-button"
          onClick={copyNumber}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy Number"}
        </button>
      </div>

      <p className="gift-note">
        Demo only — no real bank account is connected.
      </p>
    </section>
  );
}

export default WeddingGift;
