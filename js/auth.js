/**
 * Authentication System
 * Quản lý trạng thái đăng nhập với localStorage
 */

const Auth = {
    // Keys lưu trong localStorage
    KEYS: {
        IS_LOGGED_IN: 'isLoggedIn',
        CURRENT_USER: 'currentUser',
        REMEMBER_ME: 'rememberEmail'
    },

    // Kiểm tra đã đăng nhập chưa
    isLoggedIn() {
        return localStorage.getItem(this.KEYS.IS_LOGGED_IN) === 'true';
    },

    // Lấy thông tin user hiện tại
    getCurrentUser() {
        const user = localStorage.getItem(this.KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    },

    // Đăng nhập
    login(userData) {
        localStorage.setItem(this.KEYS.IS_LOGGED_IN, 'true');
        localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify({
            email: userData.email,
            name: userData.name || userData.email.split('@')[0],
            loginTime: new Date().toISOString()
        }));
        this.updateHeaderUI();
    },

    // Đăng xuất
    logout() {
        localStorage.removeItem(this.KEYS.IS_LOGGED_IN);
        localStorage.removeItem(this.KEYS.CURRENT_USER);
        this.updateHeaderUI();

        // Chuyển về trang chủ
        window.location.href = window.location.pathname.includes('/pages/')
            ? '../index.html'
            : 'index.html';
    },

    // Lưu email để nhớ
    rememberEmail(email) {
        localStorage.setItem(this.KEYS.REMEMBER_ME, email);
    },

    // Lấy email đã nhớ
    getRememberedEmail() {
        return localStorage.getItem(this.KEYS.REMEMBER_ME) || '';
    },

    // Xóa email đã nhớ
    forgetEmail() {
        localStorage.removeItem(this.KEYS.REMEMBER_ME);
    },

    // Cập nhật UI Header
    updateHeaderUI() {
        const loginLinks = document.querySelectorAll('.login');
        const favouriteLinks = document.querySelectorAll('.favourite');

        const isLoggedIn = this.isLoggedIn();
        const user = this.getCurrentUser();

        if (isLoggedIn && user) {
            // Đã đăng nhập: hiển thị tên user và link logout trực tiếp
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
            // Chưa đăng nhập: trả về Login + Wishlist mặc định
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

    // Khởi tạo
    init() {
        this.updateHeaderUI();
        Theme.init();
    }
};

// ==================== THEME TOGGLE ====================
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

// Tự động khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', () => Auth.init());