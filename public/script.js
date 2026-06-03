const themeToggle = document.querySelector(".theme-toggle");
const themeStorageKey = "fateh_theme";

function setTheme(mode) {
  const dark = mode === "dark";
  document.body.classList.toggle("theme-dark", dark);
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
}

const savedTheme = localStorage.getItem(themeStorageKey);
setTheme(savedTheme === "dark" ? "dark" : "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
    localStorage.setItem(themeStorageKey, nextTheme);
    setTheme(nextTheme);
  });
}

const newsletterModal = document.querySelector(".newsletter-modal");
const newsletterForm = document.querySelector(".newsletter-form");
const newsletterSuccess = document.querySelector(".newsletter-success");
const footerNewsletterForm = document.querySelector(".footer-newsletter-form");
const footerNewsletterSuccess = document.querySelector(".footer-newsletter-success");
const newsletterStorageKey = "fateh_newsletter_subscribers";
const newsletterNextShowKey = "fateh_newsletter_next_show";
const newsletterWaitDays = 30;
const fatehFormEndpoint = String(window.FATEH_FORM_ENDPOINT || "").trim();
const newsletterThankYouText = "Thanks. You are subscribed for maintenance tips.";
const contactThankYouText = "Thanks. Your request has been sent. Fateh Plumbing & Electric will contact you soon.";

const siteSearchPages = [
  { title: "Emergency Plumber", url: "emergency-plumber.html", type: "Plumbing", terms: "24/7 urgent burst pipe leak sewer backup drain clogged water emergency plumber brampton" },
  { title: "Brampton Plumber", url: "brampton-plumber.html", type: "Plumbing Area", terms: "plumber in brampton plumbing service local drain leak water heater sewer toilet faucet sump pump" },
  { title: "Drain Cleaning", url: "drain-cleaning.html", type: "Plumbing", terms: "clogged drain sink toilet tub floor drain main drain sewer backup cleaning" },
  { title: "Leak Detection", url: "leak-detection.html", type: "Plumbing", terms: "hidden leak water stain ceiling leak pipe leak running meter damp wall" },
  { title: "Water Heater Repair", url: "water-heater-repair.html", type: "Plumbing", terms: "no hot water tank leak water heater repair replacement installation" },
  { title: "Sewer Line Repair", url: "sewer-line-repair.html", type: "Plumbing", terms: "sewer line backup main drain smell camera inspection underground pipe" },
  { title: "Pipe Repair", url: "pipe-repair.html", type: "Plumbing", terms: "burst pipe frozen pipe copper pex water line pipe replacement repair" },
  { title: "Toilet & Faucet Repair", url: "toilet-faucet-repair.html", type: "Plumbing", terms: "toilet running clogged faucet tap sink shower bathroom kitchen fixture" },
  { title: "Sump Pump Repair", url: "sump-pump-repair.html", type: "Plumbing", terms: "basement flood sump pump pit discharge backup pump repair" },
  { title: "Garbage Disposal Repair", url: "garbage-disposal-repair.html", type: "Plumbing", terms: "garburator garbage disposal kitchen sink jam leak repair" },
  { title: "Plumbing Services", url: "services.html", type: "Services", terms: "all plumbing services emergency drain water heater sewer leak pipe toilet faucet sump pump" },
  { title: "Emergency Electrician", url: "emergency-electrician.html", type: "Electrical", terms: "24/7 emergency electrician sparks breaker power loss burning smell unsafe wiring" },
  { title: "Brampton Electrician", url: "brampton-electrician.html", type: "Electrical Area", terms: "electrician in brampton electrical service repair panel lighting outlet switch ev charger" },
  { title: "Electrical Services", url: "electrical-services.html", type: "Electrical", terms: "electrical service repair outlet switch wiring lighting panel ev charger" },
  { title: "Panel Upgrade", url: "panel-upgrade.html", type: "Electrical", terms: "electrical panel upgrade breaker fuse box service upgrade" },
  { title: "EV Charger Installation", url: "ev-charger-installation.html", type: "Electrical", terms: "ev charger electric vehicle charging station tesla home charger installation" },
  { title: "Lighting & Smart Home", url: "lighting-smart-home.html", type: "Electrical", terms: "lighting pot lights smart switch dimmer fixture smart home" },
  { title: "Commercial Services", url: "commercial.html", type: "Commercial", terms: "commercial plumbing electrical restaurant retail property manager business maintenance" },
  { title: "Commercial Emergency", url: "commercial-emergency.html", type: "Commercial", terms: "commercial emergency plumbing electrical restaurant leak drain power business urgent" },
  { title: "Restaurant Plumbing", url: "restaurant-plumbing.html", type: "Commercial", terms: "restaurant plumbing food service kitchen drain grease trap commercial" },
  { title: "Commercial Kitchen Plumbing", url: "commercial-kitchen-plumbing.html", type: "Commercial", terms: "commercial kitchen plumbing sink drain restaurant food prep" },
  { title: "Grease Trap Cleaning", url: "grease-trap-cleaning.html", type: "Commercial", terms: "grease trap cleaning restaurant kitchen clogged grease interceptor" },
  { title: "Grease Trap Installation", url: "grease-trap-installation.html", type: "Commercial", terms: "grease trap installation restaurant kitchen compliance interceptor" },
  { title: "Backflow Prevention", url: "backflow-prevention.html", type: "Commercial", terms: "backflow prevention valve testing annual inspection commercial plumbing" },
  { title: "Maintenance Contracts", url: "maintenance-contracts.html", type: "Commercial", terms: "maintenance contract property manager recurring service commercial plumbing electrical" },
  { title: "Property Management Plumbing", url: "property-management-plumbing.html", type: "Commercial", terms: "property management plumbing rental condo tenant maintenance leak drain" },
  { title: "Sewer Camera Inspection", url: "sewer-camera-inspection.html", type: "Commercial", terms: "camera inspection sewer video drain scope pipe inspection" },
  { title: "Contact Fateh", url: "contact.html", type: "Contact", terms: "contact phone quote request service email call" },
  { title: "About Fateh", url: "about.html", type: "Company", terms: "about company fateh plumbing electric brampton" },
  { title: "Blog", url: "blog.html", type: "Help", terms: "blog plumbing electrical tips homeowner repair maintenance" },
];

