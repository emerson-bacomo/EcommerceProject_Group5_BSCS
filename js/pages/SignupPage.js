import { authCss } from "../../css/auth.js";
import { showToast } from "../components/Toast.js";
import { html } from "../utils/helpers.js";
import { navigateTo } from "../utils/navigation.js";
import { getUsers, setUsers } from "../utils/storage.js";

export function renderSignupPage(container) {
    container.innerHTML = html`
        ${authCss}
        <div class="auth-container">
            <div class="auth-card">
                <h4 class="mb-3 text-center fw-bold">Create an Account</h4>
                <p class="text-muted mb-4 text-center">Let's get you started!</p>
                <form id="signup-form" novalidate>
                    <div class="mb-3">
                        <label for="signup-username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="signup-username" required minlength="4" />
                        <div class="invalid-feedback">Username must be at least 4 characters.</div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="signup-firstname" class="form-label">First Name</label>
                            <input type="text" class="form-control" id="signup-firstname" required />
                            <div class="invalid-feedback">Please enter your first name.</div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="signup-lastname" class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="signup-lastname" required />
                            <div class="invalid-feedback">Please enter your last name.</div>
                        </div>
                    </div>

                    <div class="mb-3 position-relative">
                        <label for="signup-password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="signup-password" required minlength="8" />
                        <i class="fas fa-eye password-toggle"></i>
                        <div id="password-help" class="form-text">Password must be at least 8 characters long.</div>
                        <div class="invalid-feedback">Password is too short.</div>
                    </div>

                    <div class="mb-4 position-relative">
                        <label for="signup-confirm-password" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="signup-confirm-password" required />
                        <i class="fas fa-eye password-toggle"></i>
                        <div class="invalid-feedback">Passwords do not match.</div>
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-lg">Create Account</button>
                    </div>
                </form>
                <p class="text-center text-muted mt-4 mb-0">
                    Already have an account? <a href="#" data-page="login-view">Login</a>
                </p>
                <p class="text-center text-muted mt-2 mb-0">
                    <a href="#" data-page="home-view">&larr; Back to Shop</a>
                </p>
            </div>
        </div>
    `;

    document.querySelector("#signup-form").addEventListener("submit", (e) => {
        const form = e.target;
        let isValid = true;

        form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));

        const username = form.querySelector("#signup-username");
        if (username.value.length < 4) {
            username.classList.add("is-invalid");
            isValid = false;
        }
        const users = getUsers();
        if (users.some((u) => u.username === username.value)) {
            username.classList.add("is-invalid");
            username.nextElementSibling.textContent = "Username is already taken.";
            isValid = false;
        } else {
            username.nextElementSibling.textContent = "Username must be at least 4 characters.";
        }
        const firstName = form.querySelector("#signup-firstname");
        if (firstName.value.trim() === "") {
            firstName.classList.add("is-invalid");
            isValid = false;
        }
        const lastName = form.querySelector("#signup-lastname");
        if (lastName.value.trim() === "") {
            lastName.classList.add("is-invalid");
            isValid = false;
        }
        const password = form.querySelector("#signup-password");
        if (password.value.length < 8) {
            password.classList.add("is-invalid");
            isValid = false;
        }
        const confirmPassword = form.querySelector("#signup-confirm-password");
        if (password.value !== confirmPassword.value || confirmPassword.value === "") {
            confirmPassword.classList.add("is-invalid");
            isValid = false;
        }
        if (!isValid) return;
        const newUser = {
            username: username.value,
            firstName: firstName.value,
            lastName: lastName.value,
            password: password.value,
        };

        users.push(newUser);
        setUsers(users);
        showToast("Sign up successful! Please log in.");
        form.reset();

        const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
        const returnTo = urlParams.get("returnTo");
        if (returnTo) {
            window.location.hash = `#login-view?returnTo=${encodeURIComponent(returnTo)}`;
        } else {
            navigateTo("login-view");
        }
    });
}
