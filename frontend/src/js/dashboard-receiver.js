let receiverUser = null;

function initReceiverDashboard() {
  receiverUser = requireRole("receiver");
  if (!receiverUser) return;

  renderTopbar(receiverUser, "Receiver / NGO");
  setupReceiverTabs();
  setupRequestModal();

  document.getElementById("refreshBrowseBtn").addEventListener("click", loadAvailableFood);
  document.getElementById("requestForm").addEventListener("submit", handleRequestSubmit);

  loadAvailableFood();
  loadMyRequests();
}

function setupReceiverTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      document.getElementById("browseTab").style.display = tab === "browse" ? "block" : "none";
      document.getElementById("mineTab").style.display = tab === "mine" ? "block" : "none";
      if (tab === "mine") loadMyRequests();
    });
  });
}

function setupRequestModal() {
  document.getElementById("closeRequestModal").addEventListener("click", closeRequestModal);
  document.getElementById("requestModal").addEventListener("click", (e) => {
    if (e.target.id === "requestModal") closeRequestModal();
  });
}

function openRequestModal(foodId) {
  document.getElementById("requestErrorBox").style.display = "none";
  document.getElementById("requestFoodId").value = foodId;
  document.getElementById("requestMessage").value = "";
  document.getElementById("requestModal").classList.add("open");
}

function closeRequestModal() {
  document.getElementById("requestModal").classList.remove("open");
}

async function handleRequestSubmit(e) {
  e.preventDefault();
  const errorBox = document.getElementById("requestErrorBox");
  errorBox.style.display = "none";

  const foodId = document.getElementById("requestFoodId").value;
  const message = document.getElementById("requestMessage").value.trim();

  try {
    await Api.createRequest({ foodId, message });
    showToast("Request sent!");
    closeRequestModal();
    loadAvailableFood();
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.style.display = "block";
  }
}

async function loadAvailableFood() {
  const grid = document.getElementById("browseGrid");
  grid.innerHTML = `<div class="empty-state">Loading...</div>`;

  try {
    const foods = await Api.getAllFood("?status=available");

    if (!foods.length) {
      grid.innerHTML = `<div class="empty-state">No available food right now. Check back soon.</div>`;
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
        <div class="desc">${escapeHtml(f.description) || "No description"}</div>
        <div class="meta">🏠 ${escapeHtml(f.restaurant.organizationName || f.restaurant.name)}</div>
        <div class="meta">📍 ${escapeHtml(f.pickupAddress)}</div>
        <div class="stub"><span>Best before ${formatDate(f.expiryTime)}</span></div>
        <div class="actions">
          <button class="btn btn-primary btn-block" onclick='openRequestModal(${JSON.stringify(f._id)})'>Request this food</button>
        </div>
      </div>
    `
      )
      .join("");
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`;
  }
}

async function loadMyRequests() {
  const grid = document.getElementById("mineGrid");
  grid.innerHTML = `<div class="empty-state">Loading...</div>`;

  try {
    const requests = await Api.getMyRequests();

    if (!requests.length) {
      grid.innerHTML = `<div class="empty-state">You haven't requested any food yet.</div>`;
      return;
    }

    grid.innerHTML = requests
      .map((r) => {
        const canCancel = r.status === "pending";
        return `
        <div class="ticket">
          <div class="ticket-top">
            <h3>${escapeHtml(r.food ? r.food.foodName : "Deleted listing")}</h3>
            <span class="status ${statusClass(r.status)}">${r.status}</span>
          </div>
          <div class="meta">From: ${escapeHtml(r.restaurant.organizationName || r.restaurant.name)}</div>
          <div class="meta">📞 ${escapeHtml(r.restaurant.phone || "-")}</div>
          <div class="meta">📍 ${escapeHtml(r.food ? r.food.pickupAddress : "-")}</div>
          <div class="stub"><span>Requested ${formatDate(r.createdAt)}</span></div>
          ${canCancel ? `<div class="actions"><button class="btn btn-danger" onclick='cancelRequest(${JSON.stringify(r._id)})'>Cancel Request</button></div>` : ""}
        </div>
      `;
      })
      .join("");
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`;
  }
}

async function cancelRequest(id) {
  if (!confirm("Cancel this request?")) return;
  try {
    await Api.updateRequestStatus(id, "cancelled");
    showToast("Request cancelled");
    loadMyRequests();
  } catch (err) {
    showToast(err.message, true);
  }
}
