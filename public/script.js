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
  { title: "Emergency Plumber", url: "emergency-plumber.html", type: "Plumbing", terms: "emergency plumber brampton emergency plumber near me 24 hour plumber 24 7 plumber same day plumber urgent plumber emergency plumbing services emergency drain service" },
  { title: "Brampton Plumber", url: "brampton-plumber.html", type: "Plumbing Area", terms: "plumber in brampton plumbing service local drain leak water heater sewer toilet faucet sump pump" },
  { title: "Drain Cleaning", url: "drain-cleaning.html", type: "Plumbing", terms: "clogged drain sink toilet tub floor drain main drain sewer backup cleaning" },
  { title: "Kitchen Sink Installation", url: "kitchen-sink-installation.html", type: "Plumbing", terms: "kitchen sink installation brampton sink installation undermount drop in plumber replace kitchen sink faucet drain hookup" },
  { title: "Clogged Kitchen Sink", url: "clogged-kitchen-sink.html", type: "Plumbing", terms: "clogged kitchen sink brampton kitchen sink drain cleaning slow kitchen sink grease clogged kitchen drain not draining" },
  { title: "Faucet Repair", url: "faucet-repair.html", type: "Plumbing", terms: "faucet repair brampton kitchen faucet repair leaky faucet tap repair faucet replacement dripping tap" },
  { title: "Bathroom Plumbing", url: "bathroom-plumbing.html", type: "Plumbing", terms: "bathroom plumbing brampton bathroom plumber toilet sink shower tub faucet fixture leak repair" },
  { title: "Toilet Repair", url: "toilet-repair.html", type: "Plumbing", terms: "toilet repair brampton running toilet leaking toilet weak flush toilet replacement installation wax ring loose toilet" },
  { title: "Bidet Installation", url: "bidet-installation.html", type: "Plumbing", terms: "bidet installation brampton bidet installation near me plumber to install bidet toilet bidet attachment bidet sprayer bathroom fixture installation" },
  { title: "Laundry Tub Installation", url: "laundry-tub-installation.html", type: "Plumbing", terms: "laundry tub installation brampton laundry sink installation utility sink installation laundry tub plumbing laundry room sink laundry tub drain basement laundry plumbing" },
  { title: "Clogged Toilet", url: "clogged-toilet.html", type: "Plumbing", terms: "clogged toilet brampton blocked toilet toilet overflow toilet not flushing toilet backup gurgling" },
  { title: "Clogged Sink", url: "clogged-sink.html", type: "Plumbing", terms: "clogged sink brampton bathroom sink clogged vanity sink drain slow sink drain pop up stopper trap" },
  { title: "Leak Detection", url: "leak-detection.html", type: "Plumbing", terms: "leak detection brampton leak detection near me water leak detection water leak repair water leak repair near me pipe leak repair plumbing leak detection hidden leak ceiling leak" },
  { title: "Water Heater Repair", url: "water-heater-repair.html", type: "Plumbing", terms: "water heater repair brampton water heater repair near me hot water heater repair no hot water leaking tank replacement installation" },
  { title: "Tankless Water Heater", url: "tankless-water-heater.html", type: "Plumbing", terms: "tankless water heater brampton on demand water heater tankless installation repair continuous instant water heater" },
  { title: "Reverse Osmosis System", url: "reverse-osmosis-system.html", type: "Plumbing", terms: "ro system installation reverse osmosis water filter filtration under sink drinking water kitchen faucet installation brampton" },
  { title: "Sewer Line Repair", url: "sewer-line-repair.html", type: "Plumbing", terms: "sewer line repair brampton sewer repair near me sewer line replacement trenchless sewer line repair trenchless pipe repair sewer pipe replacement cost main sewer line backup" },
  { title: "Sewer Camera Inspection", url: "sewer-camera-inspection.html", type: "Plumbing", terms: "sewer camera inspection brampton sewer camera drain camera plumbing camera inspection sewer line inspection sewer scope inspection pipe camera recurring backup" },
  { title: "Backwater Valve", url: "backwater-valve.html", type: "Plumbing", terms: "backwater valve brampton backwater valve installation sewer backup prevention basement flood prevention backwater valve service" },
  { title: "Basement Plumbing", url: "basement-plumbing.html", type: "Plumbing", terms: "basement plumbing brampton basement bathroom plumbing rough in plumbing basement water leak repair foundation leak repair basement drain sump pump repair" },
  { title: "Pipe Repair", url: "pipe-repair.html", type: "Plumbing", terms: "pipe repair brampton pipe leak repair water pipe repair plumbing leak repair burst pipe frozen pipe copper pex pipe replacement" },
  { title: "Burst Pipe Repair", url: "burst-pipe-repair.html", type: "Plumbing", terms: "burst pipe repair brampton frozen pipe frozen water pipes plumbing frozen pipes emergency water leak repair pipe split thawed pipe leak" },
  { title: "Main Drain Backup", url: "main-drain-backup.html", type: "Plumbing", terms: "main drain backup brampton basement main drain backup main drain backing up in basement main sewer line backup main plumbing line backed up emergency drain service" },
  { title: "Toilet & Faucet Repair", url: "toilet-faucet-repair.html", type: "Plumbing", terms: "toilet running clogged bathroom faucet tap sink shower bathroom fixture" },
  { title: "Sump Pump Repair", url: "sump-pump-repair.html", type: "Plumbing", terms: "sump pump repair brampton basement flood sump pump pit float switch discharge backup pump repair" },
  { title: "Water Softener", url: "water-softener.html", type: "Plumbing", terms: "water softener brampton water softener system water conditioning system hard water scale softener installation" },
  { title: "Water Service Upgrade", url: "water-service-upgrade.html", type: "Plumbing", terms: "water service upgrade brampton main water line upgrade low water pressure water supply service line" },
  { title: "Garbage Disposal Repair", url: "garbage-disposal-repair.html", type: "Plumbing", terms: "garbage disposal repair brampton garburator repair garbage disposal installation kitchen disposal leaking humming not working" },
  { title: "Plumbing Services", url: "services.html", type: "Services", terms: "all plumbing services emergency drain water heater sewer leak pipe toilet faucet sump pump" },
  { title: "Emergency Electrician", url: "emergency-electrician.html", type: "Electrical", terms: "24/7 emergency electrician sparks breaker power loss burning smell unsafe wiring" },
  { title: "Brampton Electrician", url: "brampton-electrician.html", type: "Electrical Area", terms: "electrician in brampton electrical service repair panel lighting outlet switch ev charger" },
  { title: "Electrical Services", url: "electrical-services.html", type: "Electrical", terms: "electrical service repair outlet switch wiring lighting panel ev charger" },
  { title: "Electrical Panel Upgrade", url: "panel-upgrade.html", type: "Electrical", terms: "electrical panel upgrade breaker fuse box service upgrade" },
  { title: "EV Charger Installation", url: "ev-charger-installation.html", type: "Electrical", terms: "ev charger electric vehicle charging station tesla home charger installation" },
  { title: "Generator Installation", url: "generator-installation.html", type: "Electrical", terms: "generator installation backup generator home generator generator electrician backup power" },
  { title: "Subpanel Installation", url: "subpanel-installation.html", type: "Electrical", terms: "subpanel installation electrical subpanel panel expansion garage workshop basement circuits" },
  { title: "Surge Protection", url: "surge-protection.html", type: "Electrical", terms: "surge protection whole home surge protector panel surge protector electrical surge protection" },
  { title: "Pot Light Installation", url: "pot-light-installation.html", type: "Electrical", terms: "pot light installation recessed lighting indoor outdoor soffit pot lights electrician" },
  { title: "Ceiling Fan Installation", url: "ceiling-fan-installation.html", type: "Electrical", terms: "ceiling fan installation fan replacement fan wiring bedroom living room basement electrician" },
  { title: "Smart Home Wiring", url: "smart-home-wiring.html", type: "Electrical", terms: "smart home wiring smart switch dimmer motion sensor speaker wiring automation electrician" },
  { title: "Outdoor Lighting", url: "outdoor-lighting.html", type: "Electrical", terms: "outdoor lighting exterior lighting security motion sensor porch garage patio pathway electrician" },
  { title: "Driveway Lighting", url: "driveway-lighting.html", type: "Electrical", terms: "driveway lighting garage exterior lights pathway lighting motion sensor outdoor lighting electrician" },
  { title: "New Construction Electrician", url: "new-construction-electrician.html", type: "Electrical", terms: "new construction electrician rough in wiring new build addition garage basement electrical" },
  { title: "Electrical Repair", url: "electrical-repair.html", type: "Electrical", terms: "electrical repair outlet switch breaker light troubleshooting partial power brampton electrician" },
  { title: "House Rewiring", url: "house-rewiring.html", type: "Electrical", terms: "house rewiring older wiring renovation wiring outlet lighting circuit electrical brampton" },
  { title: "Outlet & Switch Install", url: "outlet-switch-install.html", type: "Electrical", terms: "outlet installation switch install dimmer smart switch timer gfci electrical brampton" },
  { title: "Electrical Safety Inspection", url: "electrical-safety-inspection.html", type: "Electrical", terms: "electrical safety inspection panel breaker outlet wiring older home renovation brampton" },
  { title: "Smoke & CO Detectors", url: "smoke-co-detectors.html", type: "Electrical", terms: "smoke detector carbon monoxide co detector installation replacement hardwired alarm brampton" },
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

