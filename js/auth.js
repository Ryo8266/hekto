const Auth = {
    KEYS: {
        IS_LOGGED_IN: 'isLoggedIn',
        CURRENT_USER: 'currentUser',
        REMEMBER_ME: 'rememberEmail'
    },

    isLoggedIn() {
        return localStorage.getItem(this.KEYS.IS_LOGGED_IN) === 'true';
    },

    getCurrentUser() {
        const user = localStorage.getItem(this.KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    },

    login(userData) {
        localStorage.setItem(this.KEYS.IS_LOGGED_IN, 'true');
        localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify({
            email: userData.email,
            name: userData.name || userData.email.split('@')[0],
            loginTime: new Date().toISOString()
        }));
        this.updateHeaderUI();
    },

    logout() {
        localStorage.removeItem(this.KEYS.IS_LOGGED_IN);
        localStorage.removeItem(this.KEYS.CURRENT_USER);
        this.updateHeaderUI();

        window.location.href = window.location.pathname.includes('/pages/')
            ? '../index.html'
            : 'index.html';
    },

    rememberEmail(email) {
        localStorage.setItem(this.KEYS.REMEMBER_ME, email);
    },

    getRememberedEmail() {
        return localStorage.getItem(this.KEYS.REMEMBER_ME) || '';
    },

    forgetEmail() {
        localStorage.removeItem(this.KEYS.REMEMBER_ME);
    },

    updateHeaderUI() {
        const loginLinks = document.querySelectorAll('.login');
        const favouriteLinks = document.querySelectorAll('.favourite');

        const isLoggedIn = this.isLoggedIn();
        const user = this.getCurrentUser();

        if (isLoggedIn && user) {
            loginLinks.forEach(link => {
                link.textContent = '';
                const icon = document.createElement('i');
                icon.className = 'fa-regular fa-user';
                link.appendChild(icon);
                link.append(' ' + user.name);
                link.removeAttribute('href');
                link.onclick = null;
            });

            favouriteLinks.forEach(link => {
                link.textContent = 'Logout';
                link.removeAttribute('href');
                link.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
            });
        } else {
            loginLinks.forEach(link => {
                const isPagesFolder = window.location.pathname.includes('/pages/');
                link.textContent = 'Login ';
                const userIcon = document.createElement('i');
                userIcon.className = 'fa-regular fa-user';
                link.appendChild(userIcon);
                link.href = isPagesFolder ? 'my-account.html' : 'pages/my-account.html';
                link.onclick = null;
            });

            favouriteLinks.forEach(link => {
                link.textContent = 'Wishlist ';
                const heartIcon = document.createElement('i');
                heartIcon.className = 'fa-regular fa-heart';
                link.appendChild(heartIcon);
                link.href = '#';
                link.onclick = null;
            });
        }
    },

    init() {
        this.updateHeaderUI();
        Theme.init();
    }
};

const Theme = {
    STORAGE_KEY: 'hekto_theme',

    apply(mode) {
        const isDark = mode === 'dark';
        document.body.classList.toggle('dark', isDark);
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    },

    toggle() {
        const next = document.body.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem(this.STORAGE_KEY, next);
        this.apply(next);
    },

    init() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        this.apply(saved === 'dark' ? 'dark' : 'light');
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.addEventListener('click', () => Theme.toggle());
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());