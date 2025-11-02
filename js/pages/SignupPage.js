import { showToast } from "../components/Toast.js";
import { html } from "../utils/helpers.js";
import { navigateTo } from "../utils/navigation.js";
import { getUsers, setUsers } from "../utils/storage.js";
import { authCss } from "../../css/auth.js";
import { setupPasswordToggles, setupErrorHandling } from "../utils/formUtilities.js";

export function renderSignupPage(container) {
    container.innerHTML = html`
        ${authCss}
        <div class="auth-container">
            <div class="auth-card">
                <h4 class="text-center fw-bold">Create an Account</h4>
                <p class="text-muted mb-4 text-center">Let's get you started!</p>
                <form id="signup-form" novalidate>
                    <div class="mb-3">
                        <label for="signup-username" class="input-label"> Username <span class="error-message"></span> </label>
                        <input type="text" id="signup-username" class="input-field" required minlength="4" />
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="signup-firstname" class="input-label">
                                First Name <span class="error-message"></span>
                            </label>
                            <input type="text" id="signup-firstname" class="input-field" required />
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="signup-lastname" class="input-label">
                                Last Name <span class="error-message"></span>
                            </label>
                            <input type="text" id="signup-lastname" class="input-field" required />
                        </div>
                    </div>

                    <div class="mb-3 position-relative">
                        <label for="signup-password" class="input-label"> Password <span class="error-message"></span> </label>
                        <input type="password" id="signup-password" class="input-field" required minlength="8" />
                        <i class="fas fa-eye password-toggle"></i>
                    </div>

                    <div class="mb-4 position-relative">
                        <label for="signup-confirm-password" class="input-label">
                            Confirm Password <span class="error-message"></span>
                        </label>
                        <input type="password" id="signup-confirm-password" class="input-field" required />
                        <i class="fas fa-eye password-toggle"></i>
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

    const form = document.querySelector("#signup-form");

    setupPasswordToggles(form);
    const { showError, clearError, fields } = setupErrorHandling(form, [
        "#signup-username",
        "#signup-firstname",
        "#signup-lastname",
        "#signup-password",
        "#signup-confirm-password",
    ]);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const [username, firstName, lastName, password, confirmPassword] = fields;
        const users = getUsers();

        fields.forEach(clearError);

        if (!username.value.trim()) showError(username, "(required)");
        else if (username.value.length < 4) showError(username, "(min 4)");
        else if (users.some((u) => u.username === username.value)) showError(username, "(taken)");

        if (!firstName.value.trim()) showError(firstName, "(required)");
        if (!lastName.value.trim()) showError(lastName, "(required)");

        if (!password.value) showError(password, "(required)");
        else if (password.value.length < 8) showError(password, "(less than 8)");

        if (!confirmPassword.value) showError(confirmPassword, "(required)");
        else if (confirmPassword.value !== password.value) showError(confirmPassword, "(mismatch)");

        if (form.querySelectorAll(".error-visible").length > 0) return;

        users.push({
            username: username.value,
            firstName: firstName.value,
            lastName: lastName.value,
            password: password.value,
        });

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