const plumbingMegaMenuHtml = [
  '<div><h2><span class="menu-icon">♨</span> Kitchen & Laundry</h2>',
    '<a href="kitchen-sink-installation.html">Kitchen Sink Installation</a>',
    '<a href="clogged-kitchen-sink.html">Clogged Kitchen Sink</a>',
    '<a href="faucet-repair.html">Kitchen Faucet Repair</a>',
    '<a href="garbage-disposal-repair.html">Garbage Disposal Repair</a>',
    '<a href="laundry-tub-installation.html">Laundry Tub Installation</a>',
  '</div>',
  '<div><h2><span class="menu-icon">♧</span> Bathroom & Fixtures</h2>',
    '<a href="bathroom-plumbing.html">Bathroom Plumbing</a>',
    '<a href="toilet-repair.html">Toilet Repair</a>',
    '<a href="bidet-installation.html">Bidet Installation</a>',
    '<a href="faucet-repair.html">Faucet Repair</a>',
    '<a href="clogged-toilet.html">Clogged Toilet</a>',
    '<a href="clogged-sink.html">Clogged Sink</a>',
  '</div>',
  '<div><h2><span class="menu-icon">♢</span> Drains & Sewers</h2>',
    '<a href="drain-cleaning.html">Drain Cleaning</a>',
    '<a href="sewer-line-repair.html">Sewer Line Repair</a>',
    '<a href="sewer-camera-inspection.html">Sewer Camera Inspection</a>',
    '<a href="backwater-valve.html">Backwater Valve</a>',
    '<a href="basement-plumbing.html">Basement Plumbing</a>',
  '</div>',
  '<div><h2><span class="menu-icon">♢</span> Water & Systems</h2>',
    '<a href="water-heater-repair.html">Water Heater Repair</a>',
    '<a href="tankless-water-heater.html">Tankless Water Heater</a>',
    '<a href="reverse-osmosis-system.html">RO System Installation</a>',
    '<a href="sump-pump-repair.html">Sump Pump Repair</a>',
    '<a href="water-softener.html">Water Softener</a>',
    '<a href="water-service-upgrade.html">Water Service Upgrade</a>',
  '</div>',
  '<div><h2><span class="menu-icon danger-icon">△</span> Emergencies</h2>',
    '<a href="emergency-plumber.html">Emergency Plumber</a>',
    '<a href="leak-detection.html">Leak Detection</a>',
    '<a href="pipe-repair.html">Pipe Repair</a>',
    '<a href="burst-pipe-repair.html">Burst Pipe Repair</a>',
    '<a href="main-drain-backup.html">Main Drain Backup</a>',
  '</div>',
  '<div class="mega-footer">',
    '<p>Burst pipe, blocked drain, leak, or no hot water? Fateh Plumbing & Electric serves Brampton and nearby GTA communities.</p>',
    '<a class="button" href="tel:+16479809211">Call 647-980-9211</a>',
  '</div>',
].join("");

