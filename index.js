/* VPRO-TECH — site interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme (remembered between visits) ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  if (store.get("vpro-theme") === "light") document.body.classList.add("light");
  $$(".theme").forEach((btn) =>
    btn.addEventListener("click", () => {
      const light = document.body.classList.toggle("light");
      store.set("vpro-theme", light ? "light" : "dark");
      btn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    })
  );

  /* ---------- preloader ---------- */
  const loader = $(".loader");
  if (loader) {
    const hide = () => loader.classList.add("done");
    window.addEventListener("load", () => setTimeout(hide, 350));
    setTimeout(hide, 2500); // never block the page for long
  }

  /* ---------- nav: scrolled state, progress bar, back-to-top ---------- */
  const nav = $(".nav");
  const progress = $(".scroll-progress");
  const toTop = $(".to-top");
  const onScroll = () => {
    const y = window.scrollY;
    nav && nav.classList.toggle("scrolled", y > 30);
    if (progress) {
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    }
    toTop && toTop.classList.toggle("show", y > 700);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop && toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- mobile menu ---------- */
  const burger = $(".burger");
  if (burger) {
    const close = () => { document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); };
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    $$(".nav-links a").forEach((a) => a.addEventListener("click", close));
    addEventListener("keydown", (e) => e.key === "Escape" && close());
  }

  /* ---------- active section link on the home page ---------- */
  const sectionLinks = $$('.nav-links a[href^="#"]');
  if (sectionLinks.length && "IntersectionObserver" in window) {
    const map = new Map(sectionLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && map.has(en.target.id)) {
          sectionLinks.forEach((a) => a.classList.remove("active"));
          map.get(en.target.id).classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); s && spy.observe(s); });
  }

  /* ---------- scroll reveal ---------- */
  const reveals = $$(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- counters (10+, 100% …) ---------- */
  const counters = $$("[data-count]");
  const runCounter = (el) => {
    const end = Number(el.dataset.count), suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = end + suffix; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  } else counters.forEach(runCounter);

  /* ---------- typed role line in the hero ---------- */
  const role = $("[data-roles]");
  if (role) {
    const words = role.dataset.roles.split("|");
    const out = $(".txt", role);
    if (reduceMotion) out.textContent = words[0];
    else {
      let w = 0, i = 0, del = false;
      const step = () => {
        const word = words[w];
        i += del ? -1 : 1;
        out.textContent = word.slice(0, i);
        let wait = del ? 35 : 70;
        if (!del && i === word.length) { del = true; wait = 1600; }
        else if (del && i === 0) { del = false; w = (w + 1) % words.length; wait = 350; }
        setTimeout(step, wait);
      };
      setTimeout(step, 900);
    }
  }

  /* ---------- card spotlight follows the cursor ---------- */
  $$(".card").forEach((card) =>
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    })
  );

  /* ---------- testimonials carousel buttons ---------- */
  const reviews = $(".reviews");
  if (reviews) {
    const by = () => (reviews.firstElementChild ? reviews.firstElementChild.getBoundingClientRect().width + 22 : 380);
    $("#prevReview") && $("#prevReview").addEventListener("click", () => reviews.scrollBy({ left: -by(), behavior: "smooth" }));
    $("#nextReview") && $("#nextReview").addEventListener("click", () => reviews.scrollBy({ left: by(), behavior: "smooth" }));
  }

  /* ---------- footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- contact form ----------
     Today it sends through EmailJS. When the backend is ready, set
     data-endpoint="/api/contact" on the <form> and it will POST JSON there instead. */
  const form = $("#contactForm");
  if (form) {
    const status = $(".status", form);
    const btn = $("button[type=submit]", form);
    const label = $(".label", btn);
    const setStatus = (msg, kind) => { status.textContent = msg; status.className = "status " + (kind || ""); };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (form.website && form.website.value) return; // honeypot: bots fill hidden fields

      btn.disabled = true; btn.classList.add("loading"); label.textContent = "Sending…"; setStatus("", "");
      try {
        const endpoint = form.dataset.endpoint;
        if (endpoint) {
          const data = Object.fromEntries(new FormData(form).entries());
          delete data.website;
          const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error("Request failed");
        } else if (window.emailjs) {
          await window.emailjs.sendForm("service_xc7tke2", "template_eifhxxu", form);
        } else {
          throw new Error("Email service unavailable");
        }
        form.reset();
        setStatus("Thanks! Your message has been sent. We'll get back to you soon.", "ok");
      } catch (err) {
        setStatus("Sorry, your message didn't send. Please try again, or reach us on WhatsApp.", "err");
      } finally {
        btn.disabled = false; btn.classList.remove("loading"); label.textContent = "Send message";
      }
    });
  }
})();
