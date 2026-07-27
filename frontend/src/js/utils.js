function showToast(message, isError = false) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast" + (isError ? " error" : "");
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// Redirect helpers used at the top of each protected page
function requireLogin() {
  if (!Auth.isLoggedIn()) {
    window.location.href = "login.html";
    return null;
  }
  return Auth.getUser();
}

function requireRole(role) {
  const user = requireLogin();
  if (!user) return null;
  if (user.role !== role) {
    window.location.href = roleHome(user.role);
    return null;
  }
  return user;
}

function roleHome(role) {
  if (role === "admin") return "dashboard-admin.html";
  if (role === "restaurant") return "dashboard-restaurant.html";
  return "dashboard-receiver.html";
}

function renderTopbar(user, activeLabel) {
  const bar = document.getElementById("topbar");
  if (!bar) return;
  bar.innerHTML = `
    <div class="brand">🍽️ Good<span style="color:var(--sun)">Plate</span>
      <span class="tag">${activeLabel}</span>
    </div>
    <div class="who">
      <span>${escapeHtml(user.name)} <span class="role-chip">${user.role}</span></span>
      <button class="btn btn-outline" id="logoutBtn">Log out</button>
    </div>
  `;
  document.getElementById("logoutBtn").addEventListener("click", () => {
    Auth.clear();
    window.location.href = "login.html";
  });
}

function statusClass(status) {
  return `status-${status}`;
}
