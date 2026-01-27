
// document.addEventListener("DOMContentLoaded", initialize);

// function getToken() { return localStorage.getItem("token"); }
// function authHeaders() {
//     const token = getToken();
//     if (!token) throw new Error("No login token found");
//     return { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };
// }

// const backBtn = document.getElementById('back-btn');
// const fullNameInput = document.getElementById('full_name');
// const emailInput = document.getElementById('email');
// const totalShopsEl = document.getElementById('total-shops');
// const totalItemsEl = document.getElementById('total-items');

// async function initialize() {
//     if (!getToken()) {
//         window.location.href = 'owner-login.html';
//         return;
//     }
//     await loadProfile();
//     await loadStats();
// }

// // 1. Load Profile (Name/Email)
// async function loadProfile() {
//     try {
//         const res = await fetch("http://localhost:4000/api/auth/me", { headers: authHeaders() });
//         if (res.ok) {
//             const user = await res.json();
//             fullNameInput.value = user.full_name || user.name || ""; 
//             emailInput.value = user.email || "";
//         }
//     } catch (err) {
//         console.error("Profile Load Error", err);
//     }
// }

// // 2. Load Stats (Shops & Items)
// async function loadStats() {
//     try {
//         // Get Shops Count
//         const resShops = await fetch("http://localhost:4000/api/shops", { headers: authHeaders() });
//         if (resShops.ok) {
//             const shops = await resShops.json();
//             totalShopsEl.textContent = shops.length;
//         }

//         // Get Total Items Count (Using the new route)
//         const resItems = await fetch("http://localhost:4000/api/items/all/count", { headers: authHeaders() });
//         if (resItems.ok) {
//             const data = await resItems.json();
//             totalItemsEl.textContent = data.count;
//         }
//     } catch (err) {
//         console.error("Stats Load Error", err);
//     }
// }

// backBtn.addEventListener('click', () => window.history.back());
// // Disable form submission for now
// document.getElementById('account-form').addEventListener('submit', (e) => e.preventDefault());
document.addEventListener("DOMContentLoaded", initialize);

function getToken() { return localStorage.getItem("token"); }
function authHeaders() {
    const token = getToken();
    if (!token) throw new Error("No login token found");
    return { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };
}

const backBtn = document.getElementById('back-btn');
const fullNameInput = document.getElementById('full_name');
const emailInput = document.getElementById('email');
const totalShopsEl = document.getElementById('total-shops');
const totalItemsEl = document.getElementById('total-items');

async function initialize() {
    if (!getToken()) {
        window.location.href = 'owner-login.html';
        return;
    }
    await loadProfile();
    await loadStats();
}

// 1. Load Profile (Name/Email)
async function loadProfile() {
    try {
        // ✅ FIXED: Pointing to Vercel
        const res = await fetch("https://shop-locator-v2.vercel.app/api/auth/me", { headers: authHeaders() });
        if (res.ok) {
            const user = await res.json();
            fullNameInput.value = user.full_name || user.name || ""; 
            emailInput.value = user.email || "";
        }
    } catch (err) {
        console.error("Profile Load Error", err);
    }
}

// 2. Load Stats (Shops & Items)
async function loadStats() {
    try {
        // Get Shops Count
        // ✅ FIXED: Pointing to Vercel
        const resShops = await fetch("https://shop-locator-v2.vercel.app/api/shops", { headers: authHeaders() });
        if (resShops.ok) {
            const shops = await resShops.json();
            totalShopsEl.textContent = shops.length;
        }

        // Get Total Items Count (Using the new route)
        // ✅ FIXED: Pointing to Vercel
        const resItems = await fetch("https://shop-locator-v2.vercel.app/api/items/all/count", { headers: authHeaders() });
        if (resItems.ok) {
            const data = await resItems.json();
            totalItemsEl.textContent = data.count;
        }
    } catch (err) {
        console.error("Stats Load Error", err);
    }
}

if (backBtn) {
    backBtn.addEventListener('click', () => window.history.back());
}

// Disable form submission for now
const accountForm = document.getElementById('account-form');
if (accountForm) {
    accountForm.addEventListener('submit', (e) => e.preventDefault());
}