function createSiteSearch(searchId, className) {
  const search = document.createElement("form");
  search.className = "site-search " + className;
  search.setAttribute("role", "search");
  search.innerHTML = [
    '<label class="sr-only" for="' + searchId + '">Search services</label>',
    '<div class="site-search-box">',
      '<span class="site-search-icon" aria-hidden="true">⌕</span>',
      '<input id="' + searchId + '" type="search" autocomplete="off" placeholder="Search service">',
    '</div>',
    '<div class="site-search-results" role="listbox" hidden></div>',
  ].join("");

  const input = search.querySelector("input");
  const results = search.querySelector(".site-search-results");
  if (!input || !results) return search;

  function scorePage(page, query) {
    const haystack = (page.title + " " + page.type + " " + page.terms).toLowerCase();
    const words = query.split(/\s+/).filter(Boolean);
    let score = 0;
    words.forEach((word) => {
      if (page.title.toLowerCase().includes(word)) score += 6;
      if (page.type.toLowerCase().includes(word)) score += 3;
      if (haystack.includes(word)) score += 1;
    });
    return score;
  }

  function renderSearch() {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      results.hidden = true;
      results.innerHTML = "";
      return;
    }

    const matches = siteSearchPages
      .map((page) => ({ ...page, score: scorePage(page, query) }))
      .filter((page) => page.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 7);

    if (!matches.length) {
      results.hidden = false;
      results.innerHTML = '<p class="site-search-empty">No match. Try drain, leak, panel, EV, or emergency.</p>';
      return;
    }

    results.hidden = false;
    results.innerHTML = matches.map((page) => (
      '<a href="' + page.url + '" role="option">' +
        '<strong>' + page.title + '</strong>' +
        '<span>' + page.type + '</span>' +
      '</a>'
    )).join("");
  }

  search.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstResult = results.querySelector("a");
    if (firstResult) window.location.href = firstResult.getAttribute("href");
  });
  input.addEventListener("input", renderSearch);
  input.addEventListener("focus", renderSearch);
  document.addEventListener("click", (event) => {
    if (!search.contains(event.target)) results.hidden = true;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") results.hidden = true;
  });

  return search;
}

function setupSiteSearch() {
  const header = document.querySelector(".site-header");
  const topBarInner = document.querySelector(".top-bar-inner");
  const nav = document.querySelector("#site-nav");
  if (!header || header.querySelector(".site-search")) return;

  if (topBarInner && !topBarInner.querySelector(".site-search-desktop")) {
    const emergencyPill = topBarInner.querySelector(".emergency-pill");
    const desktopSearch = createSiteSearch("site-search-desktop-input", "site-search-desktop");
    if (desktopSearch) {
      if (emergencyPill) {
        topBarInner.insertBefore(desktopSearch, emergencyPill);
      } else {
        topBarInner.appendChild(desktopSearch);
      }
    }
  }

  if (nav && !nav.querySelector(".site-search-mobile")) {
    const mobileSearch = createSiteSearch("site-search-mobile-input", "site-search-mobile");
    if (mobileSearch) nav.insertBefore(mobileSearch, nav.firstChild);
  }
}

setupSiteSearch();

