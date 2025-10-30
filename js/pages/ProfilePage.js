import { showToast } from "../components/Toast.js";
import { S } from "../state.js";
import { html } from "../utils/helpers.js";
import { saveUserData } from "../utils/storage.js";

export function renderProfilePage(container) {
    const { firstName = "", lastName = "" } = S.appData.profile || {};
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
            (icon) =>
                html`<i
                    class="fas ${icon} fa-2x p-2 rounded-circle"
                    data-icon="${icon}"
                    title="${icon.replace("fa-", "").replace("-", " ")}"
                ></i> `
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
                        <form id="profile-info-form" novalidate>
                            <div class="mb-3">
                                <label class="form-label">First Name</label
                                ><input type="text" class="form-control" value="${firstName}" id="profile-firstname" required />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Last Name</label
                                ><input type="text" class="form-control" value="${lastName}" id="profile-lastname" required />
                            </div>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                    </div>
                </div>
                <div class="card">
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

    document.querySelector("#profile-info-form").addEventListener("submit", (e) => {
        const form = e.target;
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        S.appData.profile.firstName = document.getElementById("profile-firstname").value;
        S.appData.profile.lastName = document.getElementById("profile-lastname").value;
        saveUserData(S.currentUser, S.appData);
        showToast("Profile updated!", "success");
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
