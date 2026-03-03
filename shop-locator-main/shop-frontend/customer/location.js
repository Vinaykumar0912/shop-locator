// const backBtn = document.getElementById('back-btn');
// let map = null;
// let routingControl = null;

// // ---------------- AUTH HELPERS ----------------
// function getToken() { return localStorage.getItem("token"); }

// function authHeaders() {
//     return { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` };
// }

// // ---------------- INIT ----------------
// document.addEventListener("DOMContentLoaded", async () => {
//     if (!getToken()) {
//         window.location.href = 'customer-login.html';
//         return;
//     }
    
//     initMap();
//     await loadShopLocation();
// });

// function initMap() {
//     // 1. Initialize Map
//     map = L.map('map').setView([20.5937, 78.9629], 5);
    
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap'
//     }).addTo(map);

//     // 2. Fix for "Tracking Prevention" / Missing Icon warnings
//     // This forces Leaflet to use standard icons without checking 3rd party storage
//     delete L.Icon.Default.prototype._getIconUrl;
//     L.Icon.Default.mergeOptions({
//         iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//         iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//         shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//     });
// }

// // ---------------- LOAD DATA ----------------
// async function loadShopLocation() {
//     const shopId = new URLSearchParams(window.location.search).get('shop_id');
    
//     if (!shopId) {
//         alert("No shop specified");
//         return;
//     }

//     try {
//         // Fetch Shop Data
//         const res = await fetch(`http://localhost:4000/api/customer/shop/${shopId}`, {
//             headers: authHeaders()
//         });

//         if (!res.ok) throw new Error("Shop not found");
//         const shop = await res.json();

//         // Coordinates
//         const shopLat = parseFloat(shop.latitude);
//         const shopLng = parseFloat(shop.longitude);

//         // ---------------- ROUTING LOGIC ----------------
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(pos => {
//                 const userLat = pos.coords.latitude;
//                 const userLng = pos.coords.longitude;

//                 // Remove old route if exists
//                 if (routingControl) map.removeControl(routingControl);

//                 // ✅ FIX: Draw Route without looking for missing HTML elements
//                 routingControl = L.Routing.control({
//                     waypoints: [
//                         L.latLng(userLat, userLng), // Start (User)
//                         L.latLng(shopLat, shopLng)  // End (Shop)
//                     ],
//                     routeWhileDragging: false,
//                     showAlternatives: false,
//                     fitSelectedRoutes: true, // Zoom to fit route
//                     lineOptions: {
//                         styles: [{ color: '#2563eb', weight: 6, opacity: 0.8 }]
//                     },
//                     // Disable the text box to prevent layout errors
//                     show: true, 
//                     createMarker: function(i, wp, nWps) {
//                         // Create custom markers for Start (User) and End (Shop)
//                         if (i === 0) {
//                             return L.marker(wp.latLng).bindPopup("<b>You are here</b>");
//                         } else {
//                             return L.marker(wp.latLng).bindPopup(`<b>${shop.shop_name}</b><br>${shop.address}`);
//                         }
//                     }
//                 }).addTo(map);

//             }, (err) => {
//                 console.warn("User location denied. Showing shop only.");
//                 showShopOnly(shopLat, shopLng, shop);
//             });
//         } else {
//             showShopOnly(shopLat, shopLng, shop);
//         }

//     } catch (err) {
//         console.error(err);
//         alert("Error loading location");
//     }
// }

// function showShopOnly(lat, lng, shop) {
//     L.marker([lat, lng]).addTo(map)
//         .bindPopup(`<b>${shop.shop_name}</b><br>${shop.address}`)
//         .openPopup();
//     map.setView([lat, lng], 15);
// }

// backBtn.addEventListener('click', () => window.history.back());
const backBtn = document.getElementById('back-btn');
let map = null;
let routingControl = null;

// ---------------- AUTH HELPERS ----------------
function getToken() { return localStorage.getItem("token"); }

function authHeaders() {
    return { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` };
}

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", async () => {
    if (!getToken()) {
        window.location.href = 'customer-login.html';
        return;
    }
    
    initMap();
    await loadShopLocation();
});

function initMap() {
    // 1. Initialize Map
    map = L.map('map').setView([20.5937, 78.9629], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // 2. Fix for "Tracking Prevention" / Missing Icon warnings
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

// ---------------- LOAD DATA ----------------
async function loadShopLocation() {
    const shopId = new URLSearchParams(window.location.search).get('shop_id');
    
    if (!shopId) {
        alert("No shop specified");
        return;
    }

    try {
        // ✅ FIXED: Pointing to Vercel instead of localhost
        const res = await fetch(`https://shop-locator-v2.vercel.app/api/customer/shop/${shopId}`, {
            headers: authHeaders()
        });

        if (!res.ok) throw new Error("Shop not found");
        const shop = await res.json();

        // Coordinates
        const shopLat = parseFloat(shop.latitude);
        const shopLng = parseFloat(shop.longitude);

        // ---------------- ROUTING LOGIC ----------------
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                const userLat = pos.coords.latitude;
                const userLng = pos.coords.longitude;

                // Remove old route if exists
                if (routingControl) map.removeControl(routingControl);

                // ✅ Draw Route
                routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(userLat, userLng), // Start (User)
                        L.latLng(shopLat, shopLng)  // End (Shop)
                    ],
                    routeWhileDragging: false,
                    showAlternatives: false,
                    fitSelectedRoutes: true, 
                    lineOptions: {
                        styles: [{ color: '#2563eb', weight: 6, opacity: 0.8 }]
                    },
                    show: true, 
                    createMarker: function(i, wp, nWps) {
                        if (i === 0) {
                            return L.marker(wp.latLng).bindPopup("<b>You are here</b>");
                        } else {
                            return L.marker(wp.latLng).bindPopup(`<b>${shop.shop_name}</b><br>${shop.address}`);
                        }
                    }
                }).addTo(map);

            }, (err) => {
                console.warn("User location denied. Showing shop only.");
                showShopOnly(shopLat, shopLng, shop);
            });
        } else {
            showShopOnly(shopLat, shopLng, shop);
        }

    } catch (err) {
        console.error(err);
        alert("Error loading location");
    }
}

function showShopOnly(lat, lng, shop) {
    if (!map) return;
    L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>${shop.shop_name}</b><br>${shop.address}`)
        .openPopup();
    map.setView([lat, lng], 15);
}

if (backBtn) {
    backBtn.addEventListener('click', () => window.history.back());
}