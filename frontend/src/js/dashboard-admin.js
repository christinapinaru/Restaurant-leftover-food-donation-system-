let adminUser = null;

function initAdminDashboard() {
  adminUser = requireRole("admin");
  if (!adminUser) return;

  renderTopbar(adminUser, "Admin");
  setupAdminTabs();

  loadUsers();
  loadFood();
  loadRequests();
}

function setupAdminTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      document.getElementById("usersTab").style.display = tab === "users" ? "block" : "none";
      document.getElementById("foodTab").style.display = tab === "food" ? "block" : "none";
      document.getElementById("requestsTab").style.display = tab === "requests" ? "block" : "none";
    });
  });
}

async function loadUsers() {
  const body = document.getElementById("usersBody");
  body.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

  try {
    const users = await Api.getAllUsers();
    document.getElementById("usersCount").textContent = `${users.length} total`;

    renderStats(users);

    if (!users.length) {
      body.innerHTML = `<tr><td colspan="6">No users found.</td></tr>`;
      return;
    }

    body.innerHTML = users
      .map(
        (u) => `
      <tr>
        <td>${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${u.role}</td>
        <td>${escapeHtml(u.organizationName) || "-"}</td>
        <td>${u.isActive ? "Active" : "Deactivated"}</td>
        <td>
          ${
            u.role !== "admin"
              ? `<button class="btn ${u.isActive ? "btn-danger" : "btn-ok"}" style="padding:5px 10px; font-size:11px;" onclick='toggleUserStatus(${JSON.stringify(u._id)}, ${!u.isActive})'>${u.isActive ? "Deactivate" : "Activate"}</button>
                 <button class="btn btn-danger" style="padding:5px 10px; font-size:11px;" onclick='removeUser(${JSON.stringify(u._id)})'>Delete</button>`
              : "-"
          }
        </td>
      </tr>
    `
      )
      .join("");
  } catch (err) {
    body.innerHTML = `<tr><td colspan="6">${escapeHtml(err.message)}</td></tr>`;
  }
}

function renderStats(users) {
  const restaurants = users.filter((u) => u.role === "restaurant").length;
  const receivers = users.filter((u) => u.role === "receiver").length;
  const admins = users.filter((u) => u.role === "admin").length;

  document.getElementById("statsRow").innerHTML = `
    <div class="stat-box"><div class="num">${users.length}</div><div class="label">Total Users</div></div>
    <div class="stat-box"><div class="num">${restaurants}</div><div class="label">Restaurants</div></div>
    <div class="stat-box"><div class="num">${receivers}</div><div class="label">Receivers/NGOs</div></div>
    <div class="stat-box"><div class="num">${admins}</div><div class="label">Admins</div></div>
  `;
}

async function toggleUserStatus(id, newStatus) {
  try {
    await Api.setUserStatus(id, newStatus);
    showToast(newStatus ? "User activated" : "User deactivated");
    loadUsers();
  } catch (err) {
    showToast(err.message, true);
  }
}

async function removeUser(id) {
  if (!confirm("Delete this user permanently?")) return;
  try {
    await Api.deleteUser(id);
    showToast("User deleted");
    loadUsers();
  } catch (err) {
    showToast(err.message, true);
  }
}

async function loadFood() {
  const grid = document.getElementById("foodGrid");
  grid.innerHTML = `<div class="empty-state">Loading...</div>`;

  try {
    const foods = await Api.getAllFood();
    document.getElementById("foodCount").textContent = `${foods.length} total`;

    if (!foods.length) {
      grid.innerHTML = `<div class="empty-state">No food listings yet.</div>`;
      return;
    }

    grid.innerHTML = foods
      .map(
        (f) => `
      <div class="ticket">
        <div class="ticket-top">
          <h3>${escapeHtml(f.foodName)}</h3>
          <span class="status ${statusClass(f.status)}">${f.status}</span>
        </div>
        <div class="meta">${f.quantity} ${f.unit} • ${f.foodType}</div>
        <div class="meta">🏠 ${escapeHtml(f.restaurant.organizationName || f.restaurant.name)}</div>
        <div class="meta">📍 ${escapeHtml(f.pickupAddress)}</div>
        <div class="stub"><span>Best before ${formatDate(f.expiryTime)}</span></div>
        <div class="actions">
          <button class="btn btn-danger" onclick='adminDeleteFood(${JSON.stringify(f._id)})'>Delete</button>
        </div>
      </div>
    `
      )
      .join("");
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`;
  }
}

async function adminDeleteFood(id) {
  if (!confirm("Delete this listing?")) return;
  try {
    await Api.deleteFood(id);
    showToast("Listing deleted");
    loadFood();
  } catch (err) {
    showToast(err.message, true);
  }
}

async function loadRequests() {
  const body = document.getElementById("requestsBody");
  body.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

  try {
    const requests = await Api.getAllRequests();
    document.getElementById("requestsCount").textContent = `${requests.length} total`;

    if (!requests.length) {
      body.innerHTML = `<tr><td colspan="5">No requests yet.</td></tr>`;
      return;
    }

    body.innerHTML = requests
      .map(
        (r) => `
      <tr>
        <td>${escapeHtml(r.food ? r.food.foodName : "Deleted")}</td>
        <td>${escapeHtml(r.restaurant.organizationName || r.restaurant.name)}</td>
        <td>${escapeHtml(r.receiver.organizationName || r.receiver.name)}</td>
        <td><span class="status ${statusClass(r.status)}">${r.status}</span></td>
        <td>${formatDate(r.createdAt)}</td>
      </tr>
    `
      )
      .join("");
  } catch (err) {
    body.innerHTML = `<tr><td colspan="5">${escapeHtml(err.message)}</td></tr>`;
  }
}
