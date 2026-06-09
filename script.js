let cart = JSON.parse(localStorage.getItem("cart")) || [];
let promoPercent = Number(localStorage.getItem("promoPercent")) || 0;
const DELIVERY_FEE = 1500;

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("promoPercent", String(promoPercent));
    updateCartCount();
    loadCart();
}

function addToCart(name, price, img, size, color) {
    price = Number(price);

    const foundIndex = cart.findIndex(item =>
        item.name === name &&
        Number(item.price) === price &&
        item.img === img &&
        item.size === size &&
        item.color === color
    );

    if (foundIndex !== -1) {
        cart[foundIndex].qty += 1;
    } else {
        cart.push({
            name,
            price,
            img,
            size,
            color,
            qty: 1
        });
    }

    saveCart();

    if (typeof showToast === "function") {
        showToast(name, img);
    }
}

function updateQuantity(index, delta) {
    if (!cart[index]) return;

    cart[index].qty += delta;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

function loadCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">Корзина пока пустая 🛒</div>';
        updateSummary(0);
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = Number(item.price) * Number(item.qty || 1);
        subtotal += itemTotal;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" class="cart-img" alt="${item.name}">

                <div class="cart-info">
                    <h3>${item.name}</h3>
                    <div class="cart-meta">
                    Размер: ${item.size}<br>
                    Цвет: ${item.color}
</div>
                
                    <div class="cart-price">${itemTotal.toLocaleString("ru-RU")} ₸</div>
                </div>

                <div class="cart-actions">
                    <div class="qty-box">
                        <button type="button" onclick="updateQuantity(${index}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button type="button" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>

                    <button type="button" class="remove-btn" onclick="removeItem(${index})">
                        Удалить
                    </button>
                </div>
            </div>
        `;
    });

    updateSummary(subtotal);
}

function updateSummary(subtotal) {
    const discount = Math.round(subtotal * (promoPercent / 100));
    const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
    const total = subtotal - discount + delivery;

    const subtotalBox = document.getElementById("subtotal");
    const discountBox = document.getElementById("discount");
    const deliveryBox = document.getElementById("delivery");
    const totalBox = document.getElementById("total");

    if (subtotalBox) subtotalBox.textContent = `${subtotal.toLocaleString("ru-RU")} ₸`;
    if (discountBox) discountBox.textContent = `-${discount.toLocaleString("ru-RU")} ₸`;
    if (deliveryBox) deliveryBox.textContent = `${delivery.toLocaleString("ru-RU")} ₸`;
    if (totalBox) totalBox.textContent = `${total.toLocaleString("ru-RU")} ₸`;
}

function updateCartCount() {
    const counter = document.getElementById("cart-count");
    if (counter) {
        const count = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0);
        counter.textContent = count;
    }
}

function applyPromo() {
    const input = document.getElementById("promo-code");
    if (!input) return;

    const code = input.value.trim().toUpperCase();

    if (code === "STYLE10") {
        promoPercent = 10;
        localStorage.setItem("promoPercent", String(promoPercent));
        alert("Промокод применён: скидка 10%");
        loadCart();
    } else if (code === "") {
        alert("Введите промокод");
    } else {
        promoPercent = 0;
        localStorage.setItem("promoPercent", "0");
        alert("Неверный промокод");
        loadCart();
    }
}

function checkout() {
    if (cart.length === 0) {
        alert("Корзина пустая");
        return;
    }
    openOrderForm();
}

function openOrderForm() {
    const modal = document.getElementById("order-modal");
    if (modal) modal.style.display = "flex";
}

function closeOrderForm() {
    const modal = document.getElementById("order-modal");
    if (modal) modal.style.display = "none";
}

function submitOrder() {
    const name = document.getElementById("order-name")?.value.trim();
    const phone = document.getElementById("order-phone")?.value.trim();
    const address = document.getElementById("order-address")?.value.trim();

    if (!name || !phone || !address) {
        alert("Заполните все поля");
        return;
    }

    alert("Заказ оформлен! Спасибо за покупку 🛍️");

    cart = [];
    promoPercent = 0;
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("promoPercent", "0");

    closeOrderForm();
    updateCartCount();
    loadCart();
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    loadCart();
});

function showToast(name, img){

    const toast = document.getElementById("toast");
    if (!toast) return;

    const nameEl = document.getElementById("toast-name");
    const imgEl = document.getElementById("toast-img");

    if (nameEl) nameEl.innerText = name;
    if (imgEl) imgEl.src = img;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function addToCartFromPage() {

    const name = document.getElementById("product-name").innerText;

    // ✅ УНИВЕРСАЛЬНОЕ ИЗВЛЕЧЕНИЕ ЦЕНЫ
    const priceText = document.getElementById("product-price").innerText;
    const price = parseInt(priceText.replace(/[^\d]/g, "")); // 💥 САМОЕ ВАЖНОЕ ИСПРАВЛЕНИЕ

    const img = document.getElementById("product-img").src;
    const size = document.getElementById("size").value;
    const color = document.getElementById("color").value;

    const foundIndex = cart.findIndex(item =>
        item.name === name &&
        item.price === price &&
        item.size === size &&
        item.color === color
    );

    if (foundIndex !== -1) {
        cart[foundIndex].qty += 1;
    } else {
        cart.push({
            name,
            price,
            img,
            size,
            color,
            qty: 1
        });
    }

    saveCart();
    showToast(name, img);
}