let currentUser = null;

function initRestaurantDashboard() {
  currentUser = requireRole("restaurant");
  if (!currentUser) return;

  renderTopbar(currentUser, "Restaurant");
  setupTabs();
  setupModal();

  document.getElementById("listingForm").addEventListener("submit", handleListingSubmit);

  loadListings();
  loadReceivedRequests();
}

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      document.getElementById("listingsTab").style.display = tab === "listings" ? "block" : "none";
      document.getElementById("requestsTab").style.display = tab === "requests" ? "block" : "none";
    });
  });
}

function setupModal() {
  document.getElementById("newListingBtn").addEventListener("click", () => openListingModal());
  document.getElementById("closeListingModal").addEventListener("click", closeListingModal);
  document.getElementById("listingModal").addEventListener("click", (e) => {
    if (e.target.id === "listingModal") closeListingModal();
  });
}

function openListingModal(food = null) {
  document.getElementById("listingErrorBox").style.display = "none";
  document.getElementById("listingModalTitle").textContent = food ? "Edit Listing" : "New Food Listing";
  document.getElementById("foodId").value = food ? food._id : "";
  document.getElementById("foodName").value = food ? food.foodName : "";
  document.getElementById("description").value = food ? food.description : "";
  document.getElementById("quantity").value = food ? food.quantity : "";
  document.getElementById("unit").value = food ? food.unit : "plates";
  document.getElementById("foodType").value = food ? food.foodType : "veg";
  document.getElementById("pickupAddress").value = food ? food.pickupAddress : "";
  document.getElementById("expiryTime").value = food
    ? new Date(food.expiryTime).toISOString().slice(0, 16)
    : "";
  document.getElementById("listingModal").classList.add("open");
}

function closeListingModal() {
  document.getElementById("listingModal").classList.remove("open");
}

async function handleListingSubmit(e) {
  e.preventDefault();
  const errorBox = document.getElementById("listingErrorBox");
  errorBox.style.display = "none";

  const id = document.getElementById("foodId").value;
  const payload = {
    foodName: document.getElementById("foodName").value.trim(),
    description: document.getElementById("description").value.trim(),
    quantity: Number(document.getElementById("quantity").value),
    unit: document.getElementById("unit").value,
    foodType: document.getElementById("foodType").value,
    pickupAddress: document.getElementById("pickupAddress").value.trim(),
    expiryTime: new Date(document.getElementById("expiryTime").value).toISOString(),
  };

  try {
    if (id) {
      await Api.updateFood(id, payload);
      showToast("Listing updated");
    } else {
      await Api.createFood(payload);
      showToast("Listing created");
    }
    closeListingModal();
    loadListings();
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.style.display = "block";
  }
}

async function loadListings() {
  const grid = document.getElementById("listingsGrid");
  grid.innerHTML = `<div class="empty-state">Loading...</div>`;

  try {
    const foods = await Api.getAllFood("?mine=true");
    renderStats(foods);

    if (!foods.length) {
      grid.innerHTML = `<div class="empty-state">No listings yet. Click "+ New Listing" to add your first surplus food item.</div>`;
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
        <div class="meta">📍 ${escapeHtml(f.pickupAddress)}</div>
        <div class="stub">
          <span>Best before ${formatDate(f.expiryTime)}</span>
        </div>
        <div class="actions">
          <button class="btn btn-outline" onclick='editListing(${JSON.stringify(f._id)})'>Edit</button>
          <button class="btn btn-danger" onclick='deleteListing(${JSON.stringify(f._id)})'>Delete</button>
        </div>
      </div>
    `
      )
      .join("");
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`;
  }
}

function renderStats(foods) {
  const available = foods.filter((f) => f.status === "available").length;
  const requested = foods.filter((f) => f.status === "requested").length;
  const completed = foods.filter((f) => f.status === "completed").length;

  document.getElementById("statsRow").innerHTML = `
    <div class="stat-box"><div class="num">${foods.length}</div><div class="label">Total Listings</div></div>
    <div class="stat-box"><div class="num">${available}</div><div class="label">Available</div></div>
    <div class="stat-box"><div class="num">${requested}</div><div class="label">Requested</div></div>
    <div class="stat-box"><div class="num">${completed}</div><div class="label">Completed</div></div>
  `;
}

let lastFoods = [];
const origLoadListings = loadListings;

async function editListing(id) {
  try {
    const food = await Api.getFoodById(id);
    openListingModal(food);
  } catch (err) {
    showToast(err.message, true);
  }
}

async function deleteListing(id) {
  if (!confirm("Delete this listing? This cannot be undone.")) return;
  try {
    await Api.deleteFood(id);
    showToast("Listing deleted");
    loadListings();
  } catch (err) {
    showToast(err.message, true);
  }
}

async function loadReceivedRequests() {
  const grid = document.getElementById("requestsGrid");
  grid.innerHTML = `<div class="empty-state">Loading...</div>`;

  try {
    const requests = await Api.getReceivedRequests();

    if (!requests.length) {
      grid.innerHTML = `<div class="empty-state">No requests yet.</div>`;
      return;
    }

    grid.innerHTML = requests
      .map((r) => {
        const canAct = r.status === "pending";
        const canComplete = r.status === "accepted";
        return `
        <div class="ticket">
          <div class="ticket-top">
            <h3>${escapeHtml(r.food ? r.food.foodName : "Deleted listing")}</h3>
            <span class="status ${statusClass(r.status)}">${r.status}</span>
          </div>
          <div class="meta">From: ${escapeHtml(r.receiver.organizationName || r.receiver.name)}</div>
          <div class="meta">📞 ${escapeHtml(r.receiver.phone || "-")}</div>
          <div class="desc">${escapeHtml(r.message) || "No message"}</div>
          <div class="stub"><span>Requested ${formatDate(r.createdAt)}</span></div>
          <div class="actions">
            ${canAct ? `<button class="btn btn-ok" onclick='respondRequest(${JSON.stringify(r._id)}, "accepted")'>Accept</button>
            <button class="btn btn-danger" onclick='respondRequest(${JSON.stringify(r._id)}, "rejected")'>Reject</button>` : ""}
            ${canComplete ? `<button class="btn btn-primary" onclick='respondRequest(${JSON.stringify(r._id)}, "completed")'>Mark Completed</button>` : ""}
          </div>
        </div>
      `;
      })
      .join("");
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`;
  }
}

async function respondRequest(id, status) {
  try {
    await Api.updateRequestStatus(id, status);
    showToast(`Request ${status}`);
    loadReceivedRequests();
    loadListings();
  } catch (err) {
    showToast(err.message, true);
  }
}
