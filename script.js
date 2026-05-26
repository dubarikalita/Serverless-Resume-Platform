const API_ENDPOINT = "https://9plnr9k4c0.execute-api.ap-south-1.amazonaws.com/prod/count";
async function updateVisitorCount() {
  const el = document.getElementById("visitor-count");

  if (!el) {
    return;
  }

  if (!API_ENDPOINT || API_ENDPOINT === "YOUR_API_GATEWAY_URL_HERE") {
    el.textContent = "-";
    el.title = "API endpoint not configured yet. See script.js";
    return;
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    el.textContent = Number(data.count).toLocaleString();
    el.classList.add("loaded");
  } catch (err) {
    console.error("Visitor counter error:", err);
    el.textContent = "-";
  }
}

document.addEventListener("DOMContentLoaded", updateVisitorCount);
