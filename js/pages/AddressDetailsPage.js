import { S } from "../state.js";
import { html, getAddressById, back } from "../utils/helpers.js";
import { saveUserData } from "../utils/storage.js";
import { navigateTo } from "../utils/navigation.js";
import { showConfirmationModal } from "../components/Toast.js";

export function renderAddressDetailsPage(container) {
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const id = parseInt(params.get("id"));

    container.innerHTML = html`
        <div class="d-flex align-items-center mb-5 gap-3">
            <button class="btn btn-link text-decoration-none p-0" id="back-btn" style="line-height: 1;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h4 class="mb-0">Edit Address</h4>
        </div>
    `;

    const addr = getAddressById(id);
    if (!addr) {
        container.innerHTML += html` <p class="text-muted ps-5">Address not found.</p> `;
    } else {
        container.innerHTML += html`
            <form id="address-details-form" novalidate class="pb-5">
                <div class="mb-3">
                    <label class="form-label">Receiver Name</label>
                    <input type="text" class="form-control" required id="edit-addr-name" value="${addr.name}" />
                </div>

                <div class="mb-3">
                    <label class="form-label">Full Address</label>
                    <textarea class="form-control" required id="edit-addr-address">${addr.address}</textarea>
                </div>

                <div class="mb-3">
                    <label class="form-label">Phone Number</label>
                    <input type="number" class="form-control" required id="edit-addr-phone" value="${addr.phone}" />
                </div>

                <div class="fixed-bottom bg-white border-top p-3 d-flex gap-2">
                    <button type="button" id="delete-address-btn" class="btn btn-danger flex-grow-1">Delete</button>
                    <button type="submit" class="btn btn-primary flex-grow-1">Save Changes</button>
                </div>
            </form>
        `;

        const form = document.querySelector("#address-details-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                return;
            }

            const updated = {
                ...addr,
                name: document.getElementById("edit-addr-name").value.trim(),
                address: document.getElementById("edit-addr-address").value.trim(),
                phone: document.getElementById("edit-addr-phone").value.trim(),
            };

            const index = (S.appData.profile.addresses || []).findIndex((a) => a.id === id);
            if (index !== -1) {
                S.appData.profile.addresses[index] = updated;
                saveUserData(S.currentUser, S.appData);
            }

            navigateTo("#address-management-view");
        });

        document.getElementById("delete-address-btn").addEventListener("click", async () => {
            const confirmed = await showConfirmationModal(
                "Are you sure you want to delete this address?",
                "Delete Address",
                "Delete",
                "btn-danger"
            );
            if (!confirmed) return;

            S.appData.profile.addresses = (S.appData.profile.addresses || []).filter((a) => a.id !== id);
            saveUserData(S.currentUser, S.appData);
            navigateTo("#address-management-view");
        });
    }

    document.getElementById("back-btn").addEventListener("click", back);
}
