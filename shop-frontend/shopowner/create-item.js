// document.addEventListener('DOMContentLoaded', initialize);

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

// const backBtn = document.getElementById('back-btn');
// const itemForm = document.getElementById('item-form');
// const cancelBtn = document.getElementById('cancel-btn');
// const itemNameInput = document.getElementById('item_name');
// const unitsInput = document.getElementById('units'); 
// const unitTypeSelect = document.getElementById('unit_type');
// const descriptionInput = document.getElementById('description'); 
// const photoInput = document.getElementById('photo');
// const modal = document.getElementById('modal');
// const modalMessage = document.getElementById('modal-message');
// const closeModal = document.querySelector('.close');
// let shopId = null;

// function showModal(message, type = 'info') {
//     modalMessage.textContent = message;
//     modalMessage.className = type;
//     modal.style.display = 'block';
// }

// if (closeModal) closeModal.onclick = () => modal.style.display = 'none';
// window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

// async function initialize() {
//     if (!getToken()) {
//         window.location.href = 'owner-login.html';
//         return;
//     }
//     const urlParams = new URLSearchParams(window.location.search);
//     shopId = urlParams.get('shop_id');
//     if (!shopId) {
//         showModal('No shop specified', 'error');
//         setTimeout(() => window.location.href = 'shophome.html', 2000);
//         return;
//     }
// }

// async function handleItemCreate(event) {
//     event.preventDefault();

//     const itemName = itemNameInput.value.trim();
//     const quantityVal = parseFloat(unitsInput.value);
//     const unitTypeVal = unitTypeSelect.value;
//     const description = descriptionInput.value.trim();
//     const photoFile = photoInput.files[0];

//     if (!itemName || isNaN(quantityVal) || !unitTypeVal) {
//         showModal('Please fill in Name, Quantity, and Unit Type', 'error');
//         return;
//     }

//     try {
//         // MATCHING BACKEND NAMES EXACTLY
//         const payload = {
//             shop_id: shopId,
//             item_name: itemName,
//             quantity: quantityVal, 
//             unit_type: unitTypeVal, 
//             description: description
//         };

//         const res = await fetch("http://localhost:4000/api/items", {
//             method: "POST",
//             headers: authHeaders(),
//             body: JSON.stringify(payload)
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Failed to create item");

//         const newItemId = data.id;

//         // Step 2: Upload Photo
//         if (photoFile && newItemId) {
//             await uploadItemPhoto(newItemId, photoFile);
//         }

//         showModal('Item created successfully!', 'success');
//         itemForm.reset();

//         setTimeout(() => {
//             window.location.href = `shopdashboard.html?shop_id=${shopId}`;
//         }, 1500);

//     } catch (error) {
//         console.error("Create Error:", error);
//         showModal(error.message, 'error');
//     }
// }

// async function uploadItemPhoto(itemId, file) {
//     try {
//         const formData = new FormData();
//         formData.append('image', file);
//         const token = getToken();
        
//         await fetch(`http://localhost:4000/api/items/upload/${itemId}`, {
//             method: 'POST',
//             headers: { 'Authorization': `Bearer ${token}` },
//             body: formData
//         });
//     } catch (err) {
//         console.error("Upload error:", err);
//     }
// }

// itemForm.addEventListener('submit', handleItemCreate);
// backBtn.addEventListener('click', () => window.history.back());
// cancelBtn.addEventListener('click', () => window.location.href = `shopdashboard.html?shop_id=${shopId}`);
document.addEventListener('DOMContentLoaded', initialize);

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

const backBtn = document.getElementById('back-btn');
const itemForm = document.getElementById('item-form');
const cancelBtn = document.getElementById('cancel-btn');
const itemNameInput = document.getElementById('item_name');
const unitsInput = document.getElementById('units'); 
const unitTypeSelect = document.getElementById('unit_type');
const descriptionInput = document.getElementById('description'); 
const photoInput = document.getElementById('photo');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.querySelector('.close');
let shopId = null;

function showModal(message, type = 'info') {
    modalMessage.textContent = message;
    modalMessage.className = type;
    modal.style.display = 'block';
}

if (closeModal) closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

async function initialize() {
    if (!getToken()) {
        window.location.href = 'owner-login.html';
        return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    shopId = urlParams.get('shop_id');
    if (!shopId) {
        showModal('No shop specified', 'error');
        setTimeout(() => window.location.href = 'shophome.html', 2000);
        return;
    }
}

async function handleItemCreate(event) {
    event.preventDefault();

    const itemName = itemNameInput.value.trim();
    const quantityVal = parseFloat(unitsInput.value);
    const unitTypeVal = unitTypeSelect.value;
    const description = descriptionInput.value.trim();
    const photoFile = photoInput.files[0];

    if (!itemName || isNaN(quantityVal) || !unitTypeVal) {
        showModal('Please fill in Name, Quantity, and Unit Type', 'error');
        return;
    }

    try {
        // MATCHING BACKEND NAMES EXACTLY
        const payload = {
            shop_id: shopId,
            item_name: itemName,
            quantity: quantityVal, 
            unit_type: unitTypeVal, 
            description: description
        };

        // ✅ FIXED: Live Vercel URL for Item Creation
        const res = await fetch("https://shop-locator-v2.vercel.app/api/items", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create item");

        const newItemId = data.id;

        // Step 2: Upload Photo
        if (photoFile && newItemId) {
            await uploadItemPhoto(newItemId, photoFile);
        }

        showModal('Item created successfully!', 'success');
        itemForm.reset();

        setTimeout(() => {
            window.location.href = `shopdashboard.html?shop_id=${shopId}`;
        }, 1500);

    } catch (error) {
        console.error("Create Error:", error);
        showModal(error.message, 'error');
    }
}

async function uploadItemPhoto(itemId, file) {
    try {
        const formData = new FormData();
        formData.append('image', file);
        const token = getToken();
        
        // ✅ FIXED: Live Vercel URL for Photo Upload
        await fetch(`https://shop-locator-v2.vercel.app/api/items/upload/${itemId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
    } catch (err) {
        console.error("Upload error:", err);
    }
}

itemForm.addEventListener('submit', handleItemCreate);
if (backBtn) backBtn.addEventListener('click', () => window.history.back());
if (cancelBtn) cancelBtn.addEventListener('click', () => window.location.href = `shopdashboard.html?shop_id=${shopId}`);