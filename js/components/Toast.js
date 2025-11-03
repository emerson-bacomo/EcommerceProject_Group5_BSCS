import { mobileMaxWidthPlus1 } from "../config/general.js";
import { html } from "../utils/helpers.js";

export const showToast = (message, type = "success", infoMessage = null) => {
    const toastContainer = document.getElementById("toast-container");
    const toastId = "toast-" + Date.now();
    const defaultDuration = 3000;
    const infoDuration = 5000;
    let toastColor, iconHTML;
    switch (type) {
        case "danger":
            toastColor = "bg-danger";
            iconHTML = html`<i class="fas fa-exclamation-triangle me-2"></i>`;
            break;
        case "info":
            toastColor = "bg-primary";
            iconHTML = html`<i class="fas fa-info-circle me-2"></i>`;
            message = `Note: ${message}`;
            break;
        case "success":
        default:
            toastColor = "bg-success";
            iconHTML = html`<i class="fas fa-check-circle me-2"></i>`;
            break;
    }
    let bodyHTML = html`<div class="d-flex align-items-center">${iconHTML} ${message}</div>`;
    if (infoMessage)
        bodyHTML += html`
            <div class="d-flex align-items-start mt-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-info-icon lucide-info me-2"
                    style="margin-top: -2px;"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                </svg>
                <div style="opacity: 0.8">${infoMessage}</div>
            </div>
        `;

    const toastHTML = html`
        <style>
            #toast-container {
                position: fixed;
                bottom: 1rem;
                right: 1rem;
                z-index: 1100;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            #toast-container .toast {
                transition: opacity 0.25s ease, transform 0.25s ease;
                border-radius: var(--bs-border-radius-lg);
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
                border: 1px solid white !important;
            }
            @media (max-width: ${mobileMaxWidthPlus1}px) {
                #toast-container {
                    top: auto;
                    bottom: 1rem;
                    left: 50%;
                    right: auto;
                    transform: translateX(-50%);
                    width: calc(100% - 2rem);
                    max-width: none;
                    align-items: center;
                }
                #toast-container .toast {
                    width: 100%;
                    font-size: 0.95rem;
                }
                #toast-container .toast .toast-body {
                    padding: 0.75rem 1rem;
                }
                #toast-container .btn-close {
                    transform: scale(1.2);
                }
            }
        </style>

        <div
            id="${toastId}"
            class="toast align-items-center text-white ${toastColor} border-0"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div class="d-flex">
                <div class="toast-body">${bodyHTML}</div>
                <button
                    type="button"
                    class="btn-close btn-close-white me-3 m-auto"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                ></button>
            </div>
        </div>
    `;
    toastContainer.insertAdjacentHTML("beforeend", toastHTML);
    const toastDuration = type === "info" || infoMessage ? infoDuration : defaultDuration;
    // eslint-disable-next-line no-undef
    const toast = new bootstrap.Toast(document.getElementById(toastId), { delay: toastDuration });
    toast.show();
    document.getElementById(toastId).addEventListener("hidden.bs.toast", (e) => e.target.remove());
};

export function showConfirmationModal(body, title = "Confirmation", confirmText = "Confirm", confirmClass = "btn-danger") {
    const modalEl = document.getElementById("customConfirmModal");
    // eslint-disable-next-line no-undef
    const modal = new bootstrap.Modal(modalEl);
    modalEl.querySelector("#customConfirmModalLabel").textContent = title;
    modalEl.querySelector("#customConfirmModalBody").innerHTML = body;
    const confirmBtnOld = modalEl.querySelector("#custom-confirm-confirm-btn");
    confirmBtnOld.textContent = confirmText;
    confirmBtnOld.className = `btn ${confirmClass}`;
    const cancelBtnOld = modalEl.querySelector("#custom-confirm-cancel-btn");
    const confirmBtn = confirmBtnOld.cloneNode(true);
    const cancelBtn = cancelBtnOld.cloneNode(true);
    confirmBtnOld.parentNode.replaceChild(confirmBtn, confirmBtnOld);
    cancelBtnOld.parentNode.replaceChild(cancelBtn, cancelBtnOld);
    modal.show();
    return new Promise((resolve) => {
        confirmBtn.addEventListener("click", () => {
            resolve(true);
            modal.hide();
        });
        cancelBtn.addEventListener("click", () => {
            resolve(false);
            modal.hide();
        });
    });
}
