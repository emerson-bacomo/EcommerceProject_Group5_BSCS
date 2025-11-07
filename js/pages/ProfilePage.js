// import { showToast } from "../components/Toast.js";
import { S } from "../state.js";
import { html } from "../utils/helpers.js";
import { saveUserData } from "../utils/storage.js";

export function renderProfilePage(container) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find((u) => u.username === S.currentUser.username);
    if (!currentUser) return;

    const { firstName = "", lastName = "" } = currentUser;

    const profileIconOptions = [
        "fa-user",
        "fa-user-astronaut",
        "fa-user-ninja",
        "fa-user-secret",
        "fa-user-tie",
        "fa-cat",
        "fa-dog",
        "fa-ghost",
    ];

    const iconSelectorsHTML = profileIconOptions
        .map(
            (icon) => html`
                <i
                    class="fas ${icon} fa-2x p-2 rounded-circle"
                    data-icon="${icon}"
                    title="${icon.replace("fa-", "").replace("-", " ")}"
                ></i>
            `
        )
        .join("");

    container.innerHTML = html`
        <style>
            #profile-icon-selector i {
                cursor: pointer;
                transition: all 0.2s ease;
                background-color: #f1f1f1;
                width: 48px;
                height: 48px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            #profile-icon-selector i:hover {
                background-color: #e0e0e0;
            }
            #profile-icon-selector i.active {
                background-color: var(--bs-primary);
                color: white;
            }
        </style>
        <h1 class="mb-4">My Profile</h1>
        <div class="row justify-content-center">
            <div class="col-lg-8 col-xl-6">
                <div class="card mb-4">
                    <div class="card-body">
                        <h4 class="card-title">Personal Information</h4>
                        <label class="my-2 mb-3">Username: @${currentUser.username}</label>
                        <form id="profile-info-form" novalidate>
                            <div class="mb-3">
                                <label class="form-label">First Name</label>
                                <input type="text" class="form-control" value="${firstName}" id="profile-firstname" required />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Last Name</label>
                                <input type="text" class="form-control" value="${lastName}" id="profile-lastname" required />
                            </div>
                            <div class="text-end">
                                <button type="submit" class="btn btn-primary d-none" id="save-profile-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="card d-none d-lg-block">
                    <div class="card-body">
                        <h4 class="card-title">Profile Icon</h4>
                        <p class="text-muted">Select your icon:</p>
                        <div class="d-flex flex-wrap gap-3" id="profile-icon-selector">${iconSelectorsHTML}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const currentIcon = S.appData.profile?.pfpIcon || "fa-user";
    const activeIconEl = container.querySelector(`#profile-icon-selector i[data-icon="${currentIcon}"]`);
    if (activeIconEl) activeIconEl.classList.add("active");

    const firstNameInput = document.getElementById("profile-firstname");
    const lastNameInput = document.getElementById("profile-lastname");
    const saveBtn = document.getElementById("save-profile-btn");

    const initialValues = { firstName, lastName };

    function checkChanges() {
        if (firstNameInput.value !== initialValues.firstName || lastNameInput.value !== initialValues.lastName) {
            saveBtn.classList.remove("d-none");
        } else {
            saveBtn.classList.add("d-none");
        }
    }

    firstNameInput.addEventListener("input", checkChanges);
    lastNameInput.addEventListener("input", checkChanges);

    document.querySelector("#profile-info-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const form = e.target;
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const userIndex = users.findIndex((u) => u.username === S.currentUser.username);
        if (userIndex !== -1) {
            users[userIndex].firstName = firstNameInput.value;
            users[userIndex].lastName = lastNameInput.value;
            localStorage.setItem("users", JSON.stringify(users));
        }

        // showToast("Profile updated!", "success");

        // Update initial values so button hides again
        initialValues.firstName = firstNameInput.value;
        initialValues.lastName = lastNameInput.value;
        saveBtn.classList.add("d-none");
    });

    document.querySelectorAll("#profile-icon-selector i").forEach((iconSelector) => {
        iconSelector.addEventListener("click", () => {
            const newIcon = iconSelector.dataset.icon;
            S.appData.profile.pfpIcon = newIcon;
            saveUserData(S.currentUser, S.appData);
            const navIcon = document.getElementById("nav-profile-icon");
            if (navIcon) navIcon.className = `fas ${newIcon} fa-lg`;
            document.querySelectorAll("#profile-icon-selector i").forEach((i) => i.classList.remove("active"));
            iconSelector.classList.add("active");
        });
    });
}
