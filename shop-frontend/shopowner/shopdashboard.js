
document.addEventListener("DOMContentLoaded", initialize);

function getToken() { return localStorage.getItem("token"); }

function authHeaders() {
    const token = getToken();
    if (!token) throw new Error("No login token found");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

// DOM Elements
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const editShopBtn = document.getElementById('edit-shop-btn');
const addItemBtn = document.getElementById('add-item-btn');
const firstItemBtn = document.getElementById('first-item-btn');
const shopNameHeader = document.getElementById('shop-name-header');
const itemsTableBody = document.getElementById('items-table-body');
const noItems = document.getElementById('no-items');
const totalItemsEl = document.getElementById('total-items');
const inStockItemsEl = document.getElementById('in-stock-items');
const lowStockItemsEl = document.getElementById('low-stock-items');

// Modal Elements
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const modalInput = document.querySelector('.modal-input');
const modalActions = document.querySelector('.modal-actions');
const modalActionsDelete = document.querySelector('.modal-actions-delete');
const editUnitsInput = document.getElementById('edit-units-input');
const editUnitTypeSelect = document.getElementById('edit-unit-type-select');
const confirmEdit = document.getElementById('confirm-edit');
const cancelEdit = document.getElementById('cancel-edit');
const confirmDelete = document.getElementById('confirm-delete');
const cancelDelete = document.getElementById('cancel-delete');
const closeModal = document.querySelector('.close');

let shopId = null;
let currentEditItemId = null;
let currentItems = [];
let currentEditItemName = "";

// ---------------- INIT ----------------
async function initialize() {
    shopId = new URLSearchParams(window.location.search).get('shop_id');
    
    if (!getToken()) {
        window.location.href = 'owner-login.html';
        return;
    }

    if (!shopId) {
        showModal("No shop ID found", "error");
        setTimeout(() => window.location.href = 'shophome.html', 1500);
        return;
    }

    await loadShopData();
    await loadItems();
}

// ---------------- LOAD SHOP ----------------
async function loadShopData() {
    try {
        const res = await fetch(`http://localhost:4000/api/shops/${shopId}`, {
            headers: authHeaders()
        });
        if (res.ok) {
            const shop = await res.json();
            shopNameHeader.textContent = `${shop.shop_name} - Dashboard`;
        }
    } catch (err) {
        console.error("Shop Load Error:", err);
    }
}

// ---------------- LOAD ITEMS ----------------
async function loadItems() {
    try {
        itemsTableBody.innerHTML = '<tr><td colspan="5"><div class="loading-spinner">Loading...</div></td></tr>';

        const res = await fetch(`http://localhost:4000/api/items/${shopId}`, {
            headers: authHeaders()
        });

        if (!res.ok) throw new Error("Failed to load items");
        
        const items = await res.json();
        currentItems = items || [];
        
        displayItems(currentItems);
        updateStats(currentItems);

    } catch (error) {
        console.error(error);
        itemsTableBody.innerHTML = '<tr><td colspan="5">Error loading items</td></tr>';
    }
}

function displayItems(items) {
    if (items.length === 0) {
        itemsTableBody.style.display = 'none';
        noItems.style.display = 'block';
        return;
    }

    itemsTableBody.style.display = 'table-row-group';
    noItems.style.display = 'none';
    itemsTableBody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        
        // Use 'quantity' from DB
        const qty = item.quantity;
        
        let stockClass = 'stock-amount';
        if (qty === 0) stockClass += ' out-of-stock';
        else if (qty < 10) stockClass += ' low-stock';

        // ✅ FIXED: Using item.unit_type instead of item.unit
        row.innerHTML = `
            <td>
                <div class="item-name">${item.item_name}</div>
                ${item.image_url ? `<div style="font-size: 0.8rem; color: #6b7280;">📷 Photo</div>` : ''}
            </td>
            <td>
                <div class="stock-info"><span class="${stockClass}">${qty}</span></div>
            </td>
            <td><span class="unit-type">${item.unit_type}</span></td>
            <td><div class="item-description">${item.description || '-'}</div></td>
            <td class="actions-cell">
                <button class="btn btn-sm btn-outline edit-btn" 
                    data-id="${item.id}" 
                    data-quantity="${qty}" 
                    data-unit-type="${item.unit_type}" 
                    data-name="${item.item_name}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" 
                    data-id="${item.id}" 
                    data-name="${item.item_name}">Delete</button>
            </td>
        `;
        itemsTableBody.appendChild(row);
    });
}

