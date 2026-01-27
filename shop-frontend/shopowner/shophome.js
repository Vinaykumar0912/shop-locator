
// document.addEventListener("DOMContentLoaded", initialize);

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

// // DOM Elements
// const shopList = document.getElementById('shop-list');
// const addShopBtn = document.getElementById('add-shop-btn');
// const logoutBtn = document.getElementById('logout-btn');
// const accountBtn = document.getElementById('account-btn');

// // ---------------- INIT ----------------
// async function initialize() {
//     if (!getToken()) {
//         window.location.href = 'owner-login.html';
//         return;
//     }

//     // Safety check: ensure elements exist before running logic
//     if (!shopList) {
//         console.error("CRITICAL ERROR: <div id='shop-list'> not found in HTML.");
//         return;
//     }

//     await loadShops();
// }

// // ---------------- LOAD SHOPS ----------------
// async function loadShops() {
//     try {
//         shopList.innerHTML = '<div class="loading">Loading shops...</div>';

//         const res = await fetch("http://localhost:4000/api/shops", {
//             headers: authHeaders()
//         });

//         if (res.status === 401) {
//             localStorage.removeItem("token");
//             window.location.href = 'owner-login.html';
//             return;
//         }

//         const shops = await res.json();

//         if (!shops || shops.length === 0) {
//             shopList.innerHTML = `
//                 <div class="no-shops">
//                     <p>You haven't created any shops yet.</p>
//                 </div>`;
//             return;
//         }

//         renderShops(shops);

//     } catch (error) {
//         console.error("Error loading shops:", error);
//         shopList.innerHTML = '<div class="error">Failed to load shops. Is the server running?</div>';
//     }
// }

// function renderShops(shops) {
//     shopList.innerHTML = '';
    
//     shops.forEach(shop => {
//         const card = document.createElement('div');
//         card.className = 'shop-card';
//         // When clicking a card, go to shop-menu with the ID
//         card.onclick = () => window.location.href = `shop-menu.html?shop_id=${shop.id}`;
        
//         card.innerHTML = `
//             <div class="shop-icon">🏪</div>
//             <h3>${shop.shop_name}</h3>
//             <p>${shop.address || 'No location set'}</p>
//             <div class="shop-meta">
//                 <span>${shop.phone_number || ''}</span>
//             </div>
//         `;
//         shopList.appendChild(card);
//     });
// }

// // ---------------- EVENTS ----------------
// if (addShopBtn) {
//     addShopBtn.addEventListener('click', () => {
//         window.location.href = 'manage-shop.html';
//     });
// }

// if (accountBtn) {
//     accountBtn.addEventListener('click', () => {
//         window.location.href = 'shopaccount.html';
//     });
// }

// if (logoutBtn) {
//     logoutBtn.addEventListener('click', () => {
//         localStorage.removeItem("token");
//         window.location.href = 'owner-login.html';
//     });
// }
document.addEventListener("DOMContentLoaded", initialize);

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

// DOM Elements
const shopList = document.getElementById('shop-list');
const addShopBtn = document.getElementById('add-shop-btn');
const logoutBtn = document.getElementById('logout-btn');
const accountBtn = document.getElementById('account-btn');

// ---------------- INIT ----------------
async function initialize() {
    if (!getToken()) {
        window.location.href = 'owner-login.html';
        return;
    }

    // Safety check: ensure elements exist before running logic
    if (!shopList) {
        console.error("CRITICAL ERROR: <div id='shop-list'> not found in HTML.");
        return;
    }

    await loadShops();
}

// ---------------- LOAD SHOPS ----------------
async function loadShops() {
    try {
        shopList.innerHTML = '<div class="loading">Loading shops...</div>';

        // ✅ FIXED: Pointing to Vercel
        const res = await fetch("https://shop-locator-v2.vercel.app/api/shops", {
            headers: authHeaders()
        });

        if (res.status === 401) {
            console.warn("Unauthorized! Redirecting to login...");
            localStorage.removeItem("token");
            window.location.href = 'owner-login.html';
            return;
        }

        const shops = await res.json();

        if (!shops || shops.length === 0) {
            shopList.innerHTML = `
                <div class="no-shops">
                    <p>You haven't created any shops yet.</p>
                </div>`;
            return;
        }

        renderShops(shops);

    } catch (error) {
        console.error("Error loading shops:", error);
        shopList.innerHTML = '<div class="error">Failed to load shops. Please try again later.</div>';
    }
}

function renderShops(shops) {
    shopList.innerHTML = '';
    
    shops.forEach(shop => {
        const card = document.createElement('div');
        card.className = 'shop-card';
        // When clicking a card, go to shop-menu with the ID
        card.onclick = () => window.location.href = `shop-menu.html?shop_id=${shop.id}`;
        
        card.innerHTML = `
            <div class="shop-icon">🏪</div>
            <h3>${shop.shop_name}</h3>
            <p>${shop.address || 'No location set'}</p>
            <div class="shop-meta">
                <span>${shop.phone_number || ''}</span>
            </div>
        `;
        shopList.appendChild(card);
    });
}

// ---------------- EVENTS ----------------
if (addShopBtn) {
    addShopBtn.addEventListener('click', () => {
        window.location.href = 'manage-shop.html';
    });
}

if (accountBtn) {
    accountBtn.addEventListener('click', () => {
        window.location.href = 'shopaccount.html';
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem("token");
        window.location.href = 'owner-login.html';
    });
}