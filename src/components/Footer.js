import React from "react";
import Link from "next/link";

function SocialIcon({ href, label, children }) {
  const isDisabled = !href;

  return (
    <a
      href={href || "#"}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      aria-disabled={isDisabled ? "true" : "false"}
      title={label}
      className={[
        "baby-social-icon",
        isDisabled ? "baby-social-icon-disabled" : ""
      ].join(" ")}
      onClick={(event) => {
        if (isDisabled) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </a>
  );
}

function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M7.6 2h8.8A5.6 5.6 0 0 1 22 7.6v8.8A5.6 5.6 0 0 1 16.4 22H7.6A5.6 5.6 0 0 1 2 16.4V7.6A5.6 5.6 0 0 1 7.6 2Zm0 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm4.4 3.8a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4Zm0 2a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Zm5.15-2.45a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z"
      />
    </svg>
  );
}

function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M13.5 22v-8.2h2.75l.45-3.2H13.5V8.6c0-.93.26-1.56 1.6-1.56h1.7V4.18c-.82-.12-1.8-.2-2.77-.2-2.74 0-4.61 1.67-4.61 4.74v1.88H6.7v3.2h2.72V22h4.08Z"
      />
    </svg>
  );
}

function IconTikTok(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M14.7 2c.2 1.77 1.33 3.58 3.3 3.94v2.8c-1.56.06-2.9-.46-4-1.26v6.37c0 3.06-2.46 5.55-5.5 5.55S3 16.9 3 13.84s2.46-5.55 5.5-5.55c.3 0 .6.03.9.08v2.98c-.28-.1-.58-.16-.9-.16-1.49 0-2.7 1.22-2.7 2.72s1.2 2.72 2.7 2.72 2.7-1.22 2.7-2.72V2h2.8Z"
      />
    </svg>
  );
}

// Pie de pagina publico sin accesos de administracion.
export default function Footer({ categories, brand, whatsappPhone }) {
  const [firstWord, secondWord, ...restWords] = (brand?.name || "Baby Duvaby").split(" ");
  const restLabel = restWords.join(" ");

  // TODO: reemplazar con URLs reales cuando las tengas.
  const socialLinks = brand?.socials || {
    facebook: "",
    instagram: "",
    tiktok: ""
  };

  const socials = [
    { key: "facebook", label: "Facebook", href: socialLinks.facebook, icon: <IconFacebook /> },
    { key: "tiktok", label: "TikTok", href: socialLinks.tiktok, icon: <IconTikTok /> },
    { key: "instagram", label: "Instagram", href: socialLinks.instagram, icon: <IconInstagram /> }
  ];

  return (
    <footer className="mx-auto mt-4 w-full max-w-6xl px-4 pb-28 sm:px-6 sm:pb-10">
      <div className="glass-panel baby-section-glow rounded-3xl p-6 shadow-candy">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <p className="font-title text-4xl leading-none">
              <span className="text-[#f27ea6]">{firstWord || ""}</span>{" "}
              <span className="text-[#6bb2ec]">{secondWord || ""}</span>{" "}
              <span className="text-[#f27ea6]">{restLabel}</span>
            </p>
            <p className="mt-2 text-sm font-semibold text-ink/85">
              {brand?.subtitle ||
                "Disenado para mamas y papas que buscan ternura, calidad y estilo."}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6c84a3]">
              Categorias
            </h3>
            <div className="mt-2 flex flex-col gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categoria/${category.id}`}
                  className="text-sm font-bold text-ink/90 transition hover:text-[#f27ea6]"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6c84a3]">
              Contacto
            </h3>
            <p className="mt-3 text-sm font-semibold text-ink/85">
              WhatsApp: <span className="font-extrabold">{whatsappPhone}</span>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-bold text-[#7d8ca3]">
          &copy; {new Date().getFullYear()} Baby Duvaby. Todos los derechos reservados.
        </p>

        <div className="mt-4 flex items-center justify-center gap-3">
          {socials.map((item) => (
            <SocialIcon key={item.key} href={item.href} label={item.label}>
              {item.icon}
            </SocialIcon>
          ))}
        </div>
      </div>
    </footer>
  );
}