function updateStats(items) {
    totalItemsEl.textContent = items.length;
    inStockItemsEl.textContent = items.filter(i => i.quantity > 0).length;
    lowStockItemsEl.textContent = items.filter(i => i.quantity > 0 && i.quantity < 10).length;
}

// ---------------- MODAL & EDIT LOGIC ----------------
function showModal(msg, type, showInput, showActions, showDelete) {
    modalMessage.textContent = msg;
    modalMessage.className = type;
    modalInput.style.display = showInput ? 'block' : 'none';
    modalActions.style.display = showActions ? 'flex' : 'none';
    modalActionsDelete.style.display = showDelete ? 'flex' : 'none';
    modal.style.display = 'block';
}

function resetModal() {
    modal.style.display = 'none';
    currentEditItemId = null;
    editUnitsInput.value = '';
}

// Event Delegation
itemsTableBody.addEventListener('click', (e) => {
    // ✅ FIXED: Reading dataset.unitType (camelCase for data-unit-type)
    if (e.target.classList.contains('edit-btn')) {
        currentEditItemId = e.target.dataset.id;
        currentEditItemName = e.target.dataset.name;
        editUnitsInput.value = e.target.dataset.quantity;
        editUnitTypeSelect.value = e.target.dataset.unitType; 
        showModal('Edit Quantity:', 'info', true, true, false);
    }
    if (e.target.classList.contains('delete-btn')) {
        currentEditItemId = e.target.dataset.id;
        showModal(`Delete "${e.target.dataset.name}"?`, 'error', false, false, true);
    }
});

confirmEdit.addEventListener('click', async () => {
    if (!currentEditItemId) return;
    try {
        const payload = {
            item_name: currentEditItemName, 
            quantity: parseFloat(editUnitsInput.value),
            unit_type: editUnitTypeSelect.value // ✅ FIXED: Sending unit_type to backend
        };

        const res = await fetch(`http://localhost:4000/api/items/${currentEditItemId}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Update failed");
        
        resetModal();
        await loadItems();
        showModal("Item updated", "success");
        setTimeout(() => modal.style.display = 'none', 1000);
        
    } catch (err) {
        showModal(err.message, "error");
    }
});

confirmDelete.addEventListener('click', async () => {
    if (!currentEditItemId) return;
    try {
        const res = await fetch(`http://localhost:4000/api/items/${currentEditItemId}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        
        if (!res.ok) throw new Error("Delete failed");
        
        resetModal();
        await loadItems();
        showModal("Item deleted", "success");
        setTimeout(() => modal.style.display = 'none', 1000);

    } catch (err) {
        showModal(err.message, "error");
    }
});

// Modal Events
if (closeModal) closeModal.onclick = resetModal;
if (cancelEdit) cancelEdit.onclick = resetModal;
if (cancelDelete) cancelDelete.onclick = resetModal;

// Navigation
backToMenuBtn.addEventListener('click', () => window.location.href = `shop-menu.html?shop_id=${shopId}`);
editShopBtn.addEventListener('click', () => window.location.href = `manage-shop.html?shop_id=${shopId}`);
addItemBtn.addEventListener('click', () => window.location.href = `create-item.html?shop_id=${shopId}`);
firstItemBtn.addEventListener('click', () => window.location.href = `create-item.html?shop_id=${shopId}`);
