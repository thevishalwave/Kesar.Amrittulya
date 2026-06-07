(function () {
  const credentials = { username: "admin", password: "Keshar@2026" };
  const defaultContent = {
    seoTitle: "Keshar Amruttulya Gud Ki Chai Franchise | 380+ Outlets",
    metaDescription: "Start a Keshar Amruttulya Gud Ki Chai franchise. 11+ years, 380+ outlets, 12+ states.",
    phone: "+919016100100",
    whatsapp: "+919016100100",
    email: "kesharchai@gmail.com",
    address: "Daman, Gujarat",
    instagram: "https://www.instagram.com/kesharchai",
    facebook: "https://www.facebook.com/search/top?q=kesharchai",
    youtube: "https://m.youtube.com/c/PurohitKishan",
    heroHeadline: "Keshar Amruttulya Franchise Opportunity"
  };
  const defaultStats = { experience: "11+", outlets: "380+", states: "12+" };
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const loginPanel = document.getElementById("loginPanel");
  const dashboard = document.getElementById("dashboard");
  const loginForm = document.getElementById("loginForm");
  const contentForm = document.getElementById("contentForm");
  const leadTable = document.getElementById("leadTable");
  const leadSearch = document.getElementById("leadSearch");

  function showDashboard() {
    loginPanel.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loadContent();
    renderLeads();
  }

  if (sessionStorage.getItem("keshar_admin_session") === "active") showDashboard();

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm).entries());
    if (data.username === credentials.username && data.password === credentials.password) {
      sessionStorage.setItem("keshar_admin_session", "active");
      showDashboard();
      return;
    }
    loginForm.querySelector(".form-status").textContent = "Invalid username or password.";
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("keshar_admin_session");
    location.reload();
  });

  function loadContent() {
    const content = read("keshar_content", defaultContent);
    Object.entries({ ...defaultContent, ...content }).forEach(([key, value]) => {
      if (contentForm.elements[key]) contentForm.elements[key].value = value;
    });
    const stats = read("keshar_stats", defaultStats);
    document.querySelectorAll("[data-setting]").forEach((input) => {
      input.value = stats[input.dataset.setting] || "";
    });
  }

  contentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    write("keshar_content", Object.fromEntries(new FormData(contentForm).entries()));
    contentForm.querySelector(".form-status").textContent = "Content saved in this browser.";
  });

  document.getElementById("saveStats").addEventListener("click", () => {
    const stats = {};
    document.querySelectorAll("[data-setting]").forEach((input) => { stats[input.dataset.setting] = input.value; });
    write("keshar_stats", stats);
  });

  function getLeads() { return read("keshar_leads", []); }
  function setLeads(leads) { write("keshar_leads", leads); }

  function renderLeads() {
    const term = (leadSearch.value || "").toLowerCase();
    const rows = getLeads().filter((lead) => JSON.stringify(lead).toLowerCase().includes(term));
    leadTable.innerHTML = rows.map((lead) => `
      <tr>
        <td>${escapeHtml(lead.name || "")}</td>
        <td>${escapeHtml(lead.phone || "")}</td>
        <td>${escapeHtml(lead.city || "")}</td>
        <td>${escapeHtml(lead.state || "")}</td>
        <td>${new Date(lead.createdAt).toLocaleString()}</td>
        <td><button data-delete="${lead.id}" type="button">Delete</button></td>
      </tr>
    `).join("") || `<tr><td colspan="6">No leads yet.</td></tr>`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  }

  leadSearch.addEventListener("input", renderLeads);
  leadTable.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    setLeads(getLeads().filter((lead) => String(lead.id) !== button.dataset.delete));
    renderLeads();
  });

  function download(filename, mime, content) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function toCsv(leads) {
    const headers = ["Name", "Phone", "City", "State", "Message", "Date"];
    const rows = leads.map((lead) => [lead.name, lead.phone, lead.city, lead.state, lead.message, lead.createdAt]);
    return [headers, ...rows].map((row) => row.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(",")).join("\n");
  }

  document.getElementById("exportCsv").addEventListener("click", () => {
    download("keshar-franchise-leads.csv", "text/csv", toCsv(getLeads()));
  });

  document.getElementById("exportExcel").addEventListener("click", () => {
    const html = `<table>${toCsv(getLeads()).split("\n").map((line) => `<tr>${line.split(",").map((cell) => `<td>${cell.replace(/^"|"$/g, "")}</td>`).join("")}</tr>`).join("")}</table>`;
    download("keshar-franchise-leads.xls", "application/vnd.ms-excel", html);
  });
})();
