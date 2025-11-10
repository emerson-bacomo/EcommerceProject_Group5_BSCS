import { S } from "../state.js";
import { back, getAddressById, getHashParams, html } from "../utils/helpers.js";
import { saveUserData } from "../utils/storage.js";
import { navigateTo } from "../utils/navigation.js";
import { showConfirmationModal } from "../components/Toast.js";
import { mobileMaxWidthPlus1 } from "../config/general.js";

export function renderAddressManagementPage(container) {
    const fromCheckout = getHashParams().fromCheckout;
    const isMobile = window.innerWidth < mobileMaxWidthPlus1;

    const addressesHTML = (S.appData.profile.addresses || [])
        .map(
            (addr) => html`
                <div class="card shadow-sm border-0 address-item p-3" data-id="${addr.id}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="flex-grow-1 me-3">
                            <h6 class="mb-1 fw-bold">${addr.name}</h6>
                            <p class="mb-1 text-muted small">${addr.address}</p>
                            <p class="mb-0 text-muted small">${addr.phone}</p>
                        </div>

                        ${!isMobile
                            ? html`
                                  <div class="d-flex gap-2 flex-shrink-0">
                                      <button
                                          class="btn btn-sm btn-outline-primary edit-btn"
                                          data-id="${addr.id}"
                                          data-bs-toggle="modal"
                                          data-bs-target="#editAddressModal"
                                      >
                                          <i class="fas fa-pen"></i> Edit
                                      </button>
                                      <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${addr.id}">
                                          <i class="fas fa-trash"></i> Delete
                                      </button>
                                  </div>
                              `
                            : ""}
                    </div>
                </div>
            `
        )
        .join("");

    container.innerHTML = html`
        <div class="d-flex align-items-center gap-2 mb-4">
            ${fromCheckout
                ? html`
                      <button class="btn btn-link text-decoration-none p-0 d-flex align-items-center" id="back-btn">
                          <i class="fas fa-arrow-left fs-5"></i>
                      </button>
                  `
                : ""}
            <h4 class="mb-0">Manage Addresses</h4>
        </div>

        <div class="card mb-4">
            <div class="card-body d-flex flex-column gap-3">
                ${addressesHTML || '<p class="text-muted">No saved addresses.</p>'}
            </div>
        </div>

        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAddressModal">+ Add New Address</button>

        <div class="modal fade" id="addAddressModal" tabindex="-1" aria-labelledby="addAddressModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form id="add-address-form" novalidate>
                        <div class="modal-header">
                            <h5 class="modal-title">Add New Address</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Receiver Name</label>
                                <input type="text" class="form-control" required id="addr-name" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Full Address</label>
                                <textarea class="form-control" required id="addr-address"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone Number</label>
                                <input type="number" class="form-control" required id="addr-phone" />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Address</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="modal fade" id="editAddressModal" tabindex="-1" aria-labelledby="editAddressModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form id="edit-address-form" novalidate>
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Address</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Receiver Name</label>
                                <input type="text" class="form-control" required id="edit-addr-name" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Full Address</label>
                                <textarea class="form-control" required id="edit-addr-address"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone Number</label>
                                <input type="number" class="form-control" required id="edit-addr-phone" />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    if (fromCheckout) container.querySelector("#back-btn").addEventListener("click", back);

    const addForm = document.querySelector("#add-address-form");
    addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!addForm.checkValidity()) {
            addForm.classList.add("was-validated");
            return;
        }

        const newAddresses = S.appData.profile.addresses || [];
        newAddresses.push({
            id: Date.now(),
            name: document.getElementById("addr-name").value.trim(),
            address: document.getElementById("addr-address").value.trim(),
            phone: document.getElementById("addr-phone").value.trim(),
        });

        S.appData.profile.addresses = newAddresses;
        saveUserData(S.currentUser, S.appData);

        // eslint-disable-next-line no-undef
        const modal = bootstrap.Modal.getInstance(document.getElementById("addAddressModal"));
        modal.hide();
        renderAddressManagementPage(container);
    });

    if (!isMobile) {
        let editId = null;

        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                editId = Number(btn.dataset.id);
                const addr = getAddressById(editId);
                if (!addr) return;
                document.getElementById("edit-addr-name").value = addr.name;
                document.getElementById("edit-addr-address").value = addr.address;
                document.getElementById("edit-addr-phone").value = addr.phone;
            });
        });

        document.querySelector("#edit-address-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const form = e.target;
            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                return;
            }

            const addrIndex = S.appData.profile.addresses.findIndex((a) => a.id === editId);
            if (addrIndex === -1) return;

            S.appData.profile.addresses[addrIndex] = {
                ...S.appData.profile.addresses[addrIndex],
                name: document.getElementById("edit-addr-name").value.trim(),
                address: document.getElementById("edit-addr-address").value.trim(),
                phone: document.getElementById("edit-addr-phone").value.trim(),
            };

            saveUserData(S.currentUser, S.appData);

            // eslint-disable-next-line no-undef
            const modal = bootstrap.Modal.getInstance(document.getElementById("editAddressModal"));
            modal.hide();
            renderAddressManagementPage(container);
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                const id = Number(btn.dataset.id);
                const addr = getAddressById(id);
                if (!addr) return;

                const bodyHTML = `
                    <div class="text-start">
                        <p>Are you sure you want to delete this address?</p>
                        <div class="border rounded p-2 small">
                            <strong>${addr.name}</strong><br>${addr.address}<br>${addr.phone}
                        </div>
                    </div>
                `;
                const confirmed = await showConfirmationModal(bodyHTML, "Delete Address", "Delete", "btn-danger");
                if (!confirmed) return;

                S.appData.profile.addresses = S.appData.profile.addresses.filter((a) => a.id !== id);
                saveUserData(S.currentUser, S.appData);
                renderAddressManagementPage(container);
            });
        });
    } else {
        document.querySelectorAll(".address-item").forEach((item) => {
            item.addEventListener("click", () => {
                const id = item.dataset.id;
                S.appData.selectedAddressId = id;
                navigateTo(`#address-details-view?id=${id}&fromCheckout=${fromCheckout}`);
            });
        });
    }
}
