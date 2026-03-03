
const currentLocationBtn = document.getElementById('current-location-btn');
const saveLocationBtn = document.getElementById('save-location-btn');
const backBtn = document.getElementById('back-btn');
const coordinatesEl = document.getElementById('coordinates');

let map = null;
let marker = null;
let currentLocation = null;
let shopId = null;
let isLocationSet = false;

// Modal functionality
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.querySelector('.close');

function showModal(message, type = 'info') {
    modalMessage.textContent = message;
    modalMessage.className = type;
    modal.style.display = 'block';
}

closeModal.addEventListener('click', () => modal.style.display = 'none');
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

function getShopIdFromUrl() {
    return new URLSearchParams(window.location.search).get('shop_id');
}

// Map Init
function initMap() {
    const defaultCenter = [20.5937, 78.9629]; // Center of India
    const defaultZoom = 5;

    map = L.map('map').setView(defaultCenter, defaultZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    map.on('click', function(e) {
        setMarker(e.latlng);
    });

    shopId = getShopIdFromUrl();
    
    // If we have an existing shop, we might want to load its location
    // logic simplified for now to focus on setting new location
    getUserLocation();
}

function setMarker(latlng) {
    if (marker) map.removeLayer(marker);

    marker = L.marker(latlng, { draggable: true }).addTo(map);
    currentLocation = latlng;
    isLocationSet = true;
    
    coordinatesEl.textContent = `Lat: ${latlng.lat.toFixed(6)}, Lng: ${latlng.lng.toFixed(6)}`;

    saveLocationBtn.disabled = false;
    saveLocationBtn.classList.remove('btn-outline');
    saveLocationBtn.classList.add('btn-primary');

    marker.on('dragend', function(event) {
        const position = event.target.getLatLng();
        currentLocation = position;
        coordinatesEl.textContent = `Lat: ${position.lat.toFixed(6)}, Lng: ${position.lng.toFixed(6)}`;
    });

    map.setView(latlng, 15);
}

function getUserLocation() {
    if (!navigator.geolocation) {
        showModal('Geolocation not supported', 'error');
        return;
    }

    currentLocationBtn.disabled = true;
    currentLocationBtn.textContent = "Locating...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
            setMarker(userLatLng);
            currentLocationBtn.disabled = false;
            currentLocationBtn.textContent = "Use My Current Location";
        },
        () => {
            showModal('Unable to retrieve location', 'error');
            currentLocationBtn.disabled = false;
        }
    );
}

// Save location to Session Storage so manage-shop.js can pick it up
function saveLocation() {
    if (!currentLocation) {
        showModal('Please set a location first', 'error');
        return;
    }

    const locationData = {
        latitude: currentLocation.lat,
        longitude: currentLocation.lng
    };

    // This is the key link to manage-shop.js
    sessionStorage.setItem('shop_location', JSON.stringify(locationData));

    showModal('Location saved! Returning to form...', 'success');

    setTimeout(() => {
        if (shopId) {
            window.location.href = `manage-shop.html?shop_id=${shopId}`;
        } else {
            window.location.href = 'manage-shop.html';
        }
    }, 1500);
}

currentLocationBtn.addEventListener('click', getUserLocation);
saveLocationBtn.addEventListener('click', saveLocation);
backBtn.addEventListener('click', () => window.history.back());

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    if (!localStorage.getItem('token')) {
        window.location.href = 'owner-login.html';
        return;
    }
    initMap();
});
