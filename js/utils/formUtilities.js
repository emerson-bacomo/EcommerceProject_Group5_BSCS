export function setupPasswordToggles(form) {
    form.querySelectorAll(".password-toggle").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const input = toggle.previousElementSibling;
            const visible = input.type === "text";
            input.type = visible ? "password" : "text";
            toggle.classList.toggle("fa-eye");
            toggle.classList.toggle("fa-eye-slash");
        });
    });
}

export function setupErrorHandling(form, fieldSelectors) {
    const fields = fieldSelectors.map((sel) => form.querySelector(sel));

    const showError = (input, message) => {
        const label = input.parentElement.querySelector(".error-message");
        input.classList.add("input-error");
        label.textContent = message;
        label.classList.add("error-visible");
    };

    const clearError = (input) => {
        const label = input.parentElement.querySelector(".error-message");
        input.classList.remove("input-error");
        label.textContent = "";
        label.classList.remove("error-visible");
    };

    fields.forEach((input) => {
        input.addEventListener("input", () => clearError(input));
    });

    return { showError, clearError, fields };
}
