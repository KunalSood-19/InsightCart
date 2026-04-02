let isLogin = true;

function toggleMode() {
  isLogin = !isLogin;

  document.getElementById("formTitle").innerText =
    isLogin ? "Welcome Back" : "Create Account";

  document.getElementById("authBtn").innerText =
    isLogin ? "Login" : "Register";

  document.querySelector(".subtitle").innerText =
    isLogin
      ? "Please login to your account"
      : "Create your account";

  document.querySelector(".toggle").innerHTML =
    isLogin
      ? `Don’t have an account? <span onclick="toggleMode()">Signup</span>`
      : `Already have an account? <span onclick="toggleMode()">Login</span>`;
}

async function handleAuth() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const url = isLogin ? "/login" : "/register";

  const res = await fetch("http://localhost:5000" + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (isLogin) {
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      alert("Login failed ❌");
    }
  } else {
    alert("Registered successfully ✅");
    toggleMode();
  }
}