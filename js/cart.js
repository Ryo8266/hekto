/**
 * Shopping Cart System
 * Quản lý giỏ hàng với localStorage
 */

const Cart = {
    // Key lưu trong localStorage
    STORAGE_KEY: 'hekto_cart',

    // Lấy giỏ hàng từ localStorage
    getCart() {
        const cart = localStorage.getItem(this.STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    // Lưu giỏ hàng vào localStorage
    saveCart(cart) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
        this.updateCartIcon();
        this.emitEvent('cart-updated');
    },

    // Xóa sản phẩm khỏi giỏ
    removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
        return cart;
    },

    // Cập nhật số lượng
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart(cart);
        }

        return cart;
    },

    // Xóa toàn bộ giỏ hàng
    clearCart() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateCartIcon();
        this.emitEvent('cart-updated');
        return [];
    },

    // Tính tổng số lượng sản phẩm
    getTotalItems() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Tính tổng tiền
    getTotalPrice() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Cập nhật số lượng trên icon giỏ hàng
    updateCartIcon() {
        const cartIcons = document.querySelectorAll('.fa-basket-shopping, .basket-icon');
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        cartIcons.forEach(icon => {
            // Xóa badge cũ nếu có
            const existingBadge = icon.parentElement.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }

            // Thêm badge mới
            if (totalItems > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = totalItems > 99 ? '99+' : totalItems;
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #FB2E86;
                    color: white;
                    font-size: 10px;
                    font-weight: bold;
                    min-width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                icon.parentElement.style.position = 'relative';
                icon.parentElement.appendChild(badge);
            }
        });
    },

    // Phát custom event
    emitEvent(eventName) {
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        window.dispatchEvent(new CustomEvent(eventName, {
            detail: { cart, totalItems, totalPrice }
        }));
    },

    // Render giỏ hàng ra table (cho shopping-cart.html)
    renderCartTable() {
        const cart = this.getCart();
        const tbody = document.querySelector('.cart-table tbody');

        if (!tbody) return;

        if (cart.length === 0) {
            tbody.textContent = '';
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 4;
            td.style.cssText = 'text-align: center; padding: 40px;';

            const p = document.createElement('p');
            p.style.cssText = 'font-size: 16px; color: #8A8A8A;';
            p.textContent = 'Giỏ hàng của bạn đang trống';

            const a = document.createElement('a');
            a.href = '../index.html';
            a.style.cssText = 'color: #FB2E86; font-weight: 600;';
            a.textContent = 'Tiếp tục mua sắm';

            td.append(p, a);
            tr.appendChild(td);
            tbody.appendChild(tr);
            this.updateTotalsDisplay();
            return;
        }

        tbody.textContent = '';
        const fragment = document.createDocumentFragment();

        cart.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.id = item.id;

            // td-product
            const tdProduct = document.createElement('td');
            tdProduct.className = 'td-product';

            const prodInner = document.createElement('div');
            prodInner.className = 'prod-inner';

            const imgWrap = document.createElement('div');
            imgWrap.className = 'prod-img-wrap';

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;

            const removeSpan = document.createElement('span');
            removeSpan.className = 'remove-icon';
            removeSpan.addEventListener('click', () => {
                Cart.removeItem(item.id);
                Cart.renderCartTable();
            });
            const removeIcon = document.createElement('i');
            removeIcon.className = 'fas fa-times';
            removeSpan.appendChild(removeIcon);

            imgWrap.append(img, removeSpan);

            const prodDetails = document.createElement('div');
            prodDetails.className = 'prod-details';
            const h4 = document.createElement('h4');
            h4.textContent = item.name;
            prodDetails.appendChild(h4);

            if (item.color) {
                const colorP = document.createElement('p');
                colorP.textContent = 'Color: ' + item.color;
                prodDetails.appendChild(colorP);
            }
            if (item.size) {
                const sizeP = document.createElement('p');
                sizeP.textContent = 'Size: ' + item.size;
                prodDetails.appendChild(sizeP);
            }

            prodInner.append(imgWrap, prodDetails);
            tdProduct.appendChild(prodInner);

            // td-price
            const tdPrice = document.createElement('td');
            tdPrice.className = 'td-price';
            tdPrice.textContent = '$' + item.price.toFixed(2);

            // td-qty
            const tdQty = document.createElement('td');
            tdQty.className = 'td-qty';

            const qtyBox = document.createElement('div');
            qtyBox.className = 'qty-box';

            const minusBtn = document.createElement('button');
            minusBtn.textContent = '-';
            minusBtn.addEventListener('click', () => {
                Cart.updateQuantity(item.id, item.quantity - 1);
                Cart.renderCartTable();
            });

            const qtyInput = document.createElement('input');
            qtyInput.type = 'text';
            qtyInput.value = item.quantity;
            qtyInput.readOnly = true;

            const plusBtn = document.createElement('button');
            plusBtn.textContent = '+';
            plusBtn.addEventListener('click', () => {
                Cart.updateQuantity(item.id, item.quantity + 1);
                Cart.renderCartTable();
            });

            qtyBox.append(minusBtn, qtyInput, plusBtn);
            tdQty.appendChild(qtyBox);

            // td-total
            const tdTotal = document.createElement('td');
            tdTotal.className = 'td-total';
            tdTotal.textContent = '$' + (item.price * item.quantity).toFixed(2);

            tr.append(tdProduct, tdPrice, tdQty, tdTotal);
            fragment.appendChild(tr);
        });

        tbody.appendChild(fragment);

        this.updateTotalsDisplay();
    },

    // Cập nhật hiển thị tổng tiền
    updateTotalsDisplay() {
        const subtotal = this.getTotalPrice();
        const shipping = subtotal > 0 ? 10 : 0;
        const total = subtotal + shipping;

        const subtotalEl = document.querySelector('.totals-row:not(.total-final) span:last-child');
        const totalEl = document.querySelector('.total-final span:last-child');

        if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
        if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
    },

    // Khởi tạo
    init() {
        this.updateCartIcon();

        // Lắng nghe khi localStorage thay đổi từ tab khác
        window.addEventListener('storage', (e) => {
            if (e.key === this.STORAGE_KEY) {
                this.updateCartIcon();
                this.renderCartTable();
            }
        });
    }
};

// Tự động khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', () => Cart.init());