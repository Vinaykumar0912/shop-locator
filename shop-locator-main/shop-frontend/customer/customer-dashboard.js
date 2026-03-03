
// document.addEventListener("DOMContentLoaded", initialize);

// // ---------------- CONFIGURATION ----------------
// const API_BASE_URL = "http://localhost:4000/api/customer";
// const DEFAULT_LOCATION = { lat: 20.5937, lng: 78.9629 }; 

// // ---------------- STATE ----------------
// let userLocation = null;

// // ---------------- AUTH HELPERS ----------------
// function getToken() { return localStorage.getItem("token"); }

// function authHeaders() {
//     return { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` };
// }

// // ---------------- DOM ELEMENTS ----------------
// const loginBtn = document.getElementById('login-btn');
// const logoutBtn = document.getElementById('logout-btn');
// const searchForm = document.getElementById('search-form');
// const searchInput = document.getElementById('search-input');
// const refreshLocationBtn = document.getElementById('refresh-location-btn');
// const nearbyItemsContainer = document.getElementById('nearby-items');
// const searchResultsContainer = document.getElementById('search-results');
// const searchResultsHeader = document.getElementById('search-results-header');
// const resultsCount = document.getElementById('results-count');
// const recentlyViewedContainer = document.getElementById('recently-viewed');
// const noResults = document.getElementById('no-results');

// const modal = document.getElementById('modal');
// const modalMessage = document.getElementById('modal-message');
// const closeModal = document.querySelector('.close');

// // ---------------- INIT ----------------
// async function initialize() {
//     const token = getToken();
    
//     if (token) {
//         if(loginBtn) loginBtn.style.display = 'none';
//         if(logoutBtn) logoutBtn.style.display = 'block';
//     } else {
//         window.location.href = "customer-login.html";
//         return;
//     }

//     await refreshLocation(); 
//     await loadRecentlyViewed();
// }


// // ---------------- LOCATION LOGIC ----------------
// async function refreshLocation() {
//     renderLoading(nearbyItemsContainer, "Acquiring location...");

//     if (!navigator.geolocation) {
//         useDefaultLocation();
//         return;
//     }

//     navigator.geolocation.getCurrentPosition(
//         async (pos) => {
//             userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
//             await loadNearbyItems();
//         },
//         async (err) => {
//             console.warn("Location failed, using default.");
//             useDefaultLocation();
//         },
//         { timeout: 5000 }
//     );
// }

// async function useDefaultLocation() {
//     userLocation = DEFAULT_LOCATION;
//     await loadNearbyItems();
// }

// // ---------------- FETCH: NEARBY ITEMS ----------------
// async function loadNearbyItems() {
//     try {
//         const url = `${API_BASE_URL}/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}`;
//         const res = await fetch(url, { headers: authHeaders() });

//         if (!res.ok) throw new Error("Failed to load nearby items");

//         const items = await res.json();
        
//         if (items.length === 0) {
//             nearbyItemsContainer.innerHTML = '<div class="no-items"><p>No items found nearby.</p></div>';
//         } else {
//             renderItems(items, nearbyItemsContainer);
//         }
//     } catch (err) {
//         console.error(err);
//         nearbyItemsContainer.innerHTML = '<div class="error-msg">Could not load items. Check server.</div>';
//     }
// }

// // ---------------- FETCH: SEARCH ----------------
// if (searchForm) {
//     searchForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const query = searchInput.value.trim();
//         if (!query) return;

//         if (!userLocation) userLocation = DEFAULT_LOCATION;

//         try {
//             if (searchResultsHeader) searchResultsHeader.style.display = 'block';
//             renderLoading(searchResultsContainer, `Searching...`);
//             if (noResults) noResults.style.display = 'none';

//             const url = `${API_BASE_URL}/search?item=${encodeURIComponent(query)}&lat=${userLocation.lat}&lng=${userLocation.lng}`;
//             const res = await fetch(url, { headers: authHeaders() });

//             if (!res.ok) throw new Error("Search failed");

//             const items = await res.json();
            
//             if (resultsCount) resultsCount.textContent = `${items.length} found`;
            
//             if (items.length === 0) {
//                 searchResultsContainer.innerHTML = '';
//                 if (noResults) noResults.style.display = 'block';
//             } else {
//                 if (noResults) noResults.style.display = 'none';
//                 renderItems(items, searchResultsContainer);
//             }

//         } catch (err) {
//             console.error(err);
//             searchResultsContainer.innerHTML = '<div class="error-msg">Search failed.</div>';
//         }
//     });
// }

// // ---------------- FETCH: RECENTLY VIEWED ----------------
// async function loadRecentlyViewed() {
//     let recentIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
//     recentIds = recentIds.filter(id => id && id.length > 10); // Safety check

//     if (recentIds.length === 0) {
//         recentlyViewedContainer.innerHTML = '<p class="empty-msg">No recently viewed items.</p>';
//         return;
//     }

//     try {
//         const url = `${API_BASE_URL}/list?ids=${recentIds.join(',')}`;
//         const res = await fetch(url, { headers: authHeaders() });
        
