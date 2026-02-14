import React from "react";
import { defaultLandingConfig } from "../data/defaultContent";

function clampRating(value) {
  return Math.max(1, Math.min(5, Number(value) || 5));
}

function normalizeTestimonials(items) {
  const source = Array.isArray(items) ? items : [];
  const parsed = source
    .filter(Boolean)
    .map((item, index) => ({
      id: String(item.id || `t-live-${index + 1}`),
      name: String(item.name || `Cliente ${index + 1}`),
      quote: String(item.quote || ""),
      location: String(item.location || "Peru"),
      rating: clampRating(item.rating),
      avatar: String(item.avatar || "")
    }));

  const defaults = (defaultLandingConfig.testimonials || []).map((item, index) => ({
    id: String(item.id || `t-default-${index + 1}`),
    name: String(item.name || `Cliente ${index + 1}`),
    quote: String(item.quote || ""),
    location: String(item.location || "Peru"),
    rating: clampRating(item.rating),
    avatar: String(item.avatar || "")
  }));

  const merged = [
    ...parsed,
    ...defaults.filter(
      (defaultItem) => !parsed.some((item) => String(item.id) === String(defaultItem.id))
    )
  ];

  return merged.slice(0, 10);
}

function Stars({ rating }) {
  const stars = Array.from({ length: 5 });

  return (
    <p className="mt-1 inline-flex items-center gap-0.5" aria-label={`${rating} estrellas`}>
      {stars.map((_, index) => {
        const active = index < rating;
        return (
          <svg
            key={`star-${index}`}
            viewBox="0 0 24 24"
            className={`h-4 w-4 ${active ? "text-[#f4a11a]" : "text-[#ced8ea]"}`}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.6 6.1 20.5l1.2-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
          </svg>
        );
      })}
    </p>
  );
}

function ChevronIcon({ direction = "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

export default function Testimonials({ items }) {
  const testimonials = React.useMemo(() => normalizeTestimonials(items), [items]);
  const railRef = React.useRef(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const scrollToIndex = React.useCallback((index) => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const firstSlide = rail.querySelector("[data-slide='1']");
    const slideWidth = firstSlide ? firstSlide.getBoundingClientRect().width : rail.clientWidth;
    const styles = window.getComputedStyle(rail);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const step = slideWidth + gap;
    rail.scrollTo({
      left: Math.max(0, index * step),
      behavior: "smooth"
    });
  }, []);

  React.useEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const handleScroll = () => {
      const firstSlide = rail.querySelector("[data-slide='1']");
      const slideWidth = firstSlide ? firstSlide.getBoundingClientRect().width : rail.clientWidth;
      const styles = window.getComputedStyle(rail);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const step = Math.max(1, slideWidth + gap);
      const nextIndex = Math.round(rail.scrollLeft / step);
      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    };

    rail.addEventListener("scroll", handleScroll, { passive: true });
    return () => rail.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (isPaused || testimonials.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % testimonials.length;
      setActiveIndex(nextIndex);
      scrollToIndex(nextIndex);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [activeIndex, isPaused, scrollToIndex, testimonials.length]);

  if (!testimonials.length) {
    return null;
  }

  return (
    <section
      className="mx-auto max-w-6xl px-4 pb-12 sm:px-6"
      aria-label="Testimonios de clientes"
    >
      <div className="mb-5 text-center">
        <p className="baby-kicker text-xs font-extrabold uppercase tracking-[0.24em]">
          Confianza real
        </p>
        <h2 className="section-heading mt-2">Lo que dicen nuestras mamas</h2>
      </div>

      <div className="relative">
        <div
          ref={railRef}
          className="testimonial-rail flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {testimonials.map((item) => (
            <article
              key={item.id}
              data-slide="1"
              className="testimonial-card-glow snap-start flex min-h-[15.5rem] w-[86%] shrink-0 flex-col rounded-3xl p-5 sm:w-[48%] lg:w-[32%]"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar || "https://randomuser.me/api/portraits/women/42.jpg"}
                  alt={`Foto de ${item.name}`}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[#ffd6ea]"
                />
                <div>
                  <p className="text-sm font-extrabold text-[#5f789b]">{item.name}</p>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8797b2]">
                    {item.location}
                  </p>
                  <Stars rating={item.rating} />
                </div>
              </div>

              <p className="mt-4 text-base font-bold text-ink/90">"{item.quote}"</p>
            </article>
          ))}
        </div>

        {testimonials.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Testimonio anterior"
              onClick={() => {
                const nextIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
                setActiveIndex(nextIndex);
                scrollToIndex(nextIndex);
              }}
              className="baby-button-glow absolute left-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 font-black text-[#5a7cab] sm:inline-flex"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              aria-label="Testimonio siguiente"
              onClick={() => {
                const nextIndex = (activeIndex + 1) % testimonials.length;
                setActiveIndex(nextIndex);
                scrollToIndex(nextIndex);
              }}
              className="baby-button-glow absolute right-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 font-black text-[#5a7cab] sm:inline-flex"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        ) : null}
      </div>

      {testimonials.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2" aria-label="Indicadores de testimonios">
          {testimonials.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ir al testimonio ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => {
                setActiveIndex(index);
                scrollToIndex(index);
              }}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-7 bg-gradient-to-r from-[#f6a4cf] to-[#9dc8ff]"
                  : "w-2.5 bg-[#cad7ec]"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
