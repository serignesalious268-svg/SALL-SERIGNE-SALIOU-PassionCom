/* =========================================================
   PASSION.COM — main.js
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. THEME (dark / light) ---------- */
  const root = document.documentElement;
  const THEME_KEY = "passioncom-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-pressed", theme === "light");
    });
  }

  const savedTheme =
    localStorage.getItem(THEME_KEY) ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark");
  applyTheme(savedTheme);

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".theme-toggle");
    if (!btn) return;
    const current = root.getAttribute("data-theme");
    applyTheme(current === "light" ? "dark" : "light");
  });

  /* ---------- 2. NAV MOBILE + lien actif ---------- */
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".nav-toggle");
    if (toggle) {
      document.querySelector(".nav-links")?.classList.toggle("open");
      return;
    }
    if (e.target.closest(".nav-links a")) {
      document.querySelector(".nav-links")?.classList.remove("open");
    }
  });

  const currentPage = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------- 3. HORAIRES D'OUVERTURE + STATUT + COMPTE À REBOURS ----------
     Lundi-Vendredi : 08:30 - 18:30
     Samedi          : 09:00 - 14:00
     Dimanche        : Fermé
  --------------------------------------------------------- */
  const SCHEDULE = {
    1: { open: "08:30", close: "18:30", label: "Lundi" },
    2: { open: "08:30", close: "18:30", label: "Mardi" },
    3: { open: "08:30", close: "18:30", label: "Mercredi" },
    4: { open: "08:30", close: "18:30", label: "Jeudi" },
    5: { open: "08:30", close: "18:30", label: "Vendredi" },
    6: { open: "09:00", close: "14:00", label: "Samedi" },
    0: { open: null, close: null, label: "Dimanche" },
  };

  function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  function getStatus(now) {
    const day = now.getDay();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = SCHEDULE[day];

    if (today.open) {
      const openMin = toMinutes(today.open);
      const closeMin = toMinutes(today.close);
      if (nowMin >= openMin && nowMin < closeMin) {
        const closeDate = new Date(now);
        closeDate.setHours(...today.close.split(":").map(Number), 0, 0);
        return { open: true, target: closeDate, label: `Ferme à ${today.close}` };
      }
    }

    // Trouver la prochaine ouverture
    for (let i = 0; i <= 7; i++) {
      const d = (day + i) % 7;
      const sched = SCHEDULE[d];
      if (sched.open) {
        const target = new Date(now);
        target.setDate(now.getDate() + i);
        target.setHours(...sched.open.split(":").map(Number), 0, 0);
        if (target > now) {
          return { open: false, target, label: `Ouvre ${sched.label.toLowerCase()} à ${sched.open}` };
        }
      }
    }
    return { open: false, target: null, label: "Fermé" };
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  function renderStatus() {
    const dot = document.querySelector("[data-status-dot]");
    const text = document.querySelector("[data-status-text]");
    const sub = document.querySelector("[data-status-sub]");
    const cd = document.querySelector("[data-countdown]");
    if (!dot && !cd) return;

    const now = new Date();
    const status = getStatus(now);

    if (dot) {
      dot.classList.toggle("open", status.open);
      dot.classList.toggle("closed", !status.open);
    }
    if (text) text.textContent = status.open ? "Nous sommes ouverts" : "Actuellement fermé";
    if (sub) sub.textContent = status.label;

    if (cd && status.target) {
      const diff = Math.max(0, status.target - now);
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      const set = (sel, val) => { const el = cd.querySelector(sel); if (el) el.textContent = pad(val); };
      set("[data-d]", days);
      set("[data-h]", hours);
      set("[data-m]", mins);
      set("[data-s]", secs);
    }

    // Mettre en avant le jour courant dans la liste d'horaires
    document.querySelectorAll("[data-hours-list] li").forEach((li) => {
      const d = Number(li.dataset.day);
      li.classList.toggle("today", d === now.getDay());
    });
  }

  renderStatus();
  setInterval(renderStatus, 1000);

  /* ---------- 4. FILTRAGE DYNAMIQUE (services / personnel) ---------- */
  document.querySelectorAll("[data-filter-bar]").forEach((bar) => {
    const targetSelector = bar.dataset.filterBar;
    const items = document.querySelectorAll(targetSelector);

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      bar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.category;

      items.forEach((item) => {
        const cats = (item.dataset.category || "").split(" ");
        const show = cat === "tous" || cats.includes(cat);
        item.classList.toggle("hidden", !show);
      });
    });
  });

  /* ---------- 5. FORMULAIRE DE CONTACT (mailto direct) ---------- */
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const statusBox = document.querySelector("#form-status");

    const nom = document.querySelector("#nom")?.value || "";
    const email = document.querySelector("#email")?.value || "";
    const telephone = document.querySelector("#telephone")?.value || "";
    const sujet = document.querySelector("#sujet")?.value || "Message depuis le site";
    const message = document.querySelector("#message")?.value || "";

    const body =
      `Nom : ${nom}\n` +
      `Email : ${email}\n` +
      `Téléphone : ${telephone}\n\n` +
      `Message :\n${message}`;

    const mailtoLink =
      `mailto:serignesalious268@gmail.com` +
      `?subject=${encodeURIComponent("Nouveau message — Passion.com : " + sujet)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    if (statusBox) {
      statusBox.classList.remove("err");
      statusBox.classList.add("show", "ok");
      statusBox.textContent = "Votre application email s'ouvre avec le message prêt à envoyer — il ne reste qu'à cliquer sur Envoyer depuis votre boîte mail.";
    }
  });
}

  /* ---------- 6. RÉVÉLATION AU DÉFILEMENT ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- 7. ANNÉE COURANTE DANS LE FOOTER ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();

/* ---------- 8. BARRE DE PROGRESSION DE DÉFILEMENT ---------- */
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);
function updateScrollProgress() {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = (isNaN(scrolled) ? 0 : scrolled) + "%";
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

/* ---------- 9. BOUTON WHATSAPP FLOTTANT ---------- */
const waFloat = document.createElement("a");
waFloat.href = "https://wa.me/221778096114";
waFloat.target = "_blank";
waFloat.rel = "noopener";
waFloat.className = "whatsapp-float";
waFloat.setAttribute("aria-label", "Contacter Passion.com sur WhatsApp");
waFloat.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.5 8.5 0 01-12.4 7.6L3 20l1-5.3A8.5 8.5 0 1121 11.5z"/><path d="M8.5 9.5c0 3.5 2.5 6 6 6"/></svg>`;
document.body.appendChild(waFloat);

/* ---------- 10. PARALLAX DU HERO (mouvement souris) ---------- */
const heroVisual = document.querySelector(".hero-visual");
if (heroVisual && window.matchMedia("(hover: hover)").matches) {
  const shape = heroVisual.querySelector(".p-shape");
  const ring = heroVisual.querySelector(".ring");
  heroVisual.addEventListener("mousemove", (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    if (shape) shape.style.transform = `translate(${x * 14}px, ${y * 14}px) rotate(${x * 4}deg)`;
    if (ring) ring.style.transform = `translate(${x * -8}px, ${y * -8}px)`;
  });
  heroVisual.addEventListener("mouseleave", () => {
    const shape = heroVisual.querySelector(".p-shape");
    const ring = heroVisual.querySelector(".ring");
    if (shape) shape.style.transform = "";
    if (ring) ring.style.transform = "";
  });
}

/* ---------- 11. COMPTEURS ANIMÉS (statistiques du hero) ---------- */
const statEls = document.querySelectorAll(".hero-stat b");
if (statEls.length && "IntersectionObserver" in window) {
  const animateCount = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach((el) => statObserver.observe(el));
}