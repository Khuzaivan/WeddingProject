
import { MapPin, CalendarDays } from "lucide-react";
import { wedding } from "../data/wedding";
import "./WeddingEvents.css";

function WeddingEvents() {
  return (
    <section className="wedding-events">
      <div className="events-heading">
        <p>THE CELEBRATION</p>
        <h2>Wedding Events</h2>
        <span>
          We joyfully invite you to celebrate with us.
        </span>
      </div>

      <div className="wedding-event-grid">
        {wedding.events.map((event) => (
          <article
            className="wedding-event-card"
            key={event.title}
          >
            <CalendarDays size={27} strokeWidth={1.2} />

            <h3>{event.title}</h3>

            <p className="event-date">
              {wedding.displayDate}
            </p>

            <p>{event.time}</p>

            <div className="event-divider" />

            <h4>{event.venue}</h4>

            <p>{event.address}</p>

            <a
              className="event-map-button"
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin size={16} />
              Google Maps
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WeddingEvents;
