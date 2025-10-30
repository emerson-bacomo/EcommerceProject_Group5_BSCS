const USERS_KEY = 'users';
const LOGGED_IN_KEY = 'loggedInUser';

export function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function setUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
    const v = localStorage.getItem(LOGGED_IN_KEY) || sessionStorage.getItem(LOGGED_IN_KEY);
    return v ? JSON.parse(v) : null;
}

export function setCurrentUser(user, remember = true) {
    if (remember) localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(user));
    else sessionStorage.setItem(LOGGED_IN_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
    sessionStorage.removeItem(LOGGED_IN_KEY);
    localStorage.removeItem(LOGGED_IN_KEY);
}

export function loadUserData(user) {
    if (!user) return null;
    const data = localStorage.getItem(`ecommerce_data_${user.username}`);
    return data ? JSON.parse(data) : null;
}

export function saveUserData(user, appData) {
    if (!user) return;
    localStorage.setItem(`ecommerce_data_${user.username}`, JSON.stringify(appData));
}


