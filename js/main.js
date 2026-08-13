(function () {
  const STORAGE = "temple-lang";
  const THEME_KEY = "temple-theme";
  const page = document.body.dataset.page || "home";
  const dicts = window.TEMPLE_I18N || { en: {}, ml: {} };

  function currentLang() {
    const saved = localStorage.getItem(STORAGE);
    return saved === "ml" ? "ml" : "en";
  }

  function t(key, lang) {
    const pack = dicts[lang] || dicts.en;
    return pack[key] || dicts.en[key] || key;
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("lang-ml", lang === "ml");
    document.documentElement.classList.remove("i18n-wait");
    localStorage.setItem(STORAGE, lang);

    const titleKey = "title." + page;
    if (dicts.en[titleKey]) document.title = t(titleKey, lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n, lang);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml, lang);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder, lang));
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.setAttribute("title", t(el.dataset.i18nTitle, lang));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.i18nAria, lang));
    });
    document.querySelectorAll("[data-i18n-confirm]").forEach((el) => {
      el.dataset.confirm = t(el.dataset.i18nConfirm, lang);
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
  }

  function currentTheme() {
    return localStorage.getItem(THEME_KEY) === "night" ? "night" : "day";
  }

  function applyTheme(theme) {
    const night = theme === "night";
    document.documentElement.classList.toggle("theme-night", night);
    localStorage.setItem(THEME_KEY, night ? "night" : "day");
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.theme === theme));
    });
    const rail = document.querySelector(".dheepam-rail");
    if (rail) {
      rail.querySelectorAll(".flame, .glow").forEach((el) => {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
      });
    }
  }

  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.href = "assets/images/emblem.jpg";
  document.head.appendChild(favicon);

  const header = `
    <a class="skip" href="#main" data-i18n="skip">Skip to content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="index.html">
          <img src="assets/images/emblem.jpg" alt="">
          <span class="brand-text">
            <span class="brand-ml">ശ്രീ കുരുംബ ഭഗവതി</span>
            <span class="brand-en" data-i18n="brand.sub">Kodungallur Temple</span>
          </span>
        </a>
        <nav class="nav" id="site-nav" aria-label="Primary">
          <a href="index.html" data-nav="home" data-i18n="nav.home">Home</a>
          <a href="history.html" data-nav="history" data-i18n="nav.history">History</a>
          <a href="festivals.html" data-nav="festivals" data-i18n="nav.festivals">Festivals</a>
          <a href="darshan.html" data-nav="darshan" data-i18n="nav.darshan">Darshan</a>
          <a href="visit.html" data-nav="visit" data-i18n="nav.visit">Visit</a>
          <a class="donate-link" href="donate.html" data-nav="donate" data-i18n="nav.donate">Donate</a>
        </nav>
        <div class="header-tools">
          <div class="theme-switch" role="group" data-i18n-aria="theme.label" aria-label="Theme">
            <button type="button" class="theme-btn" data-theme="day" data-i18n="theme.morning">Morning</button>
            <button type="button" class="theme-btn" data-theme="night"><span class="mini-flame" aria-hidden="true"></span><span data-i18n="theme.night">Night</span></button>
          </div>
          <div class="lang-switch" role="group" data-i18n-aria="lang.label" aria-label="Language">
            <button type="button" class="lang-btn" data-lang="en">EN</button>
            <button type="button" class="lang-btn" data-lang="ml">മല</button>
          </div>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">☰</button>
        </div>
      </div>
    </header>
  `;

  const footer = `
    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div>
          <h3 data-i18n="footer.title">Sree Kurumba Bhagavathy Temple</h3>
          <p data-i18n="footer.blurb">Kodungallur Amma — the Mother of Kodungallur. Head of the 64 Bhadrakali kavus of Malabar. Administered by the Cochin Devaswom Board.</p>
        </div>
        <div>
          <h3 data-i18n="footer.visit">Visit</h3>
          <p data-i18n-html="footer.addr">Thekkenada Road, Pettumma<br>Kodungallur, Kerala 680664</p>
          <p><a href="tel:+914802803061">0480 280 3061</a><br>
          <a href="tel:+919188958032">+91 91889 58032</a></p>
        </div>
        <div>
          <h3 data-i18n="footer.temple">Temple</h3>
          <p><a href="darshan.html" data-i18n="footer.timings">Darshan timings</a><br>
          <a href="darshan.html#pooja" data-i18n="footer.pooja">Book a pooja</a><br>
          <a href="donate.html" data-i18n="footer.donate">Annadanam &amp; donations</a><br>
          <a href="https://kodungallursreekurumbabhagavathytemple.org/" rel="noopener" data-i18n="footer.official">Official booking site</a></p>
        </div>
      </div>
      <div class="wrap tiny" data-i18n="footer.tiny">
        A new public website for devotees, built from temple records, Kerala Tourism, and living tradition.
        Photography inside the sanctum is not permitted. Festival dates follow the Malayalam calendar.
      </div>
    </footer>
  `;

  const lamps = Array.from({ length: 9 }, () => `
    <div class="dheepam" aria-hidden="true">
      <span class="dheepam-flame"><span class="wick"></span><span class="flame"></span><span class="glow"></span></span>
      <span class="dheepam-bowl"></span>
      <span class="dheepam-stem"></span>
    </div>
  `).join("");

  document.body.insertAdjacentHTML("afterbegin", header);
  document.querySelector(".site-header").insertAdjacentHTML(
    "afterend",
    `<div class="dheepam-rail" aria-hidden="true">${lamps}</div>`
  );
  document.body.insertAdjacentHTML("beforeend", footer);

  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) link.setAttribute("aria-current", "page");
  });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });

  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });

  document.querySelectorAll("form[data-confirm]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const box = form.querySelector(".form-success");
      if (box) {
        box.classList.add("show");
        box.textContent = form.dataset.confirm;
      }
      form.reset();
    });
  });

  document.querySelectorAll(".amounts button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.querySelector("#amount");
      document.querySelectorAll(".amounts button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (input) input.value = btn.dataset.amount;
    });
  });

  applyLang(currentLang());
  applyTheme(currentTheme());
})();