function storeLocal(collectionKey, item, limit) {
  try {
    const existing = JSON.parse(localStorage.getItem(collectionKey) || "[]");
    localStorage.setItem(collectionKey, JSON.stringify([item, ...existing].slice(0, limit)));
  } catch (error) {
    localStorage.setItem(collectionKey, JSON.stringify([item]));
  }
}

async function submitWebsiteLead(payload) {
  if (!fatehFormEndpoint) return false;
  await fetch(fatehFormEndpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      ...payload,
      pageUrl: window.location.href,
      userAgent: window.navigator.userAgent,
    }),
  });
  return true;
}

document.querySelectorAll(".site-footer").forEach((footer) => {
  if (footer.querySelector('a[href="disclaimer.html"]')) return;
  const mainLinks = footer.querySelector(".footer-links");
  if (mainLinks) {
    const item = document.createElement("li");
    item.innerHTML = '<a href="disclaimer.html">Disclaimer</a>';
    mainLinks.appendChild(item);
  }
  const fineprint = footer.querySelector(".footer-fineprint");
  if (fineprint) {
    fineprint.insertAdjacentHTML("beforeend", ' <a href="disclaimer.html">Disclaimer</a>');
  }
});

function scheduleNewsletterReminder() {
  const nextShow = Date.now() + newsletterWaitDays * 24 * 60 * 60 * 1000;
  localStorage.setItem(newsletterNextShowKey, String(nextShow));
}

function closeNewsletter() {
  if (!newsletterModal) return;
  newsletterModal.hidden = true;
  scheduleNewsletterReminder();
}

function shouldShowNewsletter() {
  const nextShow = Number(localStorage.getItem(newsletterNextShowKey) || "0");
  return Date.now() > nextShow;
}

if (newsletterModal && shouldShowNewsletter()) {
  window.setTimeout(() => {
    newsletterModal.hidden = false;
  }, 15000);
}

document.querySelectorAll("[data-newsletter-close]").forEach((button) => {
  button.addEventListener("click", closeNewsletter);
});

if (newsletterForm) {
  if (newsletterSuccess) newsletterSuccess.textContent = newsletterThankYouText;
  newsletterForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(newsletterForm);
    const signup = {
      sourceForm: "Newsletter Signup",
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      consent: "Express consent for seasonal plumbing and electrical tips plus promotional emails under CASL wording shown on form.",
      submittedAt: new Date().toLocaleString(),
    };
    storeLocal(newsletterStorageKey, signup, 100);
    try { await submitWebsiteLead(signup); } catch (error) { console.warn("Newsletter sync failed", error); }
    scheduleNewsletterReminder();
    if (newsletterSuccess) newsletterSuccess.hidden = false;
    window.setTimeout(() => {
      if (newsletterModal) newsletterModal.hidden = true;
    }, 1400);
  });
}

if (footerNewsletterForm) {
  if (footerNewsletterSuccess) footerNewsletterSuccess.textContent = newsletterThankYouText;
  footerNewsletterForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(footerNewsletterForm);
    const signup = {
      sourceForm: "Newsletter Signup",
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      consent: "Footer signup consent for promotional emails under CASL wording shown on form.",
      submittedAt: new Date().toLocaleString(),
    };
    storeLocal(newsletterStorageKey, signup, 100);
    try { await submitWebsiteLead(signup); } catch (error) { console.warn("Newsletter sync failed", error); }
    scheduleNewsletterReminder();
    if (footerNewsletterSuccess) footerNewsletterSuccess.hidden = false;
    footerNewsletterForm.reset();
  });
}

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");

// LOCKED HEADER AREA: this block controls the screenshot header/menu behavior.
// Keep it stable unless Amrik explicitly asks to redesign the header area.
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
}

const desktopMegaQuery = window.matchMedia("(min-width: 981px)");
const megaWraps = Array.from(document.querySelectorAll(".mega-wrap"));

