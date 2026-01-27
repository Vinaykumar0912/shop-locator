
// import { api } from "../apiClient.js";

// const loginForm = document.getElementById('login-form');
// // ... rest of your code

// // Modal functionality
// const modal = document.getElementById('modal');
// const modalMessage = document.getElementById('modal-message');
// const closeModal = document.querySelector('.close');

// function showModal(message, type = 'info') {
//     modalMessage.textContent = message;
//     modalMessage.className = type;
//     modal.style.display = 'block';
// }

// closeModal.addEventListener('click', () => {
//     modal.style.display = 'none';
// });

// window.addEventListener('click', (event) => {
//     if (event.target === modal) {
//         modal.style.display = 'none';
//     }
// });

// // Handle login
// async function handleLogin(event) {
//     event.preventDefault();

//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     if (!email || !password) {
//         showModal('Please fill in all fields', 'error');
//         return;
//     }

//     try {
//         const { data, error } = await api.auth.signInWithPassword({
//             email: email,
//             password: password
//         });

//         if (error) throw error;

//         showModal('Login successful! Redirecting...', 'success');
//         setTimeout(() => {
//             // ✅ SAVE AUTH DATA (REQUIRED)
// localStorage.setItem("token", data.token);
// localStorage.setItem("role", data.user.role);


//             window.location.href = 'shophome.html';
//         }, 1500);

//     } catch (error) {
//         showModal('Login failed: ' + error.message, 'error');
//     }
// }

// // Event listeners
// loginForm.addEventListener('submit', handleLogin);
import { api } from "../apiClient.js";

const loginForm = document.getElementById('login-form');

// Modal functionality
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.querySelector('.close');

function showModal(message, type = 'info') {
    modalMessage.textContent = message;
    modalMessage.className = type;
    modal.style.display = 'block';
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showModal('Please fill in all fields', 'error');
        return;
    }

    try {
        const { data, error } = await api.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        showModal('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            // ✅ SAVE AUTH DATA (Ensuring shophome.js can find it)
            localStorage.setItem("token", data.token);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("role", data.user.role);
            }

            window.location.href = 'shophome.html';
        }, 1500);

    } catch (error) {
        showModal('Login failed: ' + (error.message || 'Invalid credentials'), 'error');
    }
}

// Event listeners
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}