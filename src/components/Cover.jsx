
import { MailOpen } from "lucide-react";

function Cover({ onOpen }) {
  const params = new URLSearchParams(
    window.location.search
  );

  const guestName =
    params.get("to")?.trim().slice(0, 100) ||
    "Tamu Undangan";

  return (
    <section className="invite-cover">
      {/* FOTO COVER */}
      <div
        className="invite-cover__background"
        aria-hidden="true"
      />

      {/* GRADIENT */}
      <div
        className="invite-cover__overlay"
        aria-hidden="true"
      />

      <div className="invite-cover__content">

        {/* BAGIAN ATAS */}
        <div className="invite-cover__top">
          <p className="invite-cover__label">
            THE WEDDING OF
          </p>

          <h1 className="invite-cover__names">
            <span className="invite-cover__person-name">
              Pandji
            </span>

            <span className="invite-cover__ampersand">
              &amp;
            </span>

            <span className="invite-cover__person-name">
              Agung
            </span>
          </h1>
        </div>

        {/* BAGIAN BAWAH */}
        <div className="invite-cover__bottom">
          <div className="invite-cover__recipient">
            <p>Kepada Yth.</p>
            <h3>{guestName}</h3>
          </div>

          <button
            type="button"
            className="invite-cover__button"
            onClick={onOpen}
          >
            <MailOpen size={17} />
            Open Invitation
          </button>
        </div>

      </div>
    </section>
  );
}

export default Cover;
