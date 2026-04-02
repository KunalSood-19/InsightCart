async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  if (!email || !password) {
    errorMsg.innerText = "Please enter all fields";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

   if (data.token) {
  localStorage.setItem("token", data.token);

  // 🔥 CLEAR OLD DATA STATE
  localStorage.removeItem("dataUploaded");

  window.location.href = "index.html";
} else {
      errorMsg.innerText = data.message || "Login failed";
    }

  } catch (err) {
    console.error(err);
    errorMsg.innerText = "Server error";
  }
}