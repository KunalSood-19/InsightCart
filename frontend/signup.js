async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  if (!email || !password) {
    msg.innerText = "Fill all fields";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    msg.innerText = data.message;

    // ✅ After register → go to login
   if (data.message.includes("success")) {

  // 🔥 CLEAR OLD STATE
  localStorage.removeItem("dataUploaded");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
    }

  } catch (err) {
    console.error(err);
    msg.innerText = "Error occurred";
  }
}