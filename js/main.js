(function () {
  const STORAGE = "temple-lang";
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
            <span class="brand-ml" data-i18n="brand.name">Sree Kurumba Bhagavathy</span>
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
        </div>
        <div>
          <h3 data-i18n="footer.temple">Temple</h3>
          <p><a href="darshan.html" data-i18n="footer.timings">Darshan timings</a><br>
          <a href="darshan.html#pooja" data-i18n="footer.pooja">Book a pooja</a><br>
          <a href="donate.html" data-i18n="footer.donate">Annadanam &amp; donations</a><br>
          <a href="visit.html" data-i18n="footer.reach">How to reach</a></p>
        </div>
      </div>
      <div class="wrap tiny" data-i18n="footer.tiny">
        A new public website for devotees, built from temple records, Kerala Tourism, and living tradition.
        Photography inside the sanctum is not permitted. Festival dates follow the Malayalam calendar.
      </div>
    </footer>
  `;

  document.body.insertAdjacentHTML("afterbegin", header);
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

  document.querySelectorAll("[data-no-digits]").forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\p{N}/gu, "");
      input.setCustomValidity(
        input.value && !/\p{L}/u.test(input.value)
          ? "Please enter a name using letters."
          : ""
      );
    });
  });

  document.querySelectorAll("[data-digits-only]").forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
    });
  });

  document.querySelectorAll("[data-letters-only]").forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^\p{L}\p{M}\s]/gu, "");
    });
  });

  document.querySelectorAll("[data-date-window]").forEach((input) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maximum = new Date(today);
    const targetMonth = maximum.getMonth() + 3;
    const targetDay = maximum.getDate();
    maximum.setDate(1);
    maximum.setMonth(targetMonth);
    const lastDay = new Date(maximum.getFullYear(), maximum.getMonth() + 1, 0).getDate();
    maximum.setDate(Math.min(targetDay, lastDay));

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    input.min = formatDate(today);
    input.max = formatDate(maximum);
  });

  document.querySelectorAll("form[data-confirm]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const successBox = form.querySelector(".form-success");
      const errorBox = form.querySelector(".form-error");
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : "Submit";
      const lang = currentLang();

      if (successBox) successBox.classList.remove("show");
      if (errorBox) {
        errorBox.classList.remove("show");
        errorBox.textContent = "";
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = lang === "ml" ? "അയക്കുന്നു..." : "Sending...";
      }

      const config = window.TEMPLE_CONFIG || {
        adminEmail: "templeoffice@example.com",
        provider: "formsubmit",
        web3formsKey: ""
      };

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Determine form type
      let formType = "inquiry";
      if (page === "darshan") formType = "pooja";
      else if (page === "donate") formType = "donate";

      try {
        // 1. Try serverless endpoint (Supabase DB + Resend emails)
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            type: formType,
            data: data
          })
        });

        // If running in an environment with /api/submit available
        if (response.ok) {
          if (successBox) {
            successBox.classList.add("show");
            successBox.textContent = form.dataset.confirm || (lang === "ml" ? "സ്വീകരിച്ചു! നിങ്ങളുടെ അപേക്ഷ രേഖപ്പെടുത്തി." : "Received! Your request has been recorded.");
          }
          form.reset();
          return;
        }

        // Only use the external fallback when this deployment has no API route.
        // Validation, database, or email errors from an existing API must surface
        // to the user instead of silently bypassing Supabase.
        if (response.status !== 404 && response.status !== 405) {
          throw new Error("Server submission failed");
        }

        // 2. Fallback to FormSubmit if /api/submit is not configured
        const recipient = config.adminEmail || "templeoffice@example.com";
        const fallbackRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            _subject: `[Kodungallur Temple] ${formType.toUpperCase()} Request - ${data.name || 'Devotee'}`,
            _template: "table",
            _captcha: "false",
            ...data
          })
        });

        if (fallbackRes.ok) {
          if (successBox) {
            successBox.classList.add("show");
            successBox.textContent = form.dataset.confirm || (lang === "ml" ? "സ്വീകരിച്ചു! നിങ്ങളുടെ അപേക്ഷ രേഖപ്പെടുത്തി." : "Received! Your request has been recorded.");
          }
          form.reset();
        } else {
          throw new Error("Submission failed");
        }
      } catch (err) {
        console.warn("Form submission error:", err);
        if (errorBox) {
          errorBox.classList.add("show");
          errorBox.textContent = lang === "ml"
            ? "സന്ദേശം അയക്കാൻ സാധിച്ചില്ല. ദയവായി നിങ്ങളുടെ ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക."
            : "Could not send the request. Please check your internet connection and try again.";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });

  document.querySelectorAll(".amounts button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.querySelector("#amount");
      document.querySelectorAll(".amounts button").forEach((button) => {
        button.classList.toggle("active", button === btn);
      });
      if (input) input.value = btn.dataset.amount;
    });
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-content > *", {
      y: 34,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.15
    });

    document.querySelectorAll(".frame, .card, .compound article, .donate-card, .form-card").forEach((element) => {
      gsap.from(element, {
        y: 42,
        opacity: 0,
        scale: 0.96,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true
        }
      });
    });

    document.querySelectorAll(".section h2, .page-banner h1").forEach((heading) => {
      gsap.from(heading, {
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: heading, start: "top 88%", once: true }
      });
    });

    const visual = document.querySelector(".hero-media img");
    if (visual) {
      gsap.to(visual, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }
  }

  applyLang(currentLang());
})();
