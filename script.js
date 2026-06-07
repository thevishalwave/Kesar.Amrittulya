(function () {
  const officialStates = [
    ["Maharashtra", 180], ["Gujarat", 90], ["Rajasthan", 45], ["Karnataka", 20],
    ["Uttar Pradesh", 10], ["Madhya Pradesh", 10], ["Goa", 5], ["Bihar", 5],
    ["Daman & Nagar Haveli", 5], ["Haryana", 5], ["Chhattisgarh", 3], ["Delhi", 2]
  ];

  const defaults = {
    stats: { experience: "11+", outlets: "380+", states: "12+" },
    content: {
      phone: "+919016100100",
      whatsapp: "+919016100100",
      email: "kesharchai@gmail.com",
      instagram: "https://www.instagram.com/kesharchai",
      facebook: "https://www.facebook.com/search/top?q=kesharchai",
      youtube: "https://m.youtube.com/c/PurohitKishan",
      heroHeadline: "Keshar Amruttulya Franchise Opportunity"
    }
  };

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  };
  const stats = read("keshar_stats", defaults.stats);
  const content = read("keshar_content", defaults.content);

  document.querySelectorAll("[data-stat]").forEach((node) => {
    node.textContent = stats[node.dataset.stat] || node.textContent;
  });
  const heroHeadline = document.querySelector(".hero h1");
  if (heroHeadline && content.heroHeadline) heroHeadline.textContent = content.heroHeadline;

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const digits = (content.whatsapp || defaults.content.whatsapp).replace(/\D/g, "");
    link.href = `https://wa.me/${digits}`;
  });

  const grid = document.getElementById("stateGrid");
  if (grid) {
    grid.innerHTML = officialStates.map(([state, count]) => (
      `<div class="state-card"><span>${state}</span><strong>${count}</strong></div>`
    )).join("");
  }

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  }

  const form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const leads = read("keshar_leads", []);
      leads.unshift({ id: Date.now(), createdAt: new Date().toISOString(), ...data });
      localStorage.setItem("keshar_leads", JSON.stringify(leads));
      form.reset();
      const whatsappText = encodeURIComponent(`New Keshar franchise enquiry: ${data.name}, ${data.phone}, ${data.city}, ${data.state}`);
      const status = form.querySelector(".form-status");
      status.innerHTML = `Thank you. Your enquiry has been recorded. <a href="https://wa.me/919016100100?text=${whatsappText}" target="_blank" rel="noopener">Send on WhatsApp</a>`;
    });
  }
})();
