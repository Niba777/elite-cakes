/* =========================================================
   Elite Cakes: site scripts
   ========================================================= */

/* ---------- 1. Settings: edit these ---------- */

// WhatsApp number in international format, digits only (94 = Sri Lanka, drop the leading 0)
const WHATSAPP_NUMBER = "94770000000";
const PHONE_DISPLAY = "+94 77 000 0000";
const MIN_DAYS_NOTICE = 2;

// Menu items, in English and Tamil. To use a real photo, put it in images/cakes/
// with the file name below. Until then, a coloured placeholder with the emoji is shown.
const CAKES = [
  {
    name: { en: "Chocolate Birthday Cake", ta: "சொக்லேட் பிறந்தநாள் கேக்" },
    desc: { en: "Rich chocolate sponge with silky ganache.", ta: "சுவைமிக்க சொக்லேட் ஸ்பொஞ்சுடன் மென்மையான கனாஷ்." },
    category: "birthday", price: 4500, img: "images/cakes/chocolate-birthday.jpg", emoji: "🎂", colors: ["#f3d9c4", "#c99a74"],
  },
  {
    name: { en: "Vanilla Rainbow Cake", ta: "வெனிலா ரெயின்போ கேக்" },
    desc: { en: "Colourful layers with fresh buttercream.", ta: "புதிய பட்டர்கிரீமுடன் வண்ணமயமான அடுக்குகள்." },
    category: "birthday", price: 4000, img: "images/cakes/rainbow.jpg", emoji: "🌈", colors: ["#ffe3f1", "#d8ecff"],
  },
  {
    name: { en: "Ribbon Cake", ta: "ரிப்பன் கேக்" },
    desc: { en: "The classic Sri Lankan favourite, layered & soft.", ta: "இலங்கையின் பிரியமான கிளாசிக், அடுக்கடுக்காக மென்மையாக." },
    category: "birthday", price: 3500, img: "images/cakes/ribbon.jpg", emoji: "🍰", colors: ["#fff1d6", "#ffd1e3"],
  },
  {
    name: { en: "Elegant Wedding Cake", ta: "அழகிய திருமண கேக்" },
    desc: { en: "Tiered cake with floral detail for your big day.", ta: "உங்கள் சிறப்பு நாளுக்கு மலர் வேலைப்பாடுடன் அடுக்கு கேக்." },
    category: "wedding", price: 15000, img: "images/cakes/wedding.jpg", emoji: "💍", colors: ["#fffaf2", "#f1e4cf"],
  },
  {
    name: { en: "Traditional Wedding Cake Pieces", ta: "பாரம்பரிய திருமண கேக் துண்டுகள்" },
    desc: { en: "Rich fruit cake, individually wrapped for guests.", ta: "விருந்தினர்களுக்குத் தனித்தனியாகப் பொதியிட்ட பழ கேக்." },
    category: "wedding", price: 120, unit: { en: "/ piece", ta: "/ ஒரு துண்டு" },
    img: "images/cakes/wedding-pieces.jpg", emoji: "🎁", colors: ["#f5e1c8", "#e2b98c"],
  },
  {
    name: { en: "Classic Cupcakes", ta: "கிளாசிக் கப்கேக்குகள்" },
    desc: { en: "Soft cupcakes topped with swirled frosting.", ta: "சுழல் ஃப்ரொஸ்டிங்குடன் மென்மையான கப்கேக்குகள்." },
    category: "cupcakes", price: 1800, unit: { en: "/ box of 6", ta: "/ 6 கொண்ட பெட்டி" },
    img: "images/cakes/cupcakes.jpg", emoji: "🧁", colors: ["#ffe9c2", "#f7a81b"],
  },
  {
    name: { en: "Red Velvet Cupcakes", ta: "ரெட் வெல்வெட் கப்கேக்குகள்" },
    desc: { en: "Red velvet with cream cheese frosting.", ta: "கிரீம் சீஸ் ஃப்ரொஸ்டிங்குடன் ரெட் வெல்வெட்." },
    category: "cupcakes", price: 2200, unit: { en: "/ box of 6", ta: "/ 6 கொண்ட பெட்டி" },
    img: "images/cakes/red-velvet-cupcakes.jpg", emoji: "❤️", colors: ["#ffd6d4", "#d9534f"],
  },
  {
    name: { en: "Cartoon Theme Cake", ta: "கார்ட்டூன் தீம் கேக்" },
    desc: { en: "Your child's favourite character, in cake form.", ta: "உங்கள் பிள்ளையின் விருப்பமான கதாபாத்திரம், கேக் வடிவில்." },
    category: "custom", price: 6000, img: "images/cakes/cartoon.jpg", emoji: "🧸", colors: ["#dff4ff", "#ffe3f1"],
  },
  {
    name: { en: "Photo Print Cake", ta: "புகைப்பட அச்சு கேக்" },
    desc: { en: "Your favourite photo printed on an edible sheet.", ta: "உங்களுக்குப் பிடித்த புகைப்படம், உண்ணக்கூடிய தாளில் அச்சிடப்பட்டு." },
    category: "custom", price: 5500, img: "images/cakes/photo.jpg", emoji: "📸", colors: ["#efe6ff", "#ffe9c2"],
  },
];

