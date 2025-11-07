import { showToast } from "../components/Toast.js";
import { S } from "../state.js";
import { html } from "../utils/helpers.js";
import { getUsers, setUsers } from "../utils/storage.js";
import { authCss } from "../../css/auth.js";
import { setupPasswordToggles, setupErrorHandling } from "../utils/formUtilities.js";

export function renderSettingsPage(container) {
    const users = getUsers();
    const currentUser = S.currentUser ? users.find((u) => u.username === S.currentUser.username) : null;
    if (!currentUser) return;

    container.innerHTML = html`
        ${authCss}
        <h1 class="mb-4">Settings</h1>
        <div class="row justify-content-center">
            <div class="col-lg-8 col-xl-6">
                <div class="card mb-4">
                    <div class="card-body">
                        <h4 class="card-title">Account</h4>
                        <p class="text-muted mb-4">Change your password.</p>
                        <form id="settings-password-form" novalidate>
                            <div class="mb-3 position-relative">
                                <label for="current-password" class="input-label">
                                    Current Password <span class="error-message"></span>
                                </label>
                                <input type="password" id="current-password" class="input-field" required />
                                <i class="fas fa-eye password-toggle"></i>
                            </div>

                            <div class="mb-3 position-relative">
                                <label for="new-password" class="input-label">
                                    New Password <span class="error-message"></span>
                                </label>
                                <input type="password" id="new-password" class="input-field" required minlength="8" />
                                <i class="fas fa-eye password-toggle"></i>
                            </div>

                            <div class="mb-4 position-relative">
                                <label for="confirm-password" class="input-label">
                                    Confirm New Password <span class="error-message"></span>
                                </label>
                                <input type="password" id="confirm-password" class="input-field" required />
                                <i class="fas fa-eye password-toggle"></i>
                            </div>

                            <div class="text-end">
                                <button type="submit" class="btn btn-primary">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    const form = document.getElementById("settings-password-form");
    setupPasswordToggles(form);
    const { showError, clearError, fields } = setupErrorHandling(form, [
        "#current-password",
        "#new-password",
        "#confirm-password",
    ]);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const [currentPasswordInput, newPasswordInput, confirmPasswordInput] = fields;

        fields.forEach(clearError);

        if (!currentPasswordInput.value) showError(currentPasswordInput, "(required)");
        else if (currentPasswordInput.value !== currentUser.password) showError(currentPasswordInput, "(incorrect)");

        if (!newPasswordInput.value) showError(newPasswordInput, "(required)");
        else if (newPasswordInput.value.length < 8) showError(newPasswordInput, "(less than 8)");

        if (!confirmPasswordInput.value) showError(confirmPasswordInput, "(required)");
        else if (confirmPasswordInput.value !== newPasswordInput.value) showError(confirmPasswordInput, "(mismatch)");

        if (form.querySelectorAll(".error-visible").length > 0) return;

        const allUsers = getUsers();
        const idx = allUsers.findIndex((u) => u.username === currentUser.username);
        if (idx !== -1) {
            allUsers[idx].password = newPasswordInput.value;
            setUsers(allUsers);
        }

        showToast("Password updated successfully.", "success");
        form.reset();
    });
}