//         if (!res.ok) return;

//         const items = await res.json();
//         renderItems(items, recentlyViewedContainer);
//     } catch (err) {
//         console.error(err);
//     }
// }

// // ---------------- UI: RENDER HELPERS (FIXED BUTTONS) ----------------
// function renderLoading(container, message) {
//     container.innerHTML = `<div class="loading-state"><p>${message}</p></div>`;
// }

// function renderItems(items, container) {
//     container.innerHTML = '';
    
//     items.forEach(item => {
//         const card = document.createElement('div');
//         card.className = 'item-card'; 
        
//         let imgHTML = `<div class="item-image-placeholder">📦</div>`;
//         if (item.image_url) {
//             imgHTML = `<img src="${item.image_url}" alt="${item.item_name}" class="item-image" onerror="this.parentElement.innerHTML='<div class=\\'item-image-placeholder\\'>📦</div>'">`;
//         }

//         const distanceHtml = item.distance 
//             ? `<span class="distance-badge">📍 ${item.distance} km</span>` : '';

//         // ✅ FIXED: Added TWO distinct buttons
//         card.innerHTML = `
//             <div class="item-content">
//                 <div class="item-header">
//                     <h3 class="item-name">${item.item_name}</h3>
//                     <span class="shop-name">🏪 ${item.shop_name || 'Shop'}</span>
//                 </div>
//                 <div class="item-details">
//                     <span class="stock-badge">${item.quantity} ${item.unit_type}</span>
//                     ${distanceHtml}
//                 </div>
                
//                 <div class="item-actions" style="display: flex; gap: 10px; margin-top: 10px;">
//                     <button class="view-btn btn btn-sm btn-primary" style="flex: 1;">Detail</button>
//                     <button class="locate-btn btn btn-sm btn-outline" style="flex: 1;">Location</button>
//                 </div>
//             </div>
//         `;
        
//         // 1️⃣ DETAIL BUTTON CLICK
//         const detailBtn = card.querySelector('.view-btn');
//         detailBtn.onclick = (e) => {
//             e.stopPropagation(); // Prevent accidental clicks
//             addToRecent(item.id);
//             window.location.href = `product.html?item_id=${item.id}`;
//         };

//         // 2️⃣ LOCATION BUTTON CLICK
//         const locateBtn = card.querySelector('.locate-btn');
//         locateBtn.onclick = (e) => {
//             e.stopPropagation();
//             window.location.href = `location.html?shop_id=${item.shop_id}`;
//         };

//         container.appendChild(card);
//     });
// }

// function addToRecent(itemId) {
//     let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
//     recent = recent.filter(id => id !== itemId);
//     recent.unshift(itemId);
//     localStorage.setItem('recentlyViewed', JSON.stringify(recent.slice(0, 5)));
// }

// // ---------------- EVENTS ----------------
// if (closeModal) closeModal.onclick = () => modal.style.display = 'none';
// window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

// if (refreshLocationBtn) refreshLocationBtn.onclick = refreshLocation;
// if (logoutBtn) logoutBtn.onclick = () => {
//     localStorage.removeItem('token');
//     window.location.href = '../index.html';
// };
document.addEventListener("DOMContentLoaded", initialize);

// ---------------- CONFIGURATION ----------------
// ✅ FIXED: Points to your live Vercel Backend
const API_BASE_URL = "https://shop-locator-v2.vercel.app/api/customer";
const DEFAULT_LOCATION = { lat: 20.5937, lng: 78.9629 }; 

// ---------------- STATE ----------------
let userLocation = null;

// ---------------- AUTH HELPERS ----------------
function getToken() { return localStorage.getItem("token"); }

