import { authCss } from "../../css/auth.js";
import { initApp } from "../appEvents.js";
import { html } from "../utils/helpers.js";
import { navigateTo } from "../utils/navigation.js";
import { getUsers, setCurrentUser } from "../utils/storage.js";

export function renderLoginPage(container) {
    container.innerHTML = html`
        ${authCss}
        <div class="auth-container">
            <div class="auth-card">
                <h4 class="mb-3 text-center fw-bold">Welcome Back!</h4>
                <p class="text-muted mb-4 text-center">Login to continue your shopping.</p>
                <form id="login-form" novalidate>
                    <div class="mb-3">
                        <label for="login-username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="login-username" required />
                    </div>
                    <div class="mb-4 position-relative">
                        <label for="login-password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="login-password" required />
                        <i class="fas fa-eye password-toggle"></i>
                    </div>
                    <div class="mb-4 form-check">
                        <input type="checkbox" class="form-check-input" id="remember-me" checked />
                        <label class="form-check-label" for="remember-me"> Remember me </label>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-lg">Login</button>
                    </div>
                </form>
                <p class="text-center text-muted mt-4 mb-0">
                    Don't have an account? <a href="#" data-page="signup-view">Sign Up</a>
                </p>
                <p class="text-center text-muted mt-2 mb-0">
                    <a href="#" data-page="home-view">&larr; Back to Shop</a>
                </p>
            </div>
        </div>
    `;

    document.querySelector("#login-form").addEventListener("submit", (e) => {
        const form = e.target;
        const usernameInput = form.querySelector("#login-username");
        const passwordInput = form.querySelector("#login-password");
        const rememberMeCheckbox = form.querySelector("#remember-me");
        usernameInput.classList.remove("is-invalid");
        passwordInput.classList.remove("is-invalid");
        const users = getUsers();
        const user = users.find((u) => u.username === usernameInput.value);
        if (!user || user.password !== passwordInput.value) {
            usernameInput.classList.add("is-invalid");
            passwordInput.classList.add("is-invalid");
            return;
        }
        setCurrentUser(user, rememberMeCheckbox.checked);
        form.reset();
        initApp(user);

        const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
        const returnTo = urlParams.get("returnTo");
        if (returnTo) {
            window.location.hash = decodeURIComponent(returnTo);
        } else {
            navigateTo("home-view");
        }
    });
}
