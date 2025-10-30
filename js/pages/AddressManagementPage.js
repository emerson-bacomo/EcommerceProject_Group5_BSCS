import { S } from "../state.js";
import { html } from "../utils/helpers.js";
import { saveUserData } from "../utils/storage.js";

export function renderAddressManagementPage(container) {
    const fromCheckout = window.location.hash.endsWith("fromCheckout=true");

    const addressesHTML = (S.appData.profile.addresses || [])
        .map(
            (addr, index) => html`
                <div class="d-flex justify-content-between align-items-start card card-body mb-2">
                    <div><strong>${addr.name}</strong><br />${addr.address}<br /><small>Phone: ${addr.phone}</small></div>
                    <button
                        class="btn btn-sm btn-outline-danger delete-address-btn"
                        data-index="${index}"
                        aria-label="Delete address"
                    >
                        &times;
                    </button>
                </div>
            `
        )
        .join("");

    let backButtonHTML = fromCheckout
        ? html`<button class="btn btn-secondary" data-page="checkout-view">Back to Checkout</button>`
        : "";

    container.innerHTML = html`
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Manage Addresses</h1>
            ${backButtonHTML}
        </div>
        <div class="card mb-4">
            <div class="card-body">${addressesHTML || '<p class="text-muted">No saved addresses.</p>'}</div>
        </div>
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Add New Address</h4>
                <form id="add-address-form" novalidate>
                    <div class="mb-3">
                        <label class="form-label">Receiver Name</label
                        ><input type="text" class="form-control" required id="addr-name" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Full Address</label
                        ><textarea class="form-control" required id="addr-address"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Phone Number</label
                        ><input type="number" class="form-control" required id="addr-phone" />
                    </div>
                    <button type="submit" class="btn btn-primary">Add Address</button>
                </form>
            </div>
        </div>
    `;

    document.querySelectorAll(".delete-address-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = Number(e.target.dataset.index);
            (S.appData.profile.addresses || []).splice(index, 1);
            saveUserData(S.currentUser, S.appData);
            renderAddressManagementPage(container);
        });
    });

    document.querySelector("#add-address-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const form = e.target;
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }
        S.appData.profile.addresses = (S.appData.profile.addresses || []).push({
            name: document.getElementById("addr-name").value,
            address: document.getElementById("addr-address").value,
            phone: document.getElementById("addr-phone").value,
        });
        saveUserData(S.currentUser, S.appData);
        renderAddressManagementPage(container);
    });
}
