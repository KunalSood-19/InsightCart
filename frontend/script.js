// 🔐 Auth check
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// Fetch helper
async function fetchData(url) {
  try {
    const res = await fetch("http://localhost:5000" + url, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    });

    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error("Invalid JSON:", text);
      return null;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

let barChart, pieChart, doughnutChart, lineChart;

async function loadDashboard() {

  const noDataMsg = document.getElementById("noDataMsg");
  const cards = document.getElementById("cardsContainer");
  const charts = document.getElementById("chartsContainer");

  const isUploaded = localStorage.getItem("dataUploaded");

  // ❌ No upload yet
  if (!isUploaded) {
    cards.style.display = "none";
    charts.style.display = "none";
    noDataMsg.style.display = "block";
    return;
  }

  const sales = await fetchData("/total-sales");
  const profit = await fetchData("/total-profit");
  const category = await fetchData("/sales-by-category");

  // ❌ No backend data
  if (!category || category.length === 0) {
    cards.style.display = "none";
    charts.style.display = "none";
    noDataMsg.style.display = "block";

    if (barChart) barChart.destroy();
    if (pieChart) pieChart.destroy();
    if (doughnutChart) doughnutChart.destroy();
    if (lineChart) lineChart.destroy();

    return;
  }

  // ✅ Show dashboard
  noDataMsg.style.display = "none";
  cards.style.display = "flex";
  charts.style.display = "grid";

  // KPI values
  document.getElementById("totalSales").innerText =
    sales?.[0]?.total ?? "";

  document.getElementById("totalProfit").innerText =
    profit?.[0]?.total ?? "";

  document.getElementById("totalOrders").innerText =
    category.length ?? "";

  const labels = category.map(c => c.category);
  const data = category.map(c => c.total);

  // BAR
  if (barChart) barChart.destroy();
  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Sales", data }]
    }
  });

  // PIE
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{ data }]
    }
  });

  // DOUGHNUT
  if (doughnutChart) doughnutChart.destroy();
  doughnutChart = new Chart(document.getElementById("doughnutChart"), {
    type: "doughnut",
    data: {
      labels: ["Profit", "Remaining"],
      datasets: [{
        data: [
          profit?.[0]?.total ?? 0,
          (sales?.[0]?.total ?? 0) - (profit?.[0]?.total ?? 0)
        ]
      }]
    }
  });

  // LINE
  if (lineChart) lineChart.destroy();
  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Trend",
        data
      }]
    }
  });
}

// Upload
function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Select file first");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  fetch("http://localhost:5000/upload", {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("token")
    },
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      alert("Upload success");

      // ✅ mark uploaded
      localStorage.setItem("dataUploaded", "true");

      loadDashboard();
    })
    .catch(err => console.error(err));
}

// ✅ Reset state on refresh
document.addEventListener("DOMContentLoaded", () => {

  if (!sessionStorage.getItem("visited")) {
    localStorage.removeItem("dataUploaded");
    sessionStorage.setItem("visited", "true");
  }

  loadDashboard();
});