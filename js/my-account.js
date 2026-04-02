/**
 * My Account - Login JavaScript
 * Xử lý đăng nhập với API validation
 */

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const submitBtn = document.querySelector('.btn-signin');

    // Kiểm tra form tồn tại
    if (!loginForm) return;

    // Nếu đã đăng nhập, redirect về trang chủ
    if (Auth.isLoggedIn()) {
        window.location.href = '../index.html';
        return;
    }

    // ==================== HELPER FUNCTIONS ====================

    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function setLoading(loading) {
        if (loading) {
            submitBtn.dataset.originalText = submitBtn.textContent;
            submitBtn.textContent = 'Đang xử lý...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
        } else {
            submitBtn.textContent = submitBtn.dataset.originalText || 'Sign In';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    }

    // ==================== INIT ====================

    // Load email đã nhớ (nếu có)
    const rememberedEmail = Auth.getRememberedEmail();
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
    }

    // ==================== EVENT LISTENERS ====================

    emailInput.addEventListener('input', () => clearError(emailInput, emailError));
    passwordInput.addEventListener('input', () => clearError(passwordInput, passwordError));

    // ==================== FORM SUBMIT ====================

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;
        let isValid = true;

        // ----- Validate Client-side -----

        if (emailValue === '') {
            showError(emailInput, emailError, 'Email không được để trống');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailInput, emailError, 'Vui lòng nhập email hợp lệ');
            isValid = false;
        }

        if (passwordValue === '') {
            showError(passwordInput, passwordError, 'Mật khẩu không được để trống');
            isValid = false;
        } else if (passwordValue.length < 6) {
            showError(passwordInput, passwordError, 'Mật khẩu phải có ít nhất 6 ký tự');
            isValid = false;
        }

        if (!isValid) return;

        setLoading(true);

        try {
            // Mock users data (trong thực tế sẽ gọi API thật)
            const mockUsers = [
                { email: 'admin@gmail.com', password: '123456', name: 'Admin' }
            ];

            // Tìm user khớp
            const user = mockUsers.find(
                u => u.email.toLowerCase() === emailValue.toLowerCase() && u.password === passwordValue
            );

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            if (user) {
                // Lưu remember me (nếu có checkbox)
                const rememberMe = document.querySelector('input[type="checkbox"]#remember');
                if (rememberMe && rememberMe.checked) {
                    Auth.rememberEmail(emailValue);
                } else {
                    Auth.forgetEmail();
                }

                // Đăng nhập thành công - sử dụng Auth.login()
                Auth.login({
                    email: user.email,
                    name: user.name
                });

                // Chuyển hướng về trang chủ
                window.location.href = '../index.html';
            } else {
                showError(passwordInput, passwordError, 'Email hoặc mật khẩu không đúng');
                emailInput.classList.add('error');
            }

        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            showError(passwordInput, passwordError, 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    });
});