
// console.log("✅ customer-register.js loaded");

// // DOM Elements
// const registerForm = document.getElementById("register-form");
// const submitBtn = document.querySelector('button[type="submit"]');

// // Modal Elements
// const modal = document.getElementById("modal");
// const modalMessage = document.getElementById("modal-message");
// const closeModal = document.querySelector(".close");

// // Backend Configuration
// const API_URL = "http://localhost:4000/api/auth/register";

// // --- MODAL FUNCTIONS ---
// function showModal(message, type = "info") {
//   if (modal && modalMessage) {
//     modalMessage.textContent = message;
//     modalMessage.className = type; // Ensure your CSS has .success and .error styles
//     modal.style.display = "block";
//   } else {
//     alert(message); // Fallback if modal HTML is missing
//   }
// }

// if (closeModal) {
//   closeModal.addEventListener("click", () => {
//     modal.style.display = "none";
//   });
// }

// window.addEventListener("click", (event) => {
//   if (event.target === modal) {
//     modal.style.display = "none";
//   }
// });

// // --- REGISTER HANDLER ---
// async function handleRegister(event) {
//   event.preventDefault();
//   console.log("🖱️ Register button clicked");

//   // 1. Get Values
//   const fullName = document.getElementById("full_name").value.trim();
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value;
//   const confirmPassword = document.getElementById("confirm_password").value;

//   console.log("📝 Form Data:", { fullName, email, passwordLength: password.length });

//   // 2. Validation
//   if (!fullName || !email || !password || !confirmPassword) {
//     showModal("Please fill in all fields", "error");
//     return;
//   }

//   if (password !== confirmPassword) {
//     showModal("Passwords do not match", "error");
//     return;
//   }

//   if (password.length < 6) {
//     showModal("Password must be at least 6 characters", "error");
//     return;
//   }

//   // 3. UI: START LOADING STATE
//   const originalBtnText = submitBtn.innerText;
//   submitBtn.disabled = true;
//   submitBtn.innerText = "Sending OTP...";
//   submitBtn.style.opacity = "0.7";
//   submitBtn.style.cursor = "not-allowed";

//   try {
//     console.log("🚀 Sending request to backend:", API_URL);

//     // 4. API Request (Direct Fetch)
//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         full_name: fullName,
//         email: email,
//         password: password,
//         role: "owner"
//       }),
//     });

//     const data = await response.json();
//     console.log("📡 Backend Response:", data);

//     if (!response.ok) {
//       throw new Error(data.message || "Registration failed");
//     }

//     // 5. SUCCESS
//     console.log("✅ Registration Successful");
    
//     // Store email for the Verify OTP page
//     localStorage.setItem("pendingEmail", email);

//     showModal("OTP Sent! Check your email (Inbox or Spam).", "success");

//     // Redirect after 2 seconds
//     setTimeout(() => {
//       window.location.href = "customerverify-otp.html";
//     }, 2000);

//   } catch (err) {
//     console.error("❌ Registration Error:", err);
//     showModal(err.message || "Server Error", "error");

//     // 6. UI: RESET BUTTON (So user can try again)
//     submitBtn.disabled = false;
//     submitBtn.innerText = originalBtnText;
//     submitBtn.style.opacity = "1";
//     submitBtn.style.cursor = "pointer";
//   }
// }

// // --- ATTACH LISTENER ---
// if (registerForm) {
//   registerForm.addEventListener("submit", handleRegister);
//   console.log("✅ Event Listener attached to form");
// } else {
//   console.error("❌ Error: 'register-form' not found in HTML");
// }
// customer-register.js
const API_URL = "https://shop-locator-v2.vercel.app/api/auth/register";

const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");
const closeModal = document.querySelector(".close");

function showModal(message, type = "info") {
  modalMessage.textContent = message;
  modalMessage.className = type;
  modal.style.display = "block";
}

if (closeModal) {
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

async function handleRegister(event) {
  event.preventDefault();
  
  const fullName = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        password: password,
        role: "customer"
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Registration failed");

    // ✅ FIXED: Saves as pendingEmail to match customerverify-otp.js
    localStorage.setItem("pendingEmail", email);
    showModal("OTP Sent! Check your email.", "success");

    setTimeout(() => {
      window.location.href = "customerverify-otp.html";
    }, 2000);

  } catch (err) {
    showModal(err.message || "Server Error", "error");
  }
}

document.getElementById("register-form").addEventListener("submit", handleRegister);