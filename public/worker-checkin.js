(() => {
  const endpoint = String(window.FATEH_WORKER_CHECKIN_ENDPOINT || "").trim();
  const googleMapsApiKey = String(window.FATEH_GOOGLE_MAPS_API_KEY || "").trim();
  const fallbackPins = window.FATEH_WORKER_FALLBACK_PINS || {};
  const form = document.querySelector("[data-worker-checkin-form]");

  if (!form) return;

  const clock = document.querySelector("[data-worker-clock]");
  const status = document.querySelector("[data-worker-status]");
  const confirmation = document.querySelector("[data-worker-confirmation]");
  const pinInput = form.querySelector('[name="pin"]');
  const workerNameInput = form.querySelector('[name="workerName"]');
  const submitButton = form.querySelector('button[type="submit"]');
  let activeWorker = null;
  let lookupTimer = null;

  function setStatus(message, state = "neutral") {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function generateConfirmationNumber() {
    const bytes = new Uint8Array(5);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
    }

    return `FJ-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
  }

  function formatMoney(value) {
    const number = Number(String(value || "").replace(/[^0-9.-]/g, ""));
    if (!Number.isFinite(number)) return "$0.00";
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(number);
  }

  function showConfirmation(payload) {
    if (!confirmation) return;

    const submittedAt = new Intl.DateTimeFormat("en-CA", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Toronto",
    }).format(new Date());

    confirmation.hidden = false;
    confirmation.innerHTML = `
      <p class="worker-confirmation-label">Submission Saved</p>
      <h2>${escapeHtml(payload.confirmationNumber)}</h2>
      <dl>
        <div>
          <dt>Contractor</dt>
          <dd>${escapeHtml(payload.workerName)}</dd>
        </div>
        <div>
          <dt>Job</dt>
          <dd>${escapeHtml(payload.jobType)}</dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>${escapeHtml(payload.jobAddress)}</dd>
        </div>
        <div>
          <dt>Payment</dt>
          <dd>${formatMoney(payload.paymentReceived)} ${escapeHtml(payload.paymentType)}</dd>
        </div>
        <div>
          <dt>Submitted</dt>
          <dd>${escapeHtml(submittedAt)}</dd>
        </div>
      </dl>
      <p class="worker-confirmation-note">Please take a screenshot for your records.</p>
    `;
  }

  function updateClock() {
    if (!clock) return;
    const formatter = new Intl.DateTimeFormat("en-CA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Toronto",
    });
    clock.textContent = formatter.format(new Date());
  }

  function loadGooglePlaces() {
    return new Promise((resolve, reject) => {
      if (!googleMapsApiKey) {
        resolve(null);
        return;
      }

      if (window.google && window.google.maps && window.google.maps.places) {
        resolve(window.google.maps);
        return;
      }

      const existing = document.querySelector("[data-google-places-loader]");
      if (existing) {
        existing.addEventListener("load", () => resolve(window.google && window.google.maps), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.dataset.googlePlacesLoader = "true";
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(googleMapsApiKey)}&libraries=places`;
      script.onload = () => resolve(window.google && window.google.maps);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function setupAddressAutocomplete() {
    const addressInput = form.querySelector("[data-address-autocomplete]");
    if (!addressInput) return;

    try {
      const maps = await loadGooglePlaces();
      if (!maps || !maps.places) return;

      const autocomplete = new maps.places.Autocomplete(addressInput, {
        componentRestrictions: { country: "ca" },
        fields: ["formatted_address", "name"],
        types: ["address"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          addressInput.value = place.formatted_address;
        }
      });
    } catch (error) {
      // Keep the plain address input available if Google Places cannot load.
    }
  }

  function setWorker(workerName) {
    activeWorker = workerName ? { workerName } : null;
    workerNameInput.value = workerName || "";
    submitButton.disabled = !activeWorker;
  }

  function jsonpWorkerLookup(pin) {
    return new Promise((resolve, reject) => {
      if (!endpoint) {
        resolve(null);
        return;
      }

      const callbackName = `__fatehWorkerLookup${Date.now()}${Math.floor(Math.random() * 10000)}`;
      const script = document.createElement("script");
      const url = new URL(endpoint);
      url.searchParams.set("action", "worker");
      url.searchParams.set("pin", pin);
      url.searchParams.set("callback", callbackName);

      function cleanup() {
        delete window[callbackName];
        script.remove();
      }

      window[callbackName] = (data) => {
        cleanup();
        resolve(data);
      };

      script.onerror = () => {
        cleanup();
        reject(new Error("Contractor lookup failed"));
      };

      script.src = url.toString();
      document.body.appendChild(script);
    });
  }

  async function lookupPin() {
    const pin = pinInput.value.trim();
    setWorker("");

    if (!pin) {
      setStatus("Enter your PIN to unlock the form.");
      return;
    }

    if (fallbackPins[pin]) {
      setWorker(fallbackPins[pin]);
      setStatus(`Contractor found: ${fallbackPins[pin]}`, "success");
      return;
    }

    try {
      setStatus("Checking PIN...");
      const result = await jsonpWorkerLookup(pin);
      if (result && result.ok && result.workerName) {
        setWorker(result.workerName);
        setStatus(`Contractor found: ${result.workerName}`, "success");
        return;
      }
      setStatus(endpoint ? "PIN not found or inactive." : "PIN not found. Add contractors in the config or connect Google Apps Script.", "error");
    } catch (error) {
      setStatus("PIN lookup failed. Please try again.", "error");
    }
  }

  function debounceLookup() {
    window.clearTimeout(lookupTimer);
    lookupTimer = window.setTimeout(lookupPin, 250);
  }

  function getPayload() {
    const data = new FormData(form);
    return {
      sourceForm: "Contractor Job Portal",
      confirmationNumber: generateConfirmationNumber(),
      submittedAtLocal: new Date().toISOString(),
      pin: String(data.get("pin") || "").trim(),
      workerName: workerNameInput.value.trim(),
      customerName: String(data.get("customerName") || "").trim(),
      jobAddress: String(data.get("jobAddress") || "").trim(),
      jobType: String(data.get("jobType") || "").trim(),
      paymentReceived: String(data.get("paymentReceived") || "").trim(),
      paymentType: String(data.get("paymentType") || "Cash").trim(),
      workerJobCost: String(data.get("workerJobCost") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
    };
  }

  async function submitPayload(payload) {
    if (!endpoint) {
      const saved = JSON.parse(localStorage.getItem("fatehWorkerPreviewEntries") || "[]");
      saved.push(payload);
      localStorage.setItem("fatehWorkerPreviewEntries", JSON.stringify(saved));
      return;
    }

    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  }

  pinInput.addEventListener("input", debounceLookup);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!activeWorker) {
      setStatus("Please enter a valid contractor PIN first.", "error");
      pinInput.focus();
      return;
    }

    const payload = getPayload();
    if (!payload.jobAddress || !payload.jobType || !payload.paymentReceived) {
      setStatus("Please complete address, job type, and payment received.", "error");
      return;
    }

    submitButton.disabled = true;
    setStatus("Submitting job entry...");
    if (confirmation) confirmation.hidden = true;

    try {
      await submitPayload(payload);
      const currentPin = pinInput.value;
      const currentWorkerName = workerNameInput.value;
      form.reset();
      pinInput.value = currentPin;
      workerNameInput.value = currentWorkerName;
      form.querySelector('[name="paymentType"]').value = "Cash";
      setWorker(currentWorkerName);
      showConfirmation(payload);
      setStatus(endpoint ? "Saved. Screenshot your confirmation below." : "Saved in this preview. Screenshot your confirmation below.", "success");
    } catch (error) {
      submitButton.disabled = false;
      setStatus("Submission failed. Please check connection and try again.", "error");
    }
  });

  updateClock();
  window.setInterval(updateClock, 1000);
  setupAddressAutocomplete();
})();
