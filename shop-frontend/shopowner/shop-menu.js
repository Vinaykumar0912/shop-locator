// document.addEventListener("DOMContentLoaded", initialize);

// // ---------------- AUTH HELPERS ----------------
// function getToken() {
//     return localStorage.getItem("token");
// }

// function authHeaders() {
//     const token = getToken();
//     if (!token) throw new Error("No login token found");
//     return {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//     };
// }

// // ---------------- DOM ELEMENTS ----------------
// const backToHomeBtn = document.getElementById('back-to-home-btn');
// const shopNameHeader = document.getElementById('shop-name-header');
// const currentShopName = document.getElementById('current-shop-name');
// const shopPhoneDisplay = document.getElementById('shop-phone-display');
// const dashboardBtn = document.getElementById('dashboard-btn');
// const editShopBtn = document.getElementById('edit-shop-btn');
// const createBtn = document.getElementById('create-btn');

// // Modal Elements
// const modal = document.getElementById('modal');
// const modalMessage = document.getElementById('modal-message');
// const closeModal = document.querySelector('.close');

// let shopId = null;

// // ---------------- MODAL ----------------
// function showModal(message, type = 'info') {
//     modalMessage.textContent = message;
//     modalMessage.className = type;
//     modal.style.display = 'block';
// }

// if (closeModal) closeModal.addEventListener('click', () => modal.style.display = 'none');
// window.addEventListener('click', (event) => {
//     if (event.target === modal) modal.style.display = 'none';
// });

// // ---------------- INIT ----------------
// async function initialize() {
//     // 1. Check Auth
//     if (!getToken()) {
//         window.location.href = 'owner-login.html';
//         return;
//     }

//     // 2. Get Shop ID
//     const urlParams = new URLSearchParams(window.location.search);
//     shopId = urlParams.get('shop_id');

//     if (!shopId) {
//         showModal('No shop ID provided', 'error');
//         setTimeout(() => {
//             window.location.href = 'shophome.html';
//         }, 2000);
//         return;
//     }

//     // 3. Load Data
//     await loadShopData();
// }

// // ---------------- LOAD SHOP DATA ----------------
// async function loadShopData() {
//     try {
//         const res = await fetch(`http://localhost:4000/api/shops/${shopId}`, {
//             headers: authHeaders()
//         });

//         if (res.status === 401 || res.status === 403) {
//             throw new Error("Access denied. Please login again.");
//         }

//         if (res.status === 404) {
//             throw new Error("Shop not found");
//         }

//         if (!res.ok) throw new Error("Failed to load shop data");

//         const shop = await res.json();
//         updateShopDisplay(shop);

//     } catch (error) {
//         console.error('Error loading shop:', error);
//         showModal(error.message, 'error');
//         // If auth failed, redirect to login
//         if (error.message.includes("Access denied")) {
//             setTimeout(() => window.location.href = 'owner-login.html', 2000);
//         }
//     }
// }

// function updateShopDisplay(shop) {
//     shopNameHeader.textContent = `${shop.shop_name} - Menu`;
//     currentShopName.textContent = shop.shop_name;
//     shopPhoneDisplay.textContent = shop.phone_number || 'No phone number set';
// }

// // ---------------- EVENT LISTENERS ----------------
// backToHomeBtn.addEventListener('click', () => {
//     window.location.href = 'shophome.html';
// });

// dashboardBtn.addEventListener('click', () => {
//     if (shopId) window.location.href = `shopdashboard.html?shop_id=${shopId}`;
// });

// editShopBtn.addEventListener('click', () => {
//     if (shopId) window.location.href = `manage-shop.html?shop_id=${shopId}`;
// });

// createBtn.addEventListener('click', () => {
//     if (shopId) window.location.href = `create-item.html?shop_id=${shopId}`;
// });
document.addEventListener("DOMContentLoaded", initialize);

// ---------------- AUTH HELPERS ----------------
function getToken() {
    return localStorage.getItem("token");
}

function authHeaders() {
    const token = getToken();
    if (!token) throw new Error("No login token found");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

// ---------------- DOM ELEMENTS ----------------
const backToHomeBtn = document.getElementById('back-to-home-btn');
const shopNameHeader = document.getElementById('shop-name-header');
const currentShopName = document.getElementById('current-shop-name');
const shopPhoneDisplay = document.getElementById('shop-phone-display');
const dashboardBtn = document.getElementById('dashboard-btn');
const editShopBtn = document.getElementById('edit-shop-btn');
const createBtn = document.getElementById('create-btn');

// Modal Elements
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.querySelector('.close');

let shopId = null;

// ---------------- MODAL ----------------
function showModal(message, type = 'info') {
    modalMessage.textContent = message;
    modalMessage.className = type;
    modal.style.display = 'block';
}

if (closeModal) closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (event) => {
    if (event.target === modal) modal.style.display = 'none';
});

// ---------------- INIT ----------------
async function initialize() {
    // 1. Check Auth
    if (!getToken()) {
        window.location.href = 'owner-login.html';
        return;
    }

    // 2. Get Shop ID
    const urlParams = new URLSearchParams(window.location.search);
    shopId = urlParams.get('shop_id');

    if (!shopId) {
        showModal('No shop ID provided', 'error');
        setTimeout(() => {
            window.location.href = 'shophome.html';
        }, 2000);
        return;
    }

    // 3. Load Data
    await loadShopData();
}

// ---------------- LOAD SHOP DATA ----------------
async function loadShopData() {
    try {
        // ✅ FIXED: Pointing to Vercel instead of localhost
        const res = await fetch(`https://shop-locator-v2.vercel.app/api/shops/${shopId}`, {
            headers: authHeaders()
        });

        if (res.status === 401 || res.status === 403) {
            throw new Error("Access denied. Please login again.");
        }

        if (res.status === 404) {
            throw new Error("Shop not found");
        }

        if (!res.ok) throw new Error("Failed to load shop data");

        const shop = await res.json();
        updateShopDisplay(shop);

    } catch (error) {
        console.error('Error loading shop:', error);
        showModal(error.message, 'error');
        // If auth failed, redirect to login
        if (error.message.includes("Access denied")) {
            setTimeout(() => window.location.href = 'owner-login.html', 2000);
        }
    }
}

function updateShopDisplay(shop) {
    shopNameHeader.textContent = `${shop.shop_name} - Menu`;
    currentShopName.textContent = shop.shop_name;
    shopPhoneDisplay.textContent = shop.phone_number || 'No phone number set';
}

// ---------------- EVENT LISTENERS ----------------
if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', () => {
        window.location.href = 'shophome.html';
    });
}

if (dashboardBtn) {
    dashboardBtn.addEventListener('click', () => {
        if (shopId) window.location.href = `shopdashboard.html?shop_id=${shopId}`;
    });
}

if (editShopBtn) {
    editShopBtn.addEventListener('click', () => {
        if (shopId) window.location.href = `manage-shop.html?shop_id=${shopId}`;
    });
}

if (createBtn) {
    createBtn.addEventListener('click', () => {
        if (shopId) window.location.href = `create-item.html?shop_id=${shopId}`;
    });
}