function setupPlumbingMegaMenu() {
  document.querySelectorAll(".plumbing-menu").forEach((menu) => {
    menu.innerHTML = plumbingMegaMenuHtml;
  });
}

setupPlumbingMegaMenu();

const electricalMegaMenuHtml = [
  '<div><h2>Panels & Power</h2>',
    '<a href="panel-upgrade.html">Electrical Panel Upgrade</a>',
    '<a href="ev-charger-installation.html">EV Charger Installation</a>',
    '<a href="generator-installation.html">Generator Installation</a>',
    '<a href="subpanel-installation.html">Subpanel Installation</a>',
    '<a href="surge-protection.html">Surge Protection</a>',
  '</div>',
  '<div><h2>Wiring & Repair</h2>',
    '<a href="electrical-repair.html">Electrical Repair</a>',
    '<a href="new-construction-electrician.html">New Construction Electrician</a>',
    '<a href="house-rewiring.html">House Rewiring</a>',
    '<a href="outlet-switch-install.html">Outlet &amp; Switch Install</a>',
  '</div>',
  '<div><h2>Lighting &amp; Smart Home</h2>',
    '<a href="pot-light-installation.html">Pot Light Installation</a>',
    '<a href="lighting-smart-home.html">Lighting Installation</a>',
    '<a href="ceiling-fan-installation.html">Ceiling Fan Installation</a>',
    '<a href="smart-home-wiring.html">Smart Home Wiring</a>',
    '<a href="outdoor-lighting.html">Outdoor Lighting</a>',
    '<a href="driveway-lighting.html">Driveway Lighting</a>',
  '</div>',
  '<div><h2>Emergency &amp; Safety</h2>',
    '<a href="emergency-electrician.html">Emergency Electrician</a>',
    '<a href="electrical-safety-inspection.html">Electrical Safety Inspection</a>',
    '<a href="smoke-co-detectors.html">Smoke &amp; CO Detectors</a>',
    '<a class="all-electrical-link" href="electrical-services.html">All Electrical Services →</a>',
  '</div>',
  '<div class="mega-cta">',
    '<h2>Electrical Service</h2>',
    '<p>Panel, EV, wiring, lighting and emergency electrical support.</p>',
    '<a class="button" href="contact.html">Free On-Site Assessment</a>',
  '</div>',
].join("");

