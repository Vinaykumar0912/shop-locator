
console.log("owner-register.js loaded");
import { api } from "../apiClient.js";

const registerForm = document.getElementById("register-form");

// Modal functionality
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

// Handle registration
async function handleRegister(event) {
  event.preventDefault();

  const fullName = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  // Validation checks
  if (!fullName || !email || !password || !confirmPassword) {
    showModal("Please fill in all fields", "error");
    return;
  }

  if (password !== confirmPassword) {
    showModal("Passwords do not match", "error");
    return;
  }

  if (password.length < 6) {
    showModal("Password must be at least 6 characters", "error");
    return;
  }

  try {
    // Register user via apiClient
    const { data, error } = await api.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: window.location.pathname.includes("owner") ? "owner" : "customer"
        }
      }
    });

    if (error) {
      throw error;
    }

    // ✅ CRITICAL STEP: Store email for the OTP page
    // This allows ownerverify-otp.js to retrieve the email automatically
    localStorage.setItem("pendingEmail", email);

    showModal(
      "Registration successful! Redirecting to OTP verification...",
      "success"
    );

    setTimeout(() => {
      window.location.href = "ownerverify-otp.html";
    }, 1500);

  } catch (err) {
    console.error("Registration error:", err);
    showModal("Registration failed: " + (err.message || "Server error"), "error");
  }
}

// Attach event listener
if (registerForm) {
  registerForm.addEventListener("submit", handleRegister);
}
