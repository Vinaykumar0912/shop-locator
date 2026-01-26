document.addEventListener("DOMContentLoaded", initialize);

// ---------------- AUTH ----------------
function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  if (!token) throw new Error("Invalid token");
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  };
}

// ---------------- DOM ----------------
const backBtn = document.getElementById("back-btn");
const shopForm = document.getElementById("shop-form");
const shopNameInput = document.getElementById("shop_name");
const phoneNumberInput = document.getElementById("phone_number");
const setLocationBtn = document.getElementById("set-location-btn");
const locationStatus = document.getElementById("location-status");
const deleteBtn = document.getElementById("delete-shop-btn");
const pageTitle = document.getElementById("page-title");

// Modal
const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");
const modalActions = document.getElementById("modal-actions");
const confirmDelete = document.getElementById("confirm-delete");
const cancelDelete = document.getElementById("cancel-delete");
const closeModal = document.querySelector(".close");

// ---------------- STATE ----------------
let shopId = null;
let locationData = null;
let isEditing = false;

// ---------------- MODAL ----------------
function showModal(message, type = "info", actions = false) {
  modalMessage.textContent = message;
  modalActions.style.display = actions ? "flex" : "none";
  modal.style.display = "block";
}
closeModal.onclick = () => modal.style.display = "none";
cancelDelete.onclick = () => modal.style.display = "none";

// ---------------- HELPERS ----------------
function updateLocationStatus() {
  if (locationData && locationData.latitude) {
    locationStatus.innerHTML = `✅ Location set: ${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}`;
  } else {
    locationStatus.innerHTML = "📍 Location not set";
  }
}

// ---------------- INIT ----------------
async function initialize() {
  if (!getToken()) {
    alert("Please login first");
    window.location.href = "owner-login.html";
    return;
  }

  shopId = new URLSearchParams(window.location.search).get("shop_id");

  // 1. CHECK FOR SAVED LOCATION FROM MAP PAGE
  const savedLocation = sessionStorage.getItem("shop_location");
  if (savedLocation) {
    try {
      locationData = JSON.parse(savedLocation);
      updateLocationStatus();
    } catch (e) {
      console.error("Error parsing saved location", e);
    }
  }

  if (shopId) {
    isEditing = true;
    pageTitle.textContent = "Edit Shop";
    deleteBtn.style.display = "inline-block";
    await loadShop();
  }
}

// ---------------- LOAD SHOP ----------------
async function loadShop() {
  try {
    const res = await fetch(`http://localhost:4000/api/shops/${shopId}`, {
      headers: authHeaders()
    });

    if (!res.ok) throw new Error("Failed to load shop");

    const shop = await res.json();

    shopNameInput.value = shop.shop_name;
    phoneNumberInput.value = shop.phone_number || "";

    // If we have an existing shop location AND we didn't just come from the map page
    if (!locationData && shop.latitude && shop.longitude) {
      locationData = {
        latitude: parseFloat(shop.latitude),
        longitude: parseFloat(shop.longitude)
      };
      updateLocationStatus();
    }
  } catch (err) {
    showModal(err.message, "error");
  }
}

// ---------------- LOCATION BUTTON ----------------
setLocationBtn.addEventListener("click", () => {
  if (shopId) {
    window.location.href = `add_shop_location.html?shop_id=${shopId}`;
  } else {
    window.location.href = "add_shop_location.html";
  }
});

// ---------------- SAVE SHOP ----------------
shopForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!shopNameInput.value.trim() || !locationData) {
    showModal("Shop name and Location are required", "error");
    return;
  }

  const payload = {
    shop_name: shopNameInput.value,
    phone_number: phoneNumberInput.value,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
    address: "Manual Location"
  };

  try {
    const res = await fetch(
      isEditing
        ? `http://localhost:4000/api/shops/${shopId}`
        : "http://localhost:4000/api/shops",
      {
        method: isEditing ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error saving shop");

    sessionStorage.removeItem("shop_location");

    showModal(
      isEditing ? "Shop updated successfully!" : "Shop created successfully!",
      "success"
    );

    setTimeout(() => {
      window.location.href = "shophome.html";
    }, 1200);

  } catch (err) {
    showModal(err.message, "error");
  }
});

// ---------------- DELETE SHOP ----------------
deleteBtn.addEventListener("click", () => {
  showModal("Are you sure?", "error", true);
});

confirmDelete.addEventListener("click", async () => {
  try {
    const res = await fetch(
      `http://localhost:4000/api/shops/${shopId}`,
      {
        method: "DELETE",
        headers: authHeaders()
      }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Delete failed");
    }

    showModal("Shop deleted successfully!", "success");

    setTimeout(() => {
      window.location.href = "shophome.html";
    }, 1200);

  } catch (err) {
    console.error("Delete Error:", err);
    showModal(err.message, "error");
  }
});

// ---------------- NAV ----------------
backBtn.addEventListener("click", () => window.history.back());
