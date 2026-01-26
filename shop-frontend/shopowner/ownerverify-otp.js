console.log("OTP Verification script loaded");

// 1. Get the email that was stored during registration
const email = localStorage.getItem("pendingEmail");

// 2. Fill the email input field automatically
if (email) {
    document.getElementById("email").value = email;
} else {
    alert("Session expired or email not found. Please register again.");
    window.location.href = "owner-register.html";
}

document.getElementById("verify-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const otp = document.getElementById("otp").value.trim();

    if (!otp) {
        alert("Please enter the OTP code.");
        return;
    }

    try {
        // Send request to the fixed backend route
        const res = await fetch("http://localhost:4000/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Invalid OTP");
            return;
        }

        alert("OTP verified successfully! You can now log in.");
        
        // Clean up temporary storage
        localStorage.removeItem("pendingEmail");
        
        // Redirect to login
        window.location.href = "owner-login.html";

    } catch (err) {
        console.error("Verification error:", err);
        alert("Server error. Please check if your backend is running.");
    }
});