function closeDesktopMegaMenus(exceptWrap) {
  megaWraps.forEach((wrap) => {
    if (wrap === exceptWrap) return;
    wrap.classList.remove("active");
    const trigger = wrap.querySelector(".mega-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  });
}

function setMegaMenuTop(wrap) {
  const menu = wrap.querySelector(".mega-menu");
  const trigger = wrap.querySelector(".mega-trigger");
  if (!menu || !trigger) return;
  const triggerRect = trigger.getBoundingClientRect();
  menu.style.setProperty("--mega-menu-top", Math.round(triggerRect.bottom + 22) + "px");
}

megaWraps.forEach((wrap) => {
  const trigger = wrap.querySelector(".mega-trigger");
  if (!trigger) return;

  wrap.addEventListener("mouseenter", () => {
    if (desktopMegaQuery.matches) setMegaMenuTop(wrap);
  });

  trigger.addEventListener("click", (event) => {
    if (!desktopMegaQuery.matches) {
      const open = wrap.classList.toggle("mobile-open");
      trigger.setAttribute("aria-expanded", String(open));
      return;
    }

    event.preventDefault();
    setMegaMenuTop(wrap);
    const open = !wrap.classList.contains("active");
    closeDesktopMegaMenus(wrap);
    wrap.classList.toggle("active", open);
    trigger.setAttribute("aria-expanded", String(open));
  });
});

document.addEventListener("click", (event) => {
  if (!desktopMegaQuery.matches) return;
  if (event.target.closest(".mega-wrap")) return;
  closeDesktopMegaMenus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDesktopMegaMenus();
});

document.querySelectorAll(".mega-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    const wrap = link.closest(".mega-wrap");
    if (!wrap) return;
    wrap.classList.remove("active", "mobile-open");
    const trigger = wrap.querySelector(".mega-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-review-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".review-track");
  const cards = Array.from(carousel.querySelectorAll(".review-card"));
  const prev = carousel.querySelector("[data-review-prev]");
  const next = carousel.querySelector("[data-review-next]");
  const dots = carousel.querySelector(".review-dots");
  if (!track || !cards.length || !prev || !next || !dots) return;

  let index = 0;
  let timer;

  function visibleCards() {
    if (window.matchMedia("(max-width: 620px)").matches) return 1;
    if (window.matchMedia("(max-width: 980px)").matches) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCards());
  }

  function renderDots() {
    const count = maxIndex() + 1;
    dots.innerHTML = Array.from({ length: count }, (_, dotIndex) => (
      '<button class="review-dot" type="button" aria-label="Show review set ' + (dotIndex + 1) + '"></button>'
    )).join("");
    Array.from(dots.children).forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => show(dotIndex));
    });
  }

  function show(nextIndex) {
    index = Math.max(0, Math.min(nextIndex, maxIndex()));
    track.style.transform = "translateX(-" + cards[index].offsetLeft + "px)";
    Array.from(dots.children).forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  }

  function start() {
    window.clearInterval(timer);
    timer = window.setInterval(() => {
      show(index >= maxIndex() ? 0 : index + 1);
    }, 5200);
  }

  prev.addEventListener("click", () => {
    show(index <= 0 ? maxIndex() : index - 1);
    start();
  });
  next.addEventListener("click", () => {
    show(index >= maxIndex() ? 0 : index + 1);
    start();
  });
  carousel.addEventListener("mouseenter", () => window.clearInterval(timer));
  carousel.addEventListener("mouseleave", start);
  window.addEventListener("resize", () => {
    renderDots();
    show(index);
  });

  renderDots();
  show(0);
  start();
});

const form = document.querySelector(".contact-form");
const inquiryList = document.querySelector(".inquiry-list");
const storageKey = "fateh_quote_requests";

function getRequests() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch (error) {
    return [];
  }
}

function saveRequest(request) {
  const requests = [request, ...getRequests()].slice(0, 20);
  localStorage.setItem(storageKey, JSON.stringify(requests));
  renderRequests();
}

function renderRequests() {
  if (!inquiryList) return;
  const requests = getRequests();
  if (!requests.length) {
    inquiryList.innerHTML = "<p>No test quote requests saved yet.</p>";
    return;
  }
  inquiryList.innerHTML = requests.map((request) => (
    '<article class="inquiry-item">' +
      '<h3>' + request.service + '</h3>' +
      '<p><strong>Name:</strong> ' + request.name + '</p>' +
      '<p><strong>Phone:</strong> ' + request.phone + '</p>' +
      '<p><strong>Message:</strong> ' + request.message + '</p>' +
      '<p><strong>Submitted:</strong> ' + request.submittedAt + '</p>' +
    '</article>'
  )).join("");
}

renderRequests();

if (form) {
  const success = form.querySelector(".success-message");
  if (success) success.textContent = contactThankYouText;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const request = {
      sourceForm: "Contact Form",
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      service: String(data.get("service") || "").trim(),
      message: String(data.get("message") || "").trim(),
      consent: "Requested service contact through website form.",
      submittedAt: new Date().toLocaleString(),
    };
    saveRequest(request);
    let synced = false;
    try { synced = await submitWebsiteLead(request); } catch (error) { console.warn("Contact sync failed", error); }
    if (success) success.hidden = false;
    if (synced) {
      form.reset();
      return;
    }
    const subject = encodeURIComponent("Plumbing service request");
    const body = encodeURIComponent(
      "Name: " + request.name + "\n" +
      "Phone: " + request.phone + "\n" +
      "Service: " + request.service + "\n" +
      "Submitted: " + request.submittedAt + "\n\n" +
      request.message
    );
    window.location.href = "mailto:info@fatehplumelec.com?subject=" + subject + "&body=" + body;
  });
}
