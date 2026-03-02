// GlassSite — minimal JS for high-fidelity behavior

// 1) Active nav link based on current page
(function setActiveNav() {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll("[data-nav]").forEach(a => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === path) a.classList.add("active");
    });
  })();
  
  // 2) Page transition on navigation
  (function pageTransitions() {
    const overlay = document.querySelector(".transition");
    if (!overlay) return;
  
    // On first paint, fade in content subtly
    requestAnimationFrame(() => overlay.classList.remove("show"));
  
    // Intercept internal links (same origin)
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
  
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
  
      // Only same-origin relative navigation
      const isExternal = link.target === "_blank" || /^https?:\/\//i.test(href);
      if (isExternal) return;
  
      e.preventDefault();
      overlay.classList.add("show");
      setTimeout(() => { window.location.href = href; }, 260);
    });
  
    // When loading new page, briefly show overlay then hide
    window.addEventListener("pageshow", () => overlay.classList.remove("show"));
  })();
  
  // 3) Scroll reveal via IntersectionObserver
  (function scrollReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
  
    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 });
  
    els.forEach(el => obs.observe(el));
  })();
  
  // 4) Store filtering (only on store.html)
  (function storeFilter() {
    const root = document.querySelector("[data-store]");
    if (!root) return;
  
    const productsEl = root.querySelector("[data-products]");
    const chips = root.querySelectorAll("[data-chip]");
    const search = root.querySelector("[data-search]");
  
    const products = [
      { title: "Aurora Glass Lamp", price: 49, cat: "Home", badge: "New" },
      { title: "Nebula Desk Mat", price: 29, cat: "Office", badge: "Hot" },
      { title: "Prism Water Bottle", price: 19, cat: "Lifestyle", badge: "Eco" },
      { title: "Flux Hoodie", price: 64, cat: "Apparel", badge: "Limited" },
      { title: "Vertex Backpack", price: 79, cat: "Apparel", badge: "Best" },
      { title: "Halo Headphones Stand", price: 39, cat: "Office", badge: "Clean" },
      { title: "Iridescent Phone Case", price: 24, cat: "Lifestyle", badge: "New" },
      { title: "Glass UI Icon Pack", price: 18, cat: "Digital", badge: "Pro" },
      { title: "Gradient Poster Set", price: 22, cat: "Home", badge: "Art" }
    ];
  
    let state = { cat: "All", q: "" };
  
    function render() {
      const q = state.q.trim().toLowerCase();
      const filtered = products.filter(p => {
        const catOk = state.cat === "All" || p.cat === state.cat;
        const qOk = !q || p.title.toLowerCase().includes(q);
        return catOk && qOk;
      });
  
      productsEl.innerHTML = filtered.map(p => `
        <article class="product glass reveal">
          <div class="thumb"></div>
          <div class="tag">${p.cat} • ${p.badge}</div>
          <h3>${p.title}</h3>
          <p style="color: rgba(255,255,255,0.70); margin: 8px 0 0; font-size: 13.5px;">
            Premium glassmorphism-styled product card. Replace with real description.
          </p>
          <div class="price">
            <strong>£${p.price}</strong>
            <a class="btn primary" href="inquiries.html" aria-label="Inquire about ${p.title}">
              Inquire →
            </a>
          </div>
        </article>
      `).join("");
  
      // Re-observe new reveal nodes
      const newEls = productsEl.querySelectorAll(".reveal");
      const obs = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        }
      }, { threshold: 0.12 });
      newEls.forEach(el => obs.observe(el));
    }
  
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        state.cat = chip.dataset.chip;
        render();
      });
    });
  
    search?.addEventListener("input", (e) => {
      state.q = e.target.value;
      render();
    });
  
    render();
  })();
  
  // 5) Faux auth (UI-only)
  (function fauxAuth() {
    const loginForm = document.querySelector("[data-login-form]");
    const signupForm = document.querySelector("[data-signup-form]");
  
    function showToast(msg) {
      const t = document.createElement("div");
      t.textContent = msg;
      t.className = "glass";
      t.style.cssText = `
        position: fixed; left: 50%; top: 18px; transform: translateX(-50%);
        padding: 12px 14px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.14);
        z-index: 1000; max-width: min(520px, calc(100% - 40px));
      `;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 2100);
    }
  
    loginForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("✅ Logged in (demo). Connect a backend to make this real.");
      setTimeout(() => location.href = "index.html", 600);
    });
  
    signupForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("✨ Account created (demo). Now wire it to a backend.");
      setTimeout(() => location.href = "login.html", 650);
    });
  })();
  