function setupElectricalMegaMenu() {
  document.querySelectorAll(".electrical-menu").forEach((menu) => {
    menu.innerHTML = electricalMegaMenuHtml;
  });
}

setupElectricalMegaMenu();

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

function setupPremiumHomepageMotion() {
  const homeHero = document.querySelector(".home-hero");
  if (!homeHero) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealItems = Array.from(document.querySelectorAll(".reveal-on-scroll"));
  const staggerGroups = Array.from(document.querySelectorAll(".stagger-group"));

  staggerGroups.forEach((group) => {
    Array.from(group.children).forEach((item, index) => {
      item.style.setProperty("--stagger-delay", Math.min(index * 110, 520) + "ms");
    });
  });

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    staggerGroups.forEach((group) => group.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("motion-ready");
  homeHero.querySelectorAll(".reveal-on-scroll, .stagger-group").forEach((item) => item.classList.add("is-visible"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  });

  revealItems.forEach((item) => observer.observe(item));
  staggerGroups.forEach((group) => observer.observe(group));
}

setupPremiumHomepageMotion();

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");

// LOCKED HEADER AREA: this block controls the screenshot header/menu behavior.
// Keep it stable unless Amrik explicitly asks to redesign the header area.
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    if (!open) {
      megaWraps.forEach((wrap) => {
        wrap.classList.remove("mobile-open");
        const trigger = wrap.querySelector(".mega-trigger");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
    }
  });
}

const desktopMegaQuery = window.matchMedia("(min-width: 981px)");
const megaWraps = Array.from(document.querySelectorAll(".mega-wrap"));
let desktopMegaCloseTimer = null;

function closeDesktopMegaMenus(exceptWrap) {
  megaWraps.forEach((wrap) => {
    if (wrap === exceptWrap) return;
    wrap.classList.remove("active");
    const trigger = wrap.querySelector(".mega-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  });
}

function cancelDesktopMegaClose() {
  if (desktopMegaCloseTimer) {
    window.clearTimeout(desktopMegaCloseTimer);
    desktopMegaCloseTimer = null;
  }
}

function scheduleDesktopMegaClose() {
  if (!desktopMegaQuery.matches) return;
  cancelDesktopMegaClose();
  desktopMegaCloseTimer = window.setTimeout(() => closeDesktopMegaMenus(), 120);
}

function openDesktopMegaMenu(wrap) {
  if (!desktopMegaQuery.matches) return;
  cancelDesktopMegaClose();
  closeDesktopMegaMenus(wrap);
  wrap.classList.add("active");
  const trigger = wrap.querySelector(".mega-trigger");
  if (trigger) trigger.setAttribute("aria-expanded", "true");
}

megaWraps.forEach((wrap) => {
  const trigger = wrap.querySelector(".mega-trigger");
  const menu = wrap.querySelector(".mega-menu");
  if (!trigger) return;

  wrap.addEventListener("mouseenter", () => openDesktopMegaMenu(wrap));
  wrap.addEventListener("mouseleave", scheduleDesktopMegaClose);
  if (menu) {
    menu.addEventListener("mouseenter", cancelDesktopMegaClose);
    menu.addEventListener("mouseleave", scheduleDesktopMegaClose);
  }
  trigger.addEventListener("focus", () => openDesktopMegaMenu(wrap));

    trigger.addEventListener("click", (event) => {
      if (!desktopMegaQuery.matches) {
        event.preventDefault();
        megaWraps.forEach((otherWrap) => {
          if (otherWrap === wrap) return;
          otherWrap.classList.remove("mobile-open");
          const otherTrigger = otherWrap.querySelector(".mega-trigger");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        });
        const open = wrap.classList.toggle("mobile-open");
        trigger.setAttribute("aria-expanded", String(open));
        return;
      }

    event.preventDefault();
    const open = !wrap.classList.contains("active");
    closeDesktopMegaMenus(wrap);
    if (open) {
      wrap.classList.add("active");
    } else {
      wrap.classList.remove("active");
    }
    trigger.setAttribute("aria-expanded", String(open));
  });
});

if (nav) {
  nav.addEventListener("mouseleave", scheduleDesktopMegaClose);
  nav.querySelectorAll(":scope > a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (desktopMegaQuery.matches) closeDesktopMegaMenus();
    });
    link.addEventListener("focus", () => {
      if (desktopMegaQuery.matches) closeDesktopMegaMenus();
    });
  });
}

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