/* ---------- 2. Helpers ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const formatLKR = (n) => "Rs. " + n.toLocaleString("en-LK");
const waUrl = (text = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? "?text=" + encodeURIComponent(text) : ""}`;

let lang = "en";
const t = (key) => UI[lang][key];
const priceLabel = (cake) => `${formatLKR(cake.price)} ${cake.unit ? cake.unit[lang] : t("from")}`;
const categoryLabel = (cat) => $(`.chip[data-filter="${cat}"]`).textContent;

// Returns an <img> that falls back to the emoji placeholder if the photo is missing
function cakeMedia(cake) {
  const ph = document.createElement("div");
  ph.className = "placeholder";
  ph.textContent = cake.emoji;
  ph.style.setProperty("--c1", cake.colors[0]);
  ph.style.setProperty("--c2", cake.colors[1]);

  const img = new Image();
  img.alt = cake.name[lang];
  img.loading = "lazy";
  img.onerror = () => img.replaceWith(ph);
  img.src = cake.img;
  return img;
}

/* ---------- 3. Header: sticky shadow, mobile menu, active link ---------- */
const header = $("#header");
const burger = $("#burger");
const navLinks = $("#navLinks");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
});

$$("a", navLinks).forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", false);
  })
);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    $$(".nav-links a").forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
    );
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach((s) => sectionObserver.observe(s));

/* ---------- 4. Menu: render cards + filters ---------- */
const grid = $("#cakeGrid");
const cakeSelect = $("#cake");
let activeFilter = "all";
let menuRendered = false;

function renderMenu() {
  grid.replaceChildren();
  CAKES.forEach((cake, i) => {
    const card = document.createElement("article");
    // After the first render, cards appear straight away (no scroll fade on language switch)
    card.className = "card reveal" + (menuRendered ? " visible" : "");
    if (activeFilter !== "all" && cake.category !== activeFilter) card.classList.add("hide");
    card.dataset.category = cake.category;
    card.dataset.index = i;
    card.innerHTML = `
      <div class="card-media"><span class="badge">${categoryLabel(cake.category)}</span></div>
      <div class="card-body">
        <h3>${cake.name[lang]}</h3>
        <p>${cake.desc[lang]}</p>
        <div class="card-foot">
          <span class="price">${formatLKR(cake.price)} <small>${cake.unit ? cake.unit[lang] : t("from")}</small></span>
          <a href="#order" class="order-link">${lang === "ta" ? "ஆர்டர் →" : "Order →"}</a>
        </div>
      </div>`;
    $(".card-media", card).prepend(cakeMedia(cake));

    // "Order →" pre-selects this cake in the form
    $(".order-link", card).addEventListener("click", (e) => {
      e.stopPropagation();
      cakeSelect.value = i;
    });
    card.addEventListener("click", () => openLightbox(i));
    grid.appendChild(card);
    if (!menuRendered) revealObserver.observe(card);
  });
  menuRendered = true;
}

// Cake <select> options; values are indexes so the choice survives a language switch
function renderCakeOptions() {
  const selected = cakeSelect.value;
  cakeSelect.replaceChildren(new Option(t("selectCake"), ""));
  CAKES.forEach((cake, i) => cakeSelect.add(new Option(cake.name[lang], i)));
  cakeSelect.add(new Option(t("otherCake"), "other"));
  cakeSelect.value = selected;
}

$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  $$(".chip").forEach((c) => c.classList.toggle("active", c === btn));
  $$(".card", grid).forEach((card) =>
    card.classList.toggle("hide", activeFilter !== "all" && card.dataset.category !== activeFilter)
  );
});

/* ---------- 5. Lightbox ---------- */
const lightbox = $("#lightbox");
let current = 0;

const visibleIndexes = () =>
  $$(".card:not(.hide)", grid).map((c) => Number(c.dataset.index));

function showSlide(i) {
  current = i;
  const cake = CAKES[i];
  $("#lbMedia").replaceChildren(cakeMedia(cake));
  $("#lbCaption").textContent = `${cake.name[lang]} · ${priceLabel(cake)}`;
}
function openLightbox(i) {
  showSlide(i);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", false);
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", true);
  document.body.style.overflow = "";
}
function step(dir) {
  const list = visibleIndexes();
  const pos = list.indexOf(current);
  showSlide(list[(pos + dir + list.length) % list.length]);
}

