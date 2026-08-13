(function () {
  const page = document.body.dataset.page || "home";

  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.href = "assets/images/emblem.jpg";
  document.head.appendChild(favicon);

  const header = `
    <a class="skip" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="index.html">
          <img src="assets/images/emblem.jpg" alt="Temple lamp emblem">
          <span class="brand-text">
            <span class="brand-ml">ശ്രീ കുരുംബ ഭഗവതി</span>
            <span class="brand-en">Kodungallur Temple</span>
          </span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">☰</button>
        <nav class="nav" id="site-nav" aria-label="Primary">
          <a href="index.html" data-nav="home">Home</a>
          <a href="history.html" data-nav="history">History</a>
          <a href="festivals.html" data-nav="festivals">Festivals</a>
          <a href="darshan.html" data-nav="darshan">Darshan</a>
          <a href="visit.html" data-nav="visit">Visit</a>
          <a class="donate-link" href="donate.html" data-nav="donate">Donate</a>
        </nav>
      </div>
    </header>
  `;

  const footer = `
    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div>
          <h3>Sree Kurumba Bhagavathy Temple</h3>
          <p>Kodungallur Amma — the Mother of Kodungallur. Head of the 64 Bhadrakali kavus of Malabar. Administered by the Cochin Devaswom Board.</p>
        </div>
        <div>
          <h3>Visit</h3>
          <p>Thekkenada Road, Pettumma<br>Kodungallur, Kerala 680664</p>
          <p><a href="tel:+914802803061">0480 280 3061</a><br>
          <a href="tel:+919188958032">+91 91889 58032</a></p>
        </div>
        <div>
          <h3>Temple</h3>
          <p><a href="darshan.html">Darshan timings</a><br>
          <a href="darshan.html#pooja">Book a pooja</a><br>
          <a href="donate.html">Annadanam &amp; donations</a><br>
          <a href="https://kodungallursreekurumbabhagavathytemple.org/" rel="noopener">Official booking site</a></p>
        </div>
      </div>
      <div class="wrap tiny">
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
})();
