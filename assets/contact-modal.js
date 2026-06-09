(() => {
  const aliases = [
    {
      name: "KAN",
      links: [["Instagram", "https://www.instagram.com/kan.yh/"]]
    },
    {
      name: "숲이랑",
      links: [
        ["X", "https://twitter.com/soop2rang"],
        ["Xiaohongshu", "https://xhslink.com/m/7RcnATIumdk"],
        ["Spinspin", "https://spinspin.net/soop2rang"]
      ]
    }
  ];

  const socialIcons = {
    Instagram: "assets/logos/instagram.png",
    X: "assets/logos/x.png",
    Xiaohongshu: "assets/logos/xiaohongshu-wordmark.png",
    Spinspin: "assets/logos/spinspin.png"
  };

  const copy = {
    ko: {
      close: "닫기",
      langToggle: "English",
      sns: "SNS",
      contact: "Contact",
      emailText: "비즈니스 및 공식 문의는 아래 이메일로 연락해 주세요.<br>SNS DM은 확인이 늦을 수 있습니다.",
      soop: "숲이랑"
    },
    en: {
      close: "Close",
      langToggle: "한국어",
      sns: "SNS",
      contact: "Contact",
      emailText: "For business inquiries, please contact me by email.<br>SNS DMs may take longer to check.",
      soop: "Soop2rang"
    }
  };

  let lockedScrollY = 0;
  
  function language() {
    const lang = localStorage.getItem("siteLang") || document.documentElement.lang || "ko";
    return lang.startsWith("en") ? "en" : "ko";
  }

  function aliasName(name, lang) {
    return name === "숲이랑" ? copy[lang].soop : name;
  }

  function socialIcon(label) {
    const src = socialIcons[label];
    return src ? `<img src="${src}" alt="">` : "";
  }

  function render() {
    const lang = language();
    const modal = document.querySelector("#contactModal");
    if (!modal) return;

    modal.querySelector("[data-contact-modal-close]").setAttribute("aria-label", copy[lang].close);
    modal.querySelector("[data-contact-modal-lang]").textContent = copy[lang].langToggle;
    modal.querySelector(".contact-modal-body").innerHTML = `
      <section class="modal-section" aria-labelledby="modal-sns-title">
        <h2 id="modal-sns-title">${copy[lang].sns}</h2>
        <div class="modal-aliases">
          ${aliases.map((alias) => `
            <article class="modal-alias-card">
              <h3>${aliasName(alias.name, lang)}</h3>
              <div class="social-links">
                ${alias.links.map(([label, url]) => `<a class="social-button" href="${url}" target="_blank" rel="noreferrer" aria-label="${aliasName(alias.name, lang)} ${label}" title="${label}">${socialIcon(label)}</a>`).join("")}
              </div>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="modal-section modal-contact" aria-labelledby="modal-contact-title">
        <h2 id="modal-contact-title">${copy[lang].contact}</h2>
        <p>${copy[lang].emailText}</p>
        <a class="link-button" href="mailto:dbgus7928@naver.com">
          <img class="inline-logo" src="assets/logos/email.png" alt="" aria-hidden="true">
          dbgus7928@naver.com
        </a>
      </section>
    `;
  }

  function ensureModal() {
    if (document.querySelector("#contactModal")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div class="contact-modal" id="contactModal" aria-hidden="true">
        <div class="contact-modal-backdrop" data-contact-modal-close></div>
        <div class="contact-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-sns-title">
          <button class="contact-modal-lang" type="button" data-contact-modal-lang>English</button>
          <button class="contact-modal-close" type="button" data-contact-modal-close aria-label="Close">×</button>
          <div class="contact-modal-body"></div>
        </div>
      </div>
    `);
    render();
  }

  function openModal() {
    ensureModal();
    render();
    document.querySelector("#contactModal").setAttribute("aria-hidden", "false");
    lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : "";
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    const modal = document.querySelector("#contactModal");
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    document.body.style.top = "";
    document.body.style.paddingRight = "";
    window.scrollTo(0, lockedScrollY);
  }

  function toggleLanguage() {
    const next = language() === "ko" ? "en" : "ko";
    localStorage.setItem("siteLang", next);
    document.documentElement.lang = next;
    render();
    window.dispatchEvent(new CustomEvent("site-language-change"));
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-contact-modal]");
    if (trigger) {
      event.preventDefault();
      openModal();
      return;
    }

    if (event.target.closest("[data-contact-modal-lang]")) {
      toggleLanguage();
      return;
    }

    if (event.target.closest("[data-contact-modal-close]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  window.addEventListener("site-language-change", render);
})();