$("#lbClose").addEventListener("click", closeLightbox);
$("#lbPrev").addEventListener("click", () => step(-1));
$("#lbNext").addEventListener("click", () => step(1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

/* ---------- 6. Order form → WhatsApp ---------- */
const form = $("#orderForm");
const dateInput = $("#date");
const errorEl = $("#formError");

// Earliest pickup date = today + notice period
const minDate = new Date();
minDate.setDate(minDate.getDate() + MIN_DAYS_NOTICE);
dateInput.min = minDate.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const required = $$("[required]", form);
  required.forEach((el) => el.classList.toggle("invalid", !el.value.trim()));

  if (required.some((el) => !el.value.trim())) {
    errorEl.textContent = t("errRequired");
    return;
  }
  if (dateInput.value < dateInput.min) {
    dateInput.classList.add("invalid");
    errorEl.textContent = t("errDate")(MIN_DAYS_NOTICE);
    return;
  }
  errorEl.textContent = "";

  const date = new Date(dateInput.value + "T00:00").toLocaleDateString(t("dateLocale"), {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
  const delivery = $("input[name=delivery]:checked", form).value;
  const lines = [
    t("waIntro"),
    "",
    `*${t("waName")}:* ${$("#name").value.trim()}`,
    `*${t("waCake")}:* ${cakeSelect.selectedOptions[0].text}`,
    `*${t("waSize")}:* ${$("#size").selectedOptions[0].text}`,
    `*${t("waDate")}:* ${date}`,
    `*${t("waDelivery")}:* ${delivery === "pickup" ? t("waPickup") : t("waDeliver")}`,
  ];
  const msg = $("#message").value.trim();
  const notes = $("#notes").value.trim();
  if (msg) lines.push(`*${t("waMessage")}:* ${msg}`);
  if (notes) lines.push(`*${t("waNotes")}:* ${notes}`);

  window.open(waUrl(lines.join("\n")), "_blank", "noopener");
});

$$("input, select", form).forEach((el) =>
  el.addEventListener("input", () => el.classList.remove("invalid"))
);

/* ---------- 7. Contact links ---------- */
function updateContactLinks() {
  $$(".js-wa-link").forEach((a) => (a.href = waUrl(t("waGreeting"))));
}
$$(".js-phone").forEach((a) => {
  a.href = "tel:+" + WHATSAPP_NUMBER;
  a.textContent = PHONE_DISPLAY;
});

/* ---------- 8. Reviews slider ---------- */
const slides = $("#slides");
const dots = $("#dots");
const total = slides.children.length;
let slide = 0;
let timer;

for (let i = 0; i < total; i++) {
  const b = document.createElement("button");
  b.setAttribute("aria-label", `Review ${i + 1}`);
  b.addEventListener("click", () => { goTo(i); restart(); });
  dots.appendChild(b);
}
function goTo(i) {
  slide = i;
  slides.style.transform = `translateX(-${i * 100}%)`;
  $$("button", dots).forEach((d, j) => d.classList.toggle("active", j === i));
}
function restart() {
  clearInterval(timer);
  timer = setInterval(() => goTo((slide + 1) % total), 5000);
}
goTo(0);
restart();

/* ---------- 9. Scroll reveal + stat counters ---------- */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    obs.unobserve(entry.target);
  });
}, { threshold: 0.12 });
$$(".reveal").forEach((el) => revealObserver.observe(el));

function countUp(el) {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const dur = 1500;
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const statObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    countUp(entry.target);
    obs.unobserve(entry.target);
  });
});
$$("[data-count]").forEach((el) => statObserver.observe(el));

/* ---------- 10. Language switch (English / தமிழ்) ---------- */
const langSwitch = $("#langSwitch");
const LANG_KEY = "elite-cakes-lang";

// Remember the original English so we can switch back
$$("[data-i18n]").forEach((el) => (el.dataset.en = el.innerHTML));
$$("[data-i18n-ph]").forEach((el) => (el.dataset.enPh = el.placeholder));

function setLanguage(next) {
  lang = next;
  document.documentElement.lang = lang;
  document.title = t("title");

  $$("[data-i18n]").forEach((el) => {
    el.innerHTML = lang === "ta" ? TAMIL[el.dataset.i18n] ?? el.dataset.en : el.dataset.en;
  });
  $$("[data-i18n-ph]").forEach((el) => {
    el.placeholder = lang === "ta" ? TAMIL[el.dataset.i18nPh] ?? el.dataset.enPh : el.dataset.enPh;
  });

  langSwitch.dataset.lang = lang;
  $$("button", langSwitch).forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));

  renderMenu();
  renderCakeOptions();
  updateContactLinks();
  if (errorEl.textContent) errorEl.textContent = "";
  if (lightbox.classList.contains("open")) showSlide(current);

  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* storage unavailable */ }
}

langSwitch.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-lang]");
  if (btn && btn.dataset.lang !== lang) setLanguage(btn.dataset.lang);
});

let savedLang = "en";
try { savedLang = localStorage.getItem(LANG_KEY) || "en"; } catch (e) { /* storage unavailable */ }
setLanguage(savedLang === "ta" ? "ta" : "en");

/* ---------- 11. Footer year ---------- */
$("#year").textContent = new Date().getFullYear();
