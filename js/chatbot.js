(function () {
  "use strict";

  const copy = {
    en: {
      launcher: "Ask the temple guide",
      title: "Temple Guide",
      status: "Here to help with your visit",
      close: "Close temple guide",
      welcome: "Namaskaram. I can help with darshan timings, pooja requests, directions, festivals, dress customs, and donations. What would you like to know?",
      placeholder: "Ask about timings, pooja, directions...",
      inputLabel: "Your question",
      send: "Send message",
      suggestions: [
        ["timings", "Darshan timings"],
        ["visit", "How to reach"],
        ["pooja", "Book a pooja"],
        ["festivals", "Main festivals"]
      ],
      fallback: "I’m not certain about that. I can help with timings, travel, pooja, dress customs, festivals, history, photography, and donations. For a specific request, please write to the temple office.",
      officeLink: "Contact the temple office",
      disclaimer: "Information is based on this website. Confirm special-day arrangements at the temple counter."
    },
    ml: {
      launcher: "ക്ഷേത്ര വഴികാട്ടിയോട് ചോദിക്കുക",
      title: "ക്ഷേത്ര വഴികാട്ടി",
      status: "നിങ്ങളുടെ സന്ദർശനത്തിന് സഹായിക്കാൻ",
      close: "ക്ഷേത്ര വഴികാട്ടി അടയ്ക്കുക",
      welcome: "നമസ്കാരം. ദർശന സമയം, വഴിപാട് അപേക്ഷ, യാത്രാമാർഗം, ഉത്സവങ്ങൾ, വസ്ത്രധാരണം, സംഭാവന എന്നിവയെക്കുറിച്ച് ഞാൻ സഹായിക്കാം. എന്താണ് അറിയേണ്ടത്?",
      placeholder: "സമയം, വഴിപാട്, യാത്ര എന്നിവ ചോദിക്കൂ...",
      inputLabel: "നിങ്ങളുടെ ചോദ്യം",
      send: "സന്ദേശം അയയ്ക്കുക",
      suggestions: [
        ["timings", "ദർശന സമയം"],
        ["visit", "എങ്ങനെ എത്താം"],
        ["pooja", "വഴിപാട് അപേക്ഷ"],
        ["festivals", "പ്രധാന ഉത്സവങ്ങൾ"]
      ],
      fallback: "അതിനെക്കുറിച്ച് എനിക്ക് ഉറപ്പായ വിവരമില്ല. സമയം, യാത്ര, വഴിപാട്, വസ്ത്രധാരണം, ഉത്സവങ്ങൾ, ചരിത്രം, ഫോട്ടോഗ്രാഫി, സംഭാവന എന്നിവയിൽ സഹായിക്കാം. പ്രത്യേക ആവശ്യത്തിന് ക്ഷേത്ര ഓഫീസിലേക്ക് സന്ദേശം അയയ്ക്കുക.",
      officeLink: "ക്ഷേത്ര ഓഫീസുമായി ബന്ധപ്പെടുക",
      disclaimer: "വിവരങ്ങൾ ഈ വെബ്‌സൈറ്റിനെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്. പ്രത്യേക ദിവസങ്ങളിലെ ക്രമീകരണം ക്ഷേത്ര കൗണ്ടറിൽ സ്ഥിരീകരിക്കുക."
    }
  };

  const topics = {
    timings: {
      keywords: ["time", "timing", "open", "close", "darshan", "hours", "schedule", "സമയം", "തുറക്ക", "അടയ്ക്ക", "ദർശന"],
      en: ["The temple is open from 4:00 AM to 12:00 noon and from 4:00 PM to 8:00 PM. Deeparadhana is at 6:15 PM, and Guruthy follows the night closing. Festival days can affect the schedule.", "See the full timetable", "darshan.html"],
      ml: ["ക്ഷേത്രം രാവിലെ 4:00 മുതൽ ഉച്ചയ്ക്ക് 12:00 വരെയും വൈകിട്ട് 4:00 മുതൽ രാത്രി 8:00 വരെയും തുറന്നിരിക്കും. ദീപാരാധന വൈകിട്ട് 6:15-നും ഗുരുതി രാത്രി നട അടച്ച ശേഷവുമാണ്. ഉത്സവ ദിവസങ്ങളിൽ സമയത്തിൽ മാറ്റമുണ്ടാകാം.", "പൂർണ്ണ സമയക്രമം കാണുക", "darshan.html"]
    },
    visit: {
      keywords: ["reach", "direction", "address", "map", "bus", "train", "rail", "airport", "travel", "where", "എത്ത", "വിലാസ", "ബസ്", "ട്രെയിൻ", "വിമാന", "യാത്ര", "എവിടെ"],
      en: ["The temple is on Thekkenada Road, Pettumma, Kodungallur, Thrissur, Kerala 680664. It is about 700 m from the private bus stand, 16–20 km from Irinjalakuda railway station, and 31 km from Cochin International Airport.", "Map and travel details", "visit.html"],
      ml: ["ക്ഷേത്രം തേക്കേനട റോഡ്, പെറ്റുമ്മ, കൊടുങ്ങല്ലൂർ, തൃശ്ശൂർ, കേരളം 680664 എന്ന വിലാസത്തിലാണ്. സ്വകാര്യ ബസ് സ്റ്റാൻഡിൽ നിന്ന് ഏകദേശം 700 മീറ്റർ, ഇരിങ്ങാലക്കുട റെയിൽവേ സ്റ്റേഷനിൽ നിന്ന് 16–20 കി.മീ., കൊച്ചി വിമാനത്താവളത്തിൽ നിന്ന് 31 കി.മീ. ദൂരമുണ്ട്.", "ഭൂപടവും യാത്രാവിവരങ്ങളും", "visit.html"]
    },
    pooja: {
      keywords: ["pooja", "puja", "offering", "vazhipadu", "book", "nakshatra", "guruthy", "archana", "വഴിപാട്", "പൂജ", "ബുക്ക്", "നക്ഷത്ര", "ഗുരുതി", "അർച്ചന"],
      en: ["You can request Nakshatra Pushpanjali, Guruthy, Archana, Rektha Pushpanjali, or ask the office to advise you. Special vazhipadu should be requested at least five days ahead when possible.", "Send a pooja request", "darshan.html#pooja"],
      ml: ["നക്ഷത്ര പുഷ്പാഞ്ജലി, ഗുരുതി, അർച്ചന, രക്ത പുഷ്പാഞ്ജലി എന്നിവയ്ക്ക് അപേക്ഷിക്കാം; അല്ലെങ്കിൽ ഓഫീസിന്റെ നിർദേശം തേടാം. പ്രത്യേക വഴിപാട് സാധ്യമെങ്കിൽ കുറഞ്ഞത് അഞ്ചു ദിവസം മുൻപ് അപേക്ഷിക്കുക.", "വഴിപാട് അപേക്ഷ അയയ്ക്കുക", "darshan.html#pooja"]
    },
    festivals: {
      keywords: ["festival", "bharani", "thalappoli", "navaratri", "chandattam", "utsavam", "ഉത്സവ", "ഭരണി", "താലപ്പൊലി", "നവരാത്രി", "ചാന്താട്ടം"],
      en: ["Kodungallur Bharani and Thalappoli are the two great festivals. Bharani runs through the Malayalam months of Kumbham and Meenam; Thalappoli begins around Makara Sankranti and lasts four days. Dates follow the Malayalam calendar.", "Explore festivals", "festivals.html"],
      ml: ["കൊടുങ്ങല്ലൂർ ഭരണിയും താലപ്പൊലിയും പ്രധാന ഉത്സവങ്ങളാണ്. ഭരണി കുംഭം–മീനം മാസങ്ങളിലൂടെയും താലപ്പൊലി മകരസംക്രാന്തിയോടനുബന്ധിച്ച് നാലു ദിവസവും നടക്കുന്നു. തീയതികൾ മലയാള കലണ്ടർ അനുസരിച്ചാണ്.", "ഉത്സവങ്ങൾ കാണുക", "festivals.html"]
    },
    dress: {
      keywords: ["dress", "wear", "clothes", "custom", "mundu", "sari", "വസ്ത്ര", "ധരിക്ക", "മുണ്ട്", "സാരി", "ആചാര"],
      en: ["The reported custom is mundu or veshti for men, and sari, set mundu, or salwar kameez with dupatta for women. A head bath before darshan is customary. If unsure, the temple counter can guide you.", "Read the visitor customs", "darshan.html#customs"],
      ml: ["പുരുഷന്മാർക്ക് മുണ്ട് അല്ലെങ്കിൽ വേഷ്ടി; സ്ത്രീകൾക്ക് സാരി, സെറ്റ് മുണ്ട്, അല്ലെങ്കിൽ ദുപ്പട്ടയോടുകൂടിയ സൽവാർ കമീസ് എന്നാണ് ആചാരം. ദർശനത്തിന് മുമ്പ് തല കുളിക്കുന്നതും പതിവാണ്. സംശയമുണ്ടെങ്കിൽ കൗണ്ടറിൽ ചോദിക്കുക.", "സന്ദർശക ആചാരങ്ങൾ വായിക്കുക", "darshan.html#customs"]
    },
    donate: {
      keywords: ["donate", "donation", "money", "annadanam", "charity", "renovation", "give", "സംഭാവന", "അന്നദാനം", "ദാനം", "പണം", "നവീകരണം"],
      en: ["Devotees may pledge support for Annadanam, the charity fund, or temple renovation. The site records your pledge; it does not collect a card or bank payment.", "Make a donation pledge", "donate.html"],
      ml: ["അന്നദാനം, ദാനധർമ്മ നിധി, ക്ഷേത്ര നവീകരണം എന്നിവയ്ക്കായി സംഭാവന ഉറപ്പ് നൽകാം. ഈ സൈറ്റ് നിങ്ങളുടെ ഉറപ്പ് രേഖപ്പെടുത്തുന്നു; കാർഡ് അല്ലെങ്കിൽ ബാങ്ക് പണമിടപാട് ഇവിടെ നടത്തുന്നില്ല.", "സംഭാവന ഉറപ്പ് നൽകുക", "donate.html"]
    },
    history: {
      keywords: ["history", "story", "legend", "amma", "bhadrakali", "darika", "kannagi", "shankara", "ചരിത്ര", "കഥ", "ഐതിഹ്യ", "അമ്മ", "ഭദ്രകാളി", "ദാരിക", "കണ്ണകി", "ശങ്കര"],
      en: ["The temple keeps two living founding traditions: Bhadrakali’s slaying of Darika and the Kannagi tradition linked to Chera king Senguttuvan. Adi Shankara is also believed to have established sacred chakras behind the image.", "Read the temple history", "history.html"],
      ml: ["ക്ഷേത്രം രണ്ട് ജീവിക്കുന്ന സ്ഥാപന പാരമ്പര്യങ്ങൾ സൂക്ഷിക്കുന്നു: ഭദ്രകാളി ദാരികനെ വധിച്ച കഥയും ചേരൻ ചെങ്കുട്ടുവനുമായി ബന്ധപ്പെട്ട കണ്ണകി പാരമ്പര്യവും. വിഗ്രഹത്തിന് പിന്നിൽ ആദിശങ്കരൻ ചക്രങ്ങൾ സ്ഥാപിച്ചതായും വിശ്വസിക്കുന്നു.", "ക്ഷേത്ര ചരിത്രം വായിക്കുക", "history.html"]
    },
    photography: {
      keywords: ["photo", "camera", "photography", "picture", "ഫോട്ടോ", "ക്യാമറ", "ചിത്ര"],
      en: ["Photography is not allowed inside the temple or sanctum. Please treat festival observances as worship and follow directions from temple staff.", "Read the temple customs", "darshan.html#customs"],
      ml: ["ക്ഷേത്രത്തിനകത്തും ശ്രീകോവിലിനകത്തും ഫോട്ടോഗ്രാഫി അനുവദനീയമല്ല. ഉത്സവാചാരങ്ങളെ ആരാധനയായി മാനിക്കുകയും ക്ഷേത്ര ജീവനക്കാരുടെ നിർദേശങ്ങൾ പാലിക്കുകയും ചെയ്യുക.", "ക്ഷേത്ര ആചാരങ്ങൾ വായിക്കുക", "darshan.html#customs"]
    }
  };

  let language = document.documentElement.lang === "ml" ? "ml" : "en";
  let open = false;

  const root = document.createElement("aside");
  root.className = "temple-chat";
  root.dataset.open = "false";
  root.innerHTML = `
    <button class="chat-launcher" type="button" aria-expanded="false" aria-controls="temple-chat-panel">
      <span class="chat-launcher-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 5.75h14v10.5H9l-4 3v-13.5Z"/><path d="M8 9h8M8 12.5h5"/></svg>
      </span>
      <span class="chat-launcher-label"></span>
    </button>
    <section class="chat-panel" id="temple-chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title" aria-hidden="true">
      <header class="chat-header">
        <div class="chat-avatar" aria-hidden="true">ॐ</div>
        <div>
          <h2 id="chat-title"></h2>
          <p><span class="chat-status-dot" aria-hidden="true"></span><span class="chat-status"></span></p>
        </div>
        <button class="chat-close" type="button"><span aria-hidden="true">×</span></button>
      </header>
      <div class="chat-messages" role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="chat-suggestions" aria-label="Suggested questions"></div>
      <form class="chat-form">
        <label class="sr-only" for="temple-chat-input"></label>
        <input id="temple-chat-input" type="text" maxlength="240" autocomplete="off">
        <button type="submit"><span class="sr-only"></span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14"/></svg></button>
      </form>
      <p class="chat-disclaimer"></p>
    </section>`;

  document.body.appendChild(root);

  const launcher = root.querySelector(".chat-launcher");
  const panel = root.querySelector(".chat-panel");
  const closeButton = root.querySelector(".chat-close");
  const messages = root.querySelector(".chat-messages");
  const suggestions = root.querySelector(".chat-suggestions");
  const form = root.querySelector(".chat-form");
  const input = root.querySelector("#temple-chat-input");

  function currentCopy() {
    return copy[language];
  }

  function addMessage(text, sender, link) {
    const message = document.createElement("div");
    message.className = `chat-message chat-message-${sender}`;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    message.appendChild(paragraph);
    if (link) {
      const anchor = document.createElement("a");
      anchor.href = link[1];
      anchor.textContent = `${link[0]} →`;
      message.appendChild(anchor);
    }
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function findTopic(question) {
    const normalized = question.toLocaleLowerCase(language === "ml" ? "ml-IN" : "en-IN");
    let bestTopic = null;
    let bestScore = 0;
    Object.keys(topics).forEach((key) => {
      const score = topics[key].keywords.reduce((total, keyword) => {
        return total + (normalized.includes(keyword) ? keyword.length : 0);
      }, 0);
      if (score > bestScore) {
        bestScore = score;
        bestTopic = key;
      }
    });
    return bestTopic;
  }

  function answerQuestion(question, topicKey) {
    addMessage(question, "user");
    input.value = "";
    suggestions.hidden = true;
    const typing = document.createElement("div");
    typing.className = "chat-message chat-message-guide chat-typing";
    typing.setAttribute("aria-label", language === "ml" ? "മറുപടി തയ്യാറാക്കുന്നു" : "Preparing a reply");
    typing.innerHTML = "<i></i><i></i><i></i>";
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    window.setTimeout(() => {
      typing.remove();
      const matchedTopic = topicKey || findTopic(question);
      if (matchedTopic) {
        const answer = topics[matchedTopic][language];
        addMessage(answer[0], "guide", [answer[1], answer[2]]);
      } else {
        addMessage(currentCopy().fallback, "guide", [currentCopy().officeLink, "visit.html#contact"]);
      }
    }, 420);
  }

  function renderLanguage(resetConversation) {
    const text = currentCopy();
    root.querySelector(".chat-launcher-label").textContent = text.launcher;
    launcher.setAttribute("aria-label", text.launcher);
    root.querySelector("#chat-title").textContent = text.title;
    root.querySelector(".chat-status").textContent = text.status;
    closeButton.setAttribute("aria-label", text.close);
    input.placeholder = text.placeholder;
    root.querySelector("label[for='temple-chat-input']").textContent = text.inputLabel;
    form.querySelector("button .sr-only").textContent = text.send;
    suggestions.replaceChildren();
    text.suggestions.forEach(([topic, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => answerQuestion(label, topic));
      suggestions.appendChild(button);
    });
    suggestions.hidden = false;
    root.querySelector(".chat-disclaimer").textContent = text.disclaimer;
    if (resetConversation) {
      messages.replaceChildren();
      addMessage(text.welcome, "guide");
    }
  }

  function setOpen(nextOpen) {
    open = nextOpen;
    root.dataset.open = String(open);
    launcher.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
    if (open) {
      window.setTimeout(() => input.focus(), 50);
    } else {
      launcher.focus();
    }
  }

  launcher.addEventListener("click", () => setOpen(true));
  closeButton.addEventListener("click", () => setOpen(false));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (question) answerQuestion(question);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && open) setOpen(false);
  });
  document.addEventListener("temple:languagechange", (event) => {
    language = event.detail.language === "ml" ? "ml" : "en";
    renderLanguage(true);
  });

  renderLanguage(true);
})();
