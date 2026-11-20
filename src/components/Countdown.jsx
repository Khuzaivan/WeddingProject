
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

import { wedding } from "../data/wedding";
import "./Countdown.css";

// =========================================
// COUNTDOWN CALCULATION
// =========================================

function calculateTimeLeft() {
  const target = new Date(wedding.date).getTime();
  const difference = Math.max(0, target - Date.now());

  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

// =========================================
// WEDDING DATE WITH DAY NAME
// =========================================

function getWeddingDisplayDate() {
  const datePart = wedding.date.slice(0, 10);

  const [year, month, day] = datePart
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  const dayName = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    timeZone: "UTC",
  }).format(date);

  return `${dayName.charAt(0).toUpperCase()}${dayName.slice(1)}, ${wedding.displayDate}`;
}

// =========================================
// GOOGLE CALENDAR DATES
// =========================================

function getCalendarDates() {
  const [year, month, day] = wedding.date
    .slice(0, 10)
    .split("-")
    .map(Number);

  const startDate = [
    year,
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("");

  const nextDay = new Date(
    Date.UTC(year, month - 1, day + 1)
  );

  const endDate = [
    nextDay.getUTCFullYear(),
    String(nextDay.getUTCMonth() + 1).padStart(2, "0"),
    String(nextDay.getUTCDate()).padStart(2, "0"),
  ].join("");

  return { startDate, endDate };
}

// =========================================
// GOOGLE CALENDAR URL
// =========================================

function getGoogleCalendarUrl() {
  const { startDate, endDate } =
    getCalendarDates();

  const coupleName =
    `${wedding.bride.name} & ${wedding.groom.name}`;

  const venue =
    wedding.events?.[0]?.venue || "";

  const address =
    wedding.events?.[0]?.address || "";

  const location = [venue, address]
    .filter(Boolean)
    .join(", ");

  const description = [
    `The Wedding of ${coupleName}`,
    "",
    `Tanggal: ${getWeddingDisplayDate()}`,
    "",
    "Rangkaian acara:",
    ...(wedding.events || []).map(
      (event) =>
        `${event.title}: ${event.time}`
    ),
    "",
    "Kami mengundang Anda untuk hadir",
    "dan memberikan doa restu",
    "di hari bahagia kami.",
  ].join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `The Wedding of ${coupleName}`,
    dates: `${startDate}/${endDate}`,
    details: description,
    location,
  });

  return (
    "https://calendar.google.com/calendar/render?" +
    params.toString()
  );
}

// =========================================
// COUNTDOWN COMPONENT
// =========================================

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const countdownItems = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <section
      className="wedding-countdown"
      aria-labelledby="save-date-title"
    >
      <div className="save-date__container">

        {/* SECTION LABEL */}
        <p className="save-date__label">
          SAVE THE DATE
        </p>

        {/* WEDDING DATE */}
        <h2
          id="save-date-title"
          className="save-date__title"
        >
          {getWeddingDisplayDate()}
        </h2>

        {/* DESCRIPTION */}
        <p className="save-date__description">
          Counting down to our special day.
        </p>

        {/* COUNTDOWN TIMER */}
        <div
          className="save-date__timer"
          aria-label="Hitung mundur menuju hari pernikahan"
        >
          {countdownItems.map((item) => (
            <div
              className="save-date__unit"
              key={item.label}
            >
              <span className="save-date__number">
                {String(item.value).padStart(
                  2,
                  "0"
                )}
              </span>

              <span className="save-date__unit-label">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* SAVE CALENDAR BUTTON */}
        <div className="save-date__action">
          <a
            className="save-date__button"
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Simpan tanggal pernikahan ke Google Calendar"
          >
            <CalendarDays
              size={17}
              strokeWidth={1.6}
              aria-hidden="true"
            />

            <span>Save Our Date</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default Countdown;
