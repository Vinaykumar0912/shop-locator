// console.log("OTP Verification script loaded");

// // 1. Get the email that was stored during registration
// const email = localStorage.getItem("pendingEmail");

// // 2. Fill the email input field automatically
// if (email) {
//     document.getElementById("email").value = email;
// } else {
//     alert("Session expired or email not found. Please register again.");
//     window.location.href = "customer-register.html";
// }

// document.getElementById("verify-form").addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const otp = document.getElementById("otp").value.trim();

//     if (!otp) {
//         alert("Please enter the OTP code.");
//         return;
//     }

//     try {
//         // Send request to the fixed backend route
//         const res = await fetch("http://localhost:4000/api/auth/verify-otp", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, otp })
//         });

//         const data = await res.json();

//         if (!res.ok) {
//             alert(data.message || "Invalid OTP");
//             return;
//         }

//         alert("OTP verified successfully! You can now log in.");
        
//         // Clean up temporary storage
//         localStorage.removeItem("pendingEmail");
        
//         // Redirect to login
//         window.location.href = "customer-login.html";

//     } catch (err) {
//         console.error("Verification error:", err);
//         alert("Server error. Please check if your backend is running.");
//     }
// });
// customerverify-otp.js
const email = localStorage.getItem("pendingEmail");

// ✅ FIXED: Auto-fill the email field if it exists in your HTML
if (email && document.getElementById("email")) {
    document.getElementById("email").value = email;
}

document.getElementById("verify-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = document.getElementById("otp").value.trim();

    try {
        // ✅ FIXED: URL updated to Vercel
        const response = await fetch("https://shop-locator-v2.vercel.app/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp })
        });

        // ✅ FIXED: Changed 'res' to 'response' to stop the crash
        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Invalid OTP");
            return;
        }

        alert("OTP verified successfully!");
        localStorage.removeItem("pendingEmail");
        window.location.href = "customer-login.html";

    } catch (err) {
        console.error("Verification error:", err);
        alert("Server error. Please try again.");
    }
});