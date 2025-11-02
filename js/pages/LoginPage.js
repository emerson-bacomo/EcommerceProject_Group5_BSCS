import { html } from "../utils/helpers.js";
import { navigateTo } from "../utils/navigation.js";
import { getUsers, setCurrentUser } from "../utils/storage.js";
import { initApp } from "../appEvents.js";
import { authCss } from "../../css/auth.js";
import { setupPasswordToggles, setupErrorHandling } from "../utils/formUtilities.js";

export function renderLoginPage(container) {
    container.innerHTML = html`
        ${authCss}
        <div class="auth-container">
            <div class="auth-card">
                <h4 class="text-center fw-bold mb-3">Welcome Back!</h4>
                <p class="text-muted text-center mb-4">Login to continue your shopping.</p>

                <form id="login-form" novalidate>
                    <div class="mb-3">
                        <label for="login-username" class="input-label"> Username <span class="error-message"></span> </label>
                        <input type="text" id="login-username" class="input-field" required />
                    </div>

                    <div class="mb-4 position-relative">
                        <label for="login-password" class="input-label"> Password <span class="error-message"></span> </label>
                        <input type="password" id="login-password" class="input-field" required />
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

    const form = document.querySelector("#login-form");
    setupPasswordToggles(form);
    const { showError, clearError, fields } = setupErrorHandling(form, ["#login-username", "#login-password"]);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const [username, password] = fields;
        const users = getUsers();
        const user = users.find((u) => u.username === username.value);
        fields.forEach(clearError);

        if (!user) return showError(username, "(not found)");
        if (user.password !== password.value) return showError(password, "(incorrect)");

        setCurrentUser(user, form.querySelector("#remember-me").checked);
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
