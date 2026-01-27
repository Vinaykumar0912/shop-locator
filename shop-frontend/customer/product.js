
// document.addEventListener("DOMContentLoaded", loadProduct);

// // ---------------- AUTH HELPERS ----------------
// function getToken() { return localStorage.getItem("token"); }

// function authHeaders() {
//     return { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` };
// }

// // ---------------- DOM ELEMENTS ----------------
// const productName = document.getElementById('product-name');
// const shopName = document.getElementById('shop-name');
// const shopPhone = document.getElementById('shop-phone');
// const productStock = document.getElementById('product-stock');
// const productDescription = document.getElementById('product-description');
// const productImage = document.getElementById('product-image');
// const imagePlaceholder = document.getElementById('image-placeholder');
// const locateBtn = document.getElementById('locate-shop-btn');
// const backBtn = document.getElementById('back-to-dashboard-btn');

// let currentShopId = null;

// // ---------------- LOAD PRODUCT ----------------
// async function loadProduct() {
//     if (!getToken()) {
//         window.location.href = 'customer-login.html';
//         return;
//     }

//     // Get ID from URL (e.g., product.html?item_id=123)
//     const itemId = new URLSearchParams(window.location.search).get('item_id');
    
//     if (!itemId) {
//         alert("No item specified");
//         return;
//     }

//     try {
//         // ✅ CORRECT API ENDPOINT
//         const res = await fetch(`http://localhost:4000/api/customer/item/${itemId}`, {
//             headers: authHeaders()
//         });

//         if (!res.ok) throw new Error("Product not found");

//         const item = await res.json();
        
//         // --- FILL UI ---
//         productName.textContent = item.item_name;
//         shopName.textContent = item.shop_name;
//         shopPhone.textContent = item.phone_number || "No phone number";
//         productStock.textContent = `${item.quantity} ${item.unit_type}`;
//         productDescription.textContent = item.description || "No description provided.";
        
//         // Store shop ID for the "Locate" button
//         currentShopId = item.shop_id;

//         // Handle Image
//         if (item.image_url) {
//             productImage.src = item.image_url;
//             productImage.style.display = 'block';
//             imagePlaceholder.style.display = 'none';
//         } else {
//             productImage.style.display = 'none';
//             imagePlaceholder.style.display = 'flex';
//         }

//     } catch (err) {
//         console.error(err);
//         productName.textContent = "Error loading product";
//         productDescription.textContent = "The item could not be loaded. Please try again.";
//     }
// }

// // ---------------- EVENTS ----------------
// locateBtn.addEventListener('click', () => {
//     if (currentShopId) {
//         window.location.href = `location.html?shop_id=${currentShopId}`;
//     } else {
//         alert("Shop location not available");
//     }
// });

// backBtn.addEventListener('click', () => {
//     window.location.href = 'customer-dashboard.html';
// });
document.addEventListener("DOMContentLoaded", loadProduct);

// ---------------- AUTH HELPERS ----------------
function getToken() { return localStorage.getItem("token"); }

function authHeaders() {
    return { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` };
}

// ---------------- DOM ELEMENTS ----------------
const productName = document.getElementById('product-name');
const shopName = document.getElementById('shop-name');
const shopPhone = document.getElementById('shop-phone');
const productStock = document.getElementById('product-stock');
const productDescription = document.getElementById('product-description');
const productImage = document.getElementById('product-image');
const imagePlaceholder = document.getElementById('image-placeholder');
const locateBtn = document.getElementById('locate-shop-btn');
const backBtn = document.getElementById('back-to-dashboard-btn');

let currentShopId = null;

// ---------------- LOAD PRODUCT ----------------
async function loadProduct() {
    if (!getToken()) {
        window.location.href = 'customer-login.html';
        return;
    }

    // Get ID from URL (e.g., product.html?item_id=123)
    const itemId = new URLSearchParams(window.location.search).get('item_id');
    
    if (!itemId) {
        alert("No item specified");
        return;
    }

    try {
        // ✅ FIXED: Pointing to your live Vercel Backend
        const res = await fetch(`https://shop-locator-v2.vercel.app/api/customer/item/${itemId}`, {
            headers: authHeaders()
        });

        if (!res.ok) throw new Error("Product not found");

        const item = await res.json();
        
        // --- FILL UI ---
        if (productName) productName.textContent = item.item_name;
        if (shopName) shopName.textContent = item.shop_name;
        if (shopPhone) shopPhone.textContent = item.phone_number || "No phone number";
        if (productStock) productStock.textContent = `${item.quantity} ${item.unit_type}`;
        if (productDescription) productDescription.textContent = item.description || "No description provided.";
        
        // Store shop ID for the "Locate" button
        currentShopId = item.shop_id;

        // Handle Image
        if (item.image_url) {
            if (productImage) {
                productImage.src = item.image_url;
                productImage.style.display = 'block';
            }
            if (imagePlaceholder) imagePlaceholder.style.display = 'none';
        } else {
            if (productImage) productImage.style.display = 'none';
            if (imagePlaceholder) imagePlaceholder.style.display = 'flex';
        }

    } catch (err) {
        console.error(err);
        if (productName) productName.textContent = "Error loading product";
        if (productDescription) productDescription.textContent = "The item could not be loaded. Please try again.";
    }
}

// ---------------- EVENTS ----------------
if (locateBtn) {
    locateBtn.addEventListener('click', () => {
        if (currentShopId) {
            window.location.href = `location.html?shop_id=${currentShopId}`;
        } else {
            alert("Shop location not available");
        }
    });
}

if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'customer-dashboard.html';
    });
}