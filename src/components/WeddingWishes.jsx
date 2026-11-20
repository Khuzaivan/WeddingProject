
import { useState } from "react";
import {
  Heart,
  Send,
  CheckCircle2,
  MessageCircleHeart,
} from "lucide-react";

import "./WeddingWishes.css";

const STORAGE_KEY = "wedding-demo-wishes";

function loadWishes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function WeddingWishes() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [message, setMessage] = useState("");

  const [wishes, setWishes] = useState(loadWishes);
  const [success, setSuccess] = useState(false);


function handleSubmit(event) {
  event.preventDefault();

  const cleanName = name.trim();
  const cleanMessage = message.trim();

  if (!cleanName || !attendance || !cleanMessage) {
    alert("Mohon lengkapi semua kolom terlebih dahulu.");
    return;
  }

  const newWish = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: cleanName,
    attendance: attendance,
    message: cleanMessage,
    date: new Date().toISOString(),
  };

  const updatedWishes = [newWish, ...wishes];

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedWishes)
    );

    setWishes(updatedWishes);

    setName("");
    setAttendance("");
    setMessage("");
    setSuccess(true);

    alert("Ucapan berhasil dikirim! ❤️");
  } catch (error) {
    console.error("Gagal menyimpan ucapan:", error);

    alert(
      "Gagal menyimpan ucapan. Periksa pengaturan browser."
    );
  }
}


  const formatDate = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(new Date(date));
  };

  return (
    <section className="wishes-section" id="wishes">
      {/* HEADER */}
      <div className="wishes-heading">
        <Heart size={30} strokeWidth={1.2} />

        <p>LEAVE YOUR BLESSINGS</p>

        <h2>Wedding Wishes</h2>

        <span>
          Your kind words mean the world to us.
        </span>
      </div>

      {/* FORM RSVP */}
      <div className="wishes-form-container">
        <div className="wishes-form-heading">
          <h3>RSVP & Wishes</h3>

          <p>
            Kindly confirm your attendance
            and leave your wishes below.
          </p>
        </div>

        <form
          className="wishes-form"
          onSubmit={handleSubmit}
        >
          {/* NAMA */}
          <div className="wishes-form-group">
            <label htmlFor="guest-name">
              Your Name
            </label>

            <input
              id="guest-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSuccess(false);
              }}
              maxLength={80}
              required
            />
          </div>

          {/* KEHADIRAN */}
          <div className="wishes-form-group">
            <label htmlFor="guest-attendance">
              Attendance Confirmation
            </label>

            <select
              id="guest-attendance"
              value={attendance}
              onChange={(e) => {
                setAttendance(e.target.value);
                setSuccess(false);
              }}
              required
            >
              <option value="">
                Select your attendance
              </option>

              <option value="Hadir">
                Will Attend
              </option>

              <option value="Tidak Hadir">
                Unable to Attend
              </option>
            </select>
          </div>

          {/* UCAPAN */}
          <div className="wishes-form-group">
            <label htmlFor="guest-message">
              Your Wishes
            </label>

            <textarea
              id="guest-message"
              placeholder="Write your wishes here..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setSuccess(false);
              }}
              rows={5}
              maxLength={500}
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="wishes-submit-button"
          >
            <Send size={17} />
            Send Wishes
          </button>

          {success && (
            <p
              className="wishes-success"
              role="status"
            >
              <CheckCircle2 size={18} />
              Thank you for your wishes!
            </p>
          )}
        </form>
      </div>

      {/* DAFTAR UCAPAN */}
      <div className="wishes-list-container">
        <div className="wishes-list-heading">
          <MessageCircleHeart size={24} />

          <h3>Messages of Love</h3>

          <p>{wishes.length} Wishes</p>
        </div>

        <div className="wishes-list">
          {wishes.length === 0 ? (
            <div className="wishes-empty">
              <Heart size={25} />

              <p>
                Be the first to leave a wish
                for the happy couple.
              </p>
            </div>
          ) : (
            wishes.map((wish) => (
              <article
                className="wishes-card"
                key={wish.id}
              >
                <div className="wishes-card-header">
                  <h4>{wish.name}</h4>

                  <span
                    className={
                      wish.attendance === "Hadir"
                        ? "attendance-badge attending"
                        : "attendance-badge not-attending"
                    }
                  >
                    {wish.attendance}
                  </span>
                </div>

                <p>{wish.message}</p>

                <small>{formatDate(wish.date)}</small>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default WeddingWishes;
