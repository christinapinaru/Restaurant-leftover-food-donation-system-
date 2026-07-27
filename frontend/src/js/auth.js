// ---------- Login page ----------
function initLoginPage() {
  if (Auth.isLoggedIn()) {
    window.location.href = roleHome(Auth.getUser().role);
    return;
  }

  const form = document.getElementById("loginForm");
  const errorBox = document.getElementById("errorBox");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.style.display = "none";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Logging in...";

    try {
      const data = await Api.login({ email, password });
      const { token, ...user } = data;
      Auth.setSession(token, user);
      window.location.href = roleHome(user.role);
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = "block";
    } finally {
      btn.disabled = false;
      btn.textContent = "Log in";
    }
  });
}

// ---------- Register page ----------
function initRegisterPage() {
  if (Auth.isLoggedIn()) {
    window.location.href = roleHome(Auth.getUser().role);
    return;
  }

  const form = document.getElementById("registerForm");
  const errorBox = document.getElementById("errorBox");
  const orgLabel = document.getElementById("orgLabel");
  const orgField = document.getElementById("orgField");
  const adminSecretField = document.getElementById("adminSecretField");

  // Update visible fields depending on selected role
  form.querySelectorAll('input[name="role"]').forEach((input) => {
    input.addEventListener("change", () => {
      if (input.value === "admin") {
        orgField.style.display = "none";
        adminSecretField.style.display = "block";
      } else {
        orgField.style.display = "block";
        adminSecretField.style.display = "none";
        orgLabel.textContent =
          input.value === "restaurant" ? "Restaurant Name" : "NGO / Organization Name";
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.style.display = "none";

    const role = form.querySelector('input[name="role"]:checked').value;

    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
      role,
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      organizationName: document.getElementById("organizationName").value.trim(),
    };

    if (role === "admin") {
      payload.adminSecret = document.getElementById("adminSecret").value;
    }

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Creating account...";

    try {
      const data = await Api.register(payload);
      const { token, ...user } = data;
      Auth.setSession(token, user);
      showToast("Account created! Welcome aboard.");
      window.location.href = roleHome(user.role);
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = "block";
    } finally {
      btn.disabled = false;
      btn.textContent = "Create account";
    }
  });
}