function authHeaders() {
    return { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${getToken()}` 
    };
}

// ---------------- DOM ELEMENTS ----------------
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const refreshLocationBtn = document.getElementById('refresh-location-btn');
const nearbyItemsContainer = document.getElementById('nearby-items');
const searchResultsContainer = document.getElementById('search-results');
const searchResultsHeader = document.getElementById('search-results-header');
const resultsCount = document.getElementById('results-count');
const recentlyViewedContainer = document.getElementById('recently-viewed');
const noResults = document.getElementById('no-results');

const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.querySelector('.close');

// ---------------- INIT ----------------
async function initialize() {
    const token = getToken();
    
    if (token) {
        if(loginBtn) loginBtn.style.display = 'none';
        if(logoutBtn) logoutBtn.style.display = 'block';
    } else {
        window.location.href = "customer-login.html";
        return;
    }

    await refreshLocation(); 
    await loadRecentlyViewed();
}


// ---------------- LOCATION LOGIC ----------------
async function refreshLocation() {
    if (nearbyItemsContainer) {
        renderLoading(nearbyItemsContainer, "Acquiring location...");
    }

    if (!navigator.geolocation) {
        useDefaultLocation();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            await loadNearbyItems();
        },
        async (err) => {
            console.warn("Location failed, using default.");
            useDefaultLocation();
        },
        { timeout: 5000 }
    );
}

async function useDefaultLocation() {
    userLocation = DEFAULT_LOCATION;
    await loadNearbyItems();
}

// ---------------- FETCH: NEARBY ITEMS ----------------
async function loadNearbyItems() {
    if (!nearbyItemsContainer) return;
    try {
        const url = `${API_BASE_URL}/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}`;
        const res = await fetch(url, { headers: authHeaders() });

        if (!res.ok) throw new Error("Failed to load nearby items");

        const items = await res.json();
        
        if (items.length === 0) {
            nearbyItemsContainer.innerHTML = '<div class="no-items"><p>No items found nearby.</p></div>';
        } else {
            renderItems(items, nearbyItemsContainer);
        }
    } catch (err) {
        console.error(err);
        nearbyItemsContainer.innerHTML = '<div class="error-msg">Could not load items. Check server connection.</div>';
    }
}

// ---------------- FETCH: SEARCH ----------------
if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        if (!userLocation) userLocation = DEFAULT_LOCATION;

        try {
            if (searchResultsHeader) searchResultsHeader.style.display = 'block';
            if (searchResultsContainer) renderLoading(searchResultsContainer, `Searching...`);
            if (noResults) noResults.style.display = 'none';

            const url = `${API_BASE_URL}/search?item=${encodeURIComponent(query)}&lat=${userLocation.lat}&lng=${userLocation.lng}`;
            const res = await fetch(url, { headers: authHeaders() });

            if (!res.ok) throw new Error("Search failed");

            const items = await res.json();
            
            if (resultsCount) resultsCount.textContent = `${items.length} found`;
            
            if (items.length === 0) {
                if (searchResultsContainer) searchResultsContainer.innerHTML = '';
                if (noResults) noResults.style.display = 'block';
            } else {
                if (noResults) noResults.style.display = 'none';
                if (searchResultsContainer) renderItems(items, searchResultsContainer);
            }

        } catch (err) {
            console.error(err);
            if (searchResultsContainer) searchResultsContainer.innerHTML = '<div class="error-msg">Search failed.</div>';
        }
    });
}

// ---------------- FETCH: RECENTLY VIEWED ----------------
async function loadRecentlyViewed() {
    if (!recentlyViewedContainer) return;

    let recentIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    recentIds = recentIds.filter(id => id && id.length > 10); 

    if (recentIds.length === 0) {
        recentlyViewedContainer.innerHTML = '<p class="empty-msg">No recently viewed items.</p>';
        return;
    }

    try {
        const url = `${API_BASE_URL}/list?ids=${recentIds.join(',')}`;
        const res = await fetch(url, { headers: authHeaders() });
        
        if (!res.ok) return;

        const items = await res.json();
        renderItems(items, recentlyViewedContainer);
    } catch (err) {
        console.error(err);
    }
}

// ---------------- UI: RENDER HELPERS ----------------
function renderLoading(container, message) {
    container.innerHTML = `<div class="loading-state"><p>${message}</p></div>`;
}

function renderItems(items, container) {
    container.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card'; 
        
        let imgHTML = `<div class="item-image-placeholder">📦</div>`;
        if (item.image_url) {
            imgHTML = `<img src="${item.image_url}" alt="${item.item_name}" class="item-image" onerror="this.parentElement.innerHTML='<div class=\\'item-image-placeholder\\'>📦</div>'">`;
        }

        const distanceHtml = item.distance 
            ? `<span class="distance-badge">📍 ${item.distance} km</span>` : '';

        card.innerHTML = `
            <div class="item-content">
                <div class="item-header">
                    <h3 class="item-name">${item.item_name}</h3>
                    <span class="shop-name">🏪 ${item.shop_name || 'Shop'}</span>
                </div>
                <div class="item-details">
                    <span class="stock-badge">${item.quantity} ${item.unit_type}</span>
                    ${distanceHtml}
                </div>
                
                <div class="item-actions" style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="view-btn btn btn-sm btn-primary" style="flex: 1;">Detail</button>
                    <button class="locate-btn btn btn-sm btn-outline" style="flex: 1;">Location</button>
                </div>
            </div>
        `;
        
        // 1️⃣ DETAIL BUTTON CLICK
        const detailBtn = card.querySelector('.view-btn');
        detailBtn.onclick = (e) => {
            e.stopPropagation(); 
            addToRecent(item.id);
            window.location.href = `product.html?item_id=${item.id}`;
        };

        // 2️⃣ LOCATION BUTTON CLICK
        const locateBtn = card.querySelector('.locate-btn');
        locateBtn.onclick = (e) => {
            e.stopPropagation();
            window.location.href = `location.html?shop_id=${item.shop_id}`;
        };

        container.appendChild(card);
    });
}

function addToRecent(itemId) {
    let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    recent = recent.filter(id => id !== itemId);
    recent.unshift(itemId);
    localStorage.setItem('recentlyViewed', JSON.stringify(recent.slice(0, 5)));
}

// ---------------- EVENTS ----------------
if (closeModal) closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

if (refreshLocationBtn) refreshLocationBtn.onclick = refreshLocation;
if (logoutBtn) logoutBtn.onclick = () => {
    localStorage.removeItem('token');
    window.location.href = '../index.html';
};