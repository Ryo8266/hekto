document.addEventListener('DOMContentLoaded', function () {
    function seedCartFromMarkupIfEmpty() {
        if (Cart.getCart().length > 0) return;

        const rows = document.querySelectorAll('.cart-table tbody tr');
        if (!rows.length) return;

        const seededCart = [];

        rows.forEach((row, index) => {
            const name = row.querySelector('.prod-details h4')?.textContent?.trim() || `Product ${index + 1}`;
            const colorLine = row.querySelector('.prod-details p:nth-of-type(1)')?.textContent || '';
            const sizeLine = row.querySelector('.prod-details p:nth-of-type(2)')?.textContent || '';
            const priceText = row.querySelector('.td-price')?.textContent || '';
            const qtyValue = row.querySelector('.qty-box input')?.value || '1';
            const image = row.querySelector('.prod-img-wrap img')?.getAttribute('src') || '';

            seededCart.push({
                id: `seed-${index + 1}-${String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                name,
                price: parseFloat(String(priceText).replace(/[^0-9.]/g, '')) || 0,
                image,
                color: colorLine.replace(/^Color:\s*/i, '').trim(),
                size: sizeLine.replace(/^Size:\s*/i, '').trim(),
                quantity: Math.max(1, parseInt(qtyValue, 10) || 1)
            });
        });

        Cart.saveCart(seededCart);
    }

    seedCartFromMarkupIfEmpty();
    Cart.renderCartTable();

    const updateBtn = document.querySelector('.btn-update');
    if (updateBtn) {
        updateBtn.addEventListener('click', () => {
            Cart.renderCartTable();
            alert('Giỏ hàng đã được cập nhật!');
        });
    }

    const clearBtn = document.querySelector('.btn-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Bạn có muốn xóa toàn bộ giỏ hàng?')) {
                Cart.clearCart();
                Cart.renderCartTable();
            }
        });
    }

    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (Cart.getCart().length === 0) {
                alert('Giỏ hàng trống!');
                return;
            }

            window.location.href = 'order-completed.html';
        });
    }

    const calcShippingBtn = document.querySelector('.btn-calc');
    if (calcShippingBtn) {
        calcShippingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Tính phí shipping');
        });
    }
});