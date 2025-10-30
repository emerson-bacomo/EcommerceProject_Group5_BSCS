let toastStyleInjected = false;

function ensureToastStyles() {
    if (toastStyleInjected) return;
    const style = document.createElement('style');
    style.textContent = `#toast-container .toast { transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out; }`;
    document.head.appendChild(style);
    toastStyleInjected = true;
}

export const showToast = (message, type = 'success', infoMessage = null) => {
    ensureToastStyles();
    const toastContainer = document.getElementById('toast-container');
    const toastId = 'toast-' + Date.now();
    const defaultDuration = 3000; const infoDuration = 5000;
    let toastColor, iconHTML;
    switch (type) {
        case 'danger': toastColor = 'bg-danger'; iconHTML = `<i class="fas fa-exclamation-triangle me-2"></i>`; break;
        case 'info': toastColor = 'bg-primary'; iconHTML = `<i class="fas fa-info-circle me-2"></i>`; message = `Note: ${message}`; break;
        case 'success': default:
            toastColor = 'bg-success'; iconHTML = `<i class="fas fa-check-circle me-2"></i>`; break;
    }
    let bodyHTML = `<div class="d-flex align-items-center">${iconHTML} ${message}</div>`;
    if (infoMessage) bodyHTML += `<div class="d-flex align-items-center mt-2"><i class="fas fa-info-circle me-2"></i> ${infoMessage}</div>`;
    const toastHTML = `<div id="${toastId}" class="toast align-items-center text-white ${toastColor} border-0" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${bodyHTML}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastDuration = type === 'info' || infoMessage ? infoDuration : defaultDuration;
    const toast = new bootstrap.Toast(document.getElementById(toastId), { delay: toastDuration });
    toast.show();
    document.getElementById(toastId).addEventListener('hidden.bs.toast', (e) => e.target.remove());
};

export function showConfirmationModal(body, title = 'Confirmation', confirmText = 'Confirm', confirmClass = 'btn-danger') {
    const modalEl = document.getElementById('customConfirmModal');
    const modal = new bootstrap.Modal(modalEl);
    modalEl.querySelector('#customConfirmModalLabel').textContent = title;
    modalEl.querySelector('#customConfirmModalBody').textContent = body;
    const confirmBtnOld = modalEl.querySelector('#custom-confirm-confirm-btn');
    confirmBtnOld.textContent = confirmText;
    confirmBtnOld.className = `btn ${confirmClass}`;
    const cancelBtnOld = modalEl.querySelector('#custom-confirm-cancel-btn');
    const confirmBtn = confirmBtnOld.cloneNode(true);
    const cancelBtn = cancelBtnOld.cloneNode(true);
    confirmBtnOld.parentNode.replaceChild(confirmBtn, confirmBtnOld);
    cancelBtnOld.parentNode.replaceChild(cancelBtn, cancelBtnOld);
    modal.show();
    return new Promise((resolve) => {
        confirmBtn.addEventListener('click', () => { resolve(true); modal.hide(); });
        cancelBtn.addEventListener('click', () => { resolve(false); modal.hide(); });
    });
}


