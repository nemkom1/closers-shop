let tg = window.Telegram.WebApp;
tg.expand();

let user = tg.initDataUnsafe?.user || {
    id: Math.floor(Math.random() * 1000000),
    first_name: 'Гость',
    username: 'guest'
};

const API_URL = 'https://closers-backend.onrender.com/api';
const ADMIN_CONTACT = 'https://t.me/closersmanager';
const BOT_USERNAME = 'closers_shop_bot';

// ========== РЕФЕРАЛЬНАЯ ПРОГРАММА ==========
const referredBy = tg.initDataUnsafe?.start_param || null;
const referralLink = `https://t.me/${BOT_USERNAME}?startapp=${user.id}`;

window.shareReferralLink = function() {
    const text = 'Заказываю оригинальные вещи с POIZON через CLOSERS — переходи по ссылке, оформи первый заказ и получи скидку';
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`);
};

window.copyReferralLink = function() {
    navigator.clipboard.writeText(referralLink).then(() => {
        tg.showAlert('Ссылка скопирована');
    }).catch(() => {
        tg.showAlert(referralLink);
    });
};

// Промокоды
let appliedPromo = null;
const VALID_PROMOS = {
    'CLOSERS10': { discount: 10, type: 'percent' },
    'FIRST5': { discount: 5, type: 'percent' },
    'FREESHIP': { discount: 500, type: 'fixed' }
};

// Категории
let currentCategory = 'all';
const CATEGORY_META = {
    shoes: { icon: 'icon-shoes' },
    clothes: { icon: 'icon-shirt' },
    perfume: { icon: 'icon-perfume' },
    glasses: { icon: 'icon-glasses' },
    bags: { icon: 'icon-bag' }
};

// ========== КАТАЛОГ ==========
const CATALOG = [
    { id: 1, name: 'Nike Air Jordan 1 High OG', price: '195$', image: 'AJ1', category: 'shoes', photos: [
        'https://images.stockx.com/360/Air-Jordan-1-High-OG-Black-White/Images/Air-Jordan-1-High-OG-Black-White/Lv2/img01.jpg',
        'https://images.stockx.com/360/Air-Jordan-1-High-OG-Black-White/Images/Air-Jordan-1-High-OG-Black-White/Lv2/img10.jpg',
        'https://images.stockx.com/360/Air-Jordan-1-High-OG-Black-White/Images/Air-Jordan-1-High-OG-Black-White/Lv2/img20.jpg',
        'https://images.stockx.com/360/Air-Jordan-1-High-OG-Black-White/Images/Air-Jordan-1-High-OG-Black-White/Lv2/img30.jpg'
    ] },
    { id: 2, name: 'Essentials Fear of God Hoodie', price: '110$', image: 'FOG', category: 'clothes', photos: [
        'https://images.stockx.com/images/Fear-of-God-Essentials-Fleece-Hoodie-Black-2.jpg?fit=fill&bg=FFFFFF&w=800&h=800&q=90&trim=color'
    ] },
    { id: 3, name: 'Stussy 8 Ball Zip Hoodie', price: '145$', image: 'STUSSY', category: 'clothes', photos: [
        'https://images.stockx.com/images/Stussy-8-Ball-Pigment-Dyed-Hoodie-Black.jpg?fit=fill&bg=FFFFFF&w=800&h=800&q=90&trim=color',
        'https://images.stockx.com/images/Stussy-8-Ball-Pigment-Dyed-Hoodie-Black-2.jpg?fit=fill&bg=FFFFFF&w=800&h=800&q=90&trim=color'
    ] },
    { id: 4, name: 'New Balance 990v6 Grey', price: '200$', image: 'NB990', category: 'shoes', photos: [
        'https://images.stockx.com/360/New-Balance-990v6-Grey/Images/New-Balance-990v6-Grey/Lv2/img01.jpg',
        'https://images.stockx.com/360/New-Balance-990v6-Grey/Images/New-Balance-990v6-Grey/Lv2/img10.jpg',
        'https://images.stockx.com/360/New-Balance-990v6-Grey/Images/New-Balance-990v6-Grey/Lv2/img20.jpg',
        'https://images.stockx.com/360/New-Balance-990v6-Grey/Images/New-Balance-990v6-Grey/Lv2/img30.jpg'
    ] },
    { id: 5, name: 'Adidas Samba OG', price: '100$', image: 'SAMBA', category: 'shoes', photos: [
        'https://images.stockx.com/360/adidas-Samba-Black-White-Gum/Images/adidas-Samba-Black-White-Gum/Lv2/img01.jpg',
        'https://images.stockx.com/360/adidas-Samba-Black-White-Gum/Images/adidas-Samba-Black-White-Gum/Lv2/img10.jpg',
        'https://images.stockx.com/360/adidas-Samba-Black-White-Gum/Images/adidas-Samba-Black-White-Gum/Lv2/img20.jpg',
        'https://images.stockx.com/360/adidas-Samba-Black-White-Gum/Images/adidas-Samba-Black-White-Gum/Lv2/img30.jpg'
    ] },
    { id: 6, name: 'Supreme Box Logo Hoodie', price: '398$', image: 'SUPREME', category: 'clothes', photos: [
        'https://images.stockx.com/images/Supreme-Box-Logo-Hooded-Sweatshirt-Black.jpg?fit=fill&bg=FFFFFF&w=800&h=800&q=90&trim=color'
    ] },
    { id: 7, name: 'Creed Aventus', price: '250$', image: 'CREED', category: 'perfume', photos: [
        'https://creedboutique.com/cdn/shop/files/PDP-Image-Carousel-Aventus-100ml-1x1_1_1.jpg?v=1779369552&width=800'
    ] },
    { id: 8, name: 'Dior Sauvage', price: '120$', image: 'DIOR', category: 'perfume', photos: [
        'https://n.nordstrommedia.com/it/4164d35e-cca7-4a39-b6ff-b26bb37a26c2.jpeg?w=780&h=1170&crop=pad',
        'https://n.nordstrommedia.com/it/3f2b5c28-1be0-4bb9-9205-f90610982231.jpeg?w=780&h=1170&crop=pad',
        'https://n.nordstrommedia.com/it/5ba5dbb9-be49-4152-898a-da1a67800278.jpeg?w=780&h=1170&crop=pad'
    ] },
    { id: 9, name: 'Ray-Ban Aviator', price: '180$', image: 'RAYBAN', category: 'glasses', photos: [
        'https://images.stockx.com/images/Ray-Ban-Aviator-Classic-Non-Polarized-Sunglasses-Polished-Gold-Frame-Green-Classic-G-15-Lens.jpg?fit=fill&bg=FFFFFF&w=800&h=800&q=90&trim=color'
    ] },
    { id: 10, name: 'Oakley Holbrook', price: '150$', image: 'OAKLEY', category: 'glasses', photos: [
        'https://images.stockx.com/images/Oakley-Holbrook-Sunglasses-Matte-Black-Grey.jpg?fit=fill&bg=FFFFFF&w=800&h=800&q=90&trim=color'
    ] },
    { id: 11, name: 'Louis Vuitton Neverfull', price: '1200$', image: 'LV', category: 'bags', photos: [
        'https://www.fashionphile.com/cdn/shop/files/ef9bb2035e11cce87d6987f4c48c914b.jpg',
        'https://www.fashionphile.com/cdn/shop/files/56ce742adcd33f3bf621fe960063a124.jpg',
        'https://www.fashionphile.com/cdn/shop/files/3154f82725b75f51c1576c4fa8d6d5a4.jpg'
    ] },
    { id: 12, name: 'Gucci GG Marmont', price: '980$', image: 'GUCCI', category: 'bags', photos: [
        'https://www.fashionphile.com/cdn/shop/files/3df4f8f2fa073dfa430514796135ebe3.jpg?v=1749090478&width=1946',
        'https://www.fashionphile.com/cdn/shop/files/887ccea9e6cd9ce13bbc87c2fcacda7d.jpg?v=1749090478&width=1946',
        'https://www.fashionphile.com/cdn/shop/files/cb49d3e109393f2cd198ef994c45d7d6.jpg?v=1749090478&width=1946'
    ] }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let wishlistFilterActive = false;
let modalFreePhotos = [];
let currentModalProduct = null;
let lastOrderTime = 0;
const SPAM_DELAY = 30000;

// ========== КУРС ВАЛЮТ ==========
let usdToRub = null;
(function loadExchangeRate() {
    const cached = JSON.parse(localStorage.getItem('fxRate') || 'null');
    if (cached && Date.now() - cached.fetchedAt < 12 * 60 * 60 * 1000) {
        usdToRub = cached.rate;
        return;
    }
    fetch('https://open.er-api.com/v6/latest/USD')
        .then(r => r.json())
        .then(data => {
            if (data && data.rates && data.rates.RUB) {
                usdToRub = data.rates.RUB;
                localStorage.setItem('fxRate', JSON.stringify({ rate: usdToRub, fetchedAt: Date.now() }));
            }
        })
        .catch(() => {});
})();

function formatRub(priceStr) {
    if (!usdToRub) return '';
    const usd = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
    if (!usd) return '';
    const rub = Math.round(usd * usdToRub / 10) * 10;
    return `≈ ${rub.toLocaleString('ru-RU')} ₽`;
}

// ========== ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ ==========
window.filterCategory = function(category) {
    currentCategory = category;
    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    renderCatalog();
};

function renderCatalog() {
    let filteredProducts = CATALOG;
    if (currentCategory !== 'all') {
        filteredProducts = CATALOG.filter(p => p.category === currentCategory);
    }

    const searchTerm = document.getElementById('catalog-search')?.value.trim().toLowerCase();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    if (wishlistFilterActive) {
        filteredProducts = filteredProducts.filter(p => wishlist.includes(p.id));
    }

    let html = '';
    filteredProducts.forEach(product => {
        const inCart = cart.some(item => item.catalogId === product.id);
        const cartCount = cart.filter(item => item.catalogId === product.id).length;
        const inWishlist = wishlist.includes(product.id);
        const icon = CATEGORY_META[product.category]?.icon || 'icon-box';
        const thumb = product.photos && product.photos[0];

        html += `
            <div class="product-card ${inCart ? 'in-cart' : ''}" onclick="openProductModal(${product.id})">
                <div class="product-image">
                    <button class="wishlist-btn ${inWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id}, event)" aria-label="В избранное"><svg class="icon"><use href="#icon-heart"></use></svg></button>
                    ${thumb ? `<img src="${thumb}" alt="${product.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
                    <div class="product-image-fallback" style="${thumb ? 'display:none' : 'display:flex'}"><svg class="icon" style="width:24px;height:24px"><use href="#${icon}"></use></svg></div>
                </div>
                <div class="product-title">${product.name}</div>
                <div class="product-price">${product.price}</div>
                ${cartCount > 0 ? `<div class="cart-badge-mini">${cartCount}</div>` : ''}
            </div>
        `;
    });

    if (filteredProducts.length === 0) {
        html = `<div class="empty-state">${wishlistFilterActive ? 'В избранном пока пусто' : 'Ничего не найдено'}</div>`;
    }

    document.getElementById('catalog-grid').innerHTML = html;
}

window.toggleWishlist = function(productId, event) {
    event.stopPropagation();
    const idx = wishlist.indexOf(productId);
    if (idx === -1) wishlist.push(productId);
    else wishlist.splice(idx, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderCatalog();
};

window.toggleWishlistFilter = function() {
    wishlistFilterActive = !wishlistFilterActive;
    document.getElementById('wishlist-toggle-btn').classList.toggle('active', wishlistFilterActive);
    renderCatalog();
};

// ========== ПРОМОКОДЫ ==========
window.applyPromoCode = function() {
    const code = document.getElementById('promo-code').value.trim().toUpperCase();
    const messageDiv = document.getElementById('promo-message');

    if (!code) {
        messageDiv.style.display = 'block';
        messageDiv.className = 'promo-error';
        messageDiv.textContent = 'Введите промокод';
        return;
    }

    if (VALID_PROMOS[code]) {
        appliedPromo = {
            code: code,
            ...VALID_PROMOS[code]
        };
        messageDiv.style.display = 'block';
        messageDiv.className = 'promo-success';
        messageDiv.textContent = `Промокод применён! Скидка ${VALID_PROMOS[code].type === 'percent' ? VALID_PROMOS[code].discount + '%' : VALID_PROMOS[code].discount + '₽'}`;

        const discountInfo = document.getElementById('discount-info');
        discountInfo.style.display = 'block';
        discountInfo.textContent = `Скидка по промокоду ${code}: ${VALID_PROMOS[code].type === 'percent' ? VALID_PROMOS[code].discount + '%' : VALID_PROMOS[code].discount + '₽'}`;
    } else {
        appliedPromo = null;
        messageDiv.style.display = 'block';
        messageDiv.className = 'promo-error';
        messageDiv.textContent = 'Недействительный промокод';
        document.getElementById('discount-info').style.display = 'none';
    }
};

// ========== МОДАЛКА ДЛЯ ТОВАРА ==========
window.openProductModal = function(productId) {
    const product = CATALOG.find(p => p.id === productId);
    if (!product) return;

    currentModalProduct = product;
    const photos = product.photos && product.photos.length ? product.photos : null;
    const icon = CATEGORY_META[product.category]?.icon || 'icon-box';

    document.getElementById('modal-product').innerHTML = `
        ${photos ? `
            <div class="modal-gallery">
                <div class="modal-gallery-track" id="modal-gallery-track">
                    ${photos.map(p => `<div class="modal-gallery-slide"><img src="${p}" alt="${product.name}" onerror="this.parentElement.remove()"></div>`).join('')}
                </div>
                ${photos.length > 1 ? `<div class="modal-gallery-dots">${photos.map((_, i) => `<span class="modal-gallery-dot${i === 0 ? ' active' : ''}"></span>`).join('')}</div>` : ''}
            </div>
        ` : `
            <div class="modal-gallery modal-gallery-empty"><svg class="icon" style="width:32px;height:32px"><use href="#${icon}"></use></svg></div>
        `}
        <div class="modal-product-name">${product.name}</div>
        <div class="modal-product-price">${product.price}</div>
        ${formatRub(product.price) ? `<div class="modal-product-price-rub">${formatRub(product.price)}</div>` : ''}
    `;

    if (photos && photos.length > 1) {
        const track = document.getElementById('modal-gallery-track');
        const dots = document.querySelectorAll('#modal-product .modal-gallery-dot');
        track.addEventListener('scroll', () => {
            const i = Math.round(track.scrollLeft / track.clientWidth);
            dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
        }, { passive: true });
    }

    document.getElementById('modal-size').value = '';
    document.getElementById('modal-color').value = '';
    document.getElementById('modal-notes').value = '';

    document.getElementById('product-modal').classList.add('active');
};

window.closeModal = function() {
    document.getElementById('product-modal').classList.remove('active');
    currentModalProduct = null;
};

// ========== ГИД ПО РАЗМЕРАМ ==========
window.openSizeGuide = function() {
    document.getElementById('size-guide-modal').classList.add('active');
};

window.closeSizeGuide = function() {
    document.getElementById('size-guide-modal').classList.remove('active');
};

window.addToCartFromModal = function() {
    if (!currentModalProduct) return;

    const size = document.getElementById('modal-size').value;
    const color = document.getElementById('modal-color').value;
    const notes = document.getElementById('modal-notes').value;

    cart.push({
        catalogId: currentModalProduct.id,
        type: 'catalog',
        name: currentModalProduct.name,
        price: currentModalProduct.price,
        size: size,
        color: color,
        notes: notes,
        addedAt: new Date().toISOString()
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCatalog();
    updateCartBadge();
    closeModal();
    tg.showAlert(`Товар добавлен в корзину`);
};

// ========== СВОБОДНЫЙ ЗАПРОС ==========
window.showFreeRequestModal = function() {
    modalFreePhotos = [];
    document.getElementById('modal-free-query').value = '';
    document.getElementById('modal-free-size').value = '';
    document.getElementById('modal-free-color').value = '';
    document.getElementById('modal-free-notes').value = '';
    document.getElementById('modal-free-photo-preview').innerHTML = '';

    document.getElementById('free-request-modal').classList.add('active');
};

window.closeFreeRequestModal = function() {
    document.getElementById('free-request-modal').classList.remove('active');
    modalFreePhotos = [];
};

window.handleModalFreePhotos = function(event) {
    const files = Array.from(event.target.files);
    if (modalFreePhotos.length + files.length > 5) {
        tg.showAlert('Можно загрузить не более 5 фото');
        return;
    }

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            modalFreePhotos.push(e.target.result);
            renderModalFreePhotoPreview();
        };
        reader.readAsDataURL(file);
    });
};

function renderModalFreePhotoPreview() {
    let html = '';
    modalFreePhotos.forEach((photo, index) => {
        html += `
            <div class="photo-preview-item">
                <img src="${photo}" alt="preview">
                <button class="photo-remove" onclick="removeModalFreePhoto(${index})"><svg class="icon"><use href="#icon-close"></use></svg></button>
            </div>
        `;
    });
    document.getElementById('modal-free-photo-preview').innerHTML = html;
}

window.removeModalFreePhoto = function(index) {
    modalFreePhotos.splice(index, 1);
    renderModalFreePhotoPreview();
};

window.addFreeRequestFromModal = function() {
    const query = document.getElementById('modal-free-query').value;
    const size = document.getElementById('modal-free-size').value;
    const color = document.getElementById('modal-free-color').value;
    const notes = document.getElementById('modal-free-notes').value;

    if (!query) {
        tg.showAlert('Введите запрос');
        return;
    }

    cart.push({
        type: 'free',
        name: 'Запрос: ' + query.substring(0, 30),
        query: query,
        size: size,
        color: color,
        notes: notes,
        photos: modalFreePhotos.slice(),
        addedAt: new Date().toISOString()
    });

    localStorage.setItem('cart', JSON.stringify(cart));

    closeFreeRequestModal();
    updateCartBadge();
    tg.showAlert(`Запрос добавлен в корзину`);
    showView('cart');
};

// ========== КОРЗИНА ==========
function renderCart() {
    if (cart.length === 0) {
        document.getElementById('cart-items').innerHTML = '<div class="empty-state">КОРЗИНА ПУСТА</div>';
        document.getElementById('cart-summary').style.display = 'none';
        document.getElementById('discount-info').style.display = 'none';
        return;
    }

    let html = '';
    cart.forEach((item, index) => {
        const typeIcon = item.type === 'catalog' ? 'icon-box' : 'icon-search';
        const typeLabel = item.type === 'catalog' ? 'Товар из каталога' : 'Свободный запрос';

        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-badge"><svg class="icon"><use href="#${typeIcon}"></use></svg> ${typeLabel}</div>
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-details">
                        ${item.query ? `Ссылка: ${item.query.substring(0, 40)}${item.query.length > 40 ? '...' : ''}\n` : ''}
                        ${item.size ? `Размер: ${item.size}\n` : ''}
                        ${item.color ? `Цвет: ${item.color}\n` : ''}
                        ${item.notes ? `Заметка: ${item.notes.substring(0, 30)}${item.notes.length > 30 ? '...' : ''}\n` : ''}
                        ${item.photos && item.photos.length ? `Фото: ${item.photos.length} шт.` : ''}
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})"><svg class="icon" style="width:16px;height:16px"><use href="#icon-close"></use></svg></button>
            </div>
        `;
    });

    document.getElementById('cart-items').innerHTML = html;
    document.getElementById('cart-total').textContent = cart.length;
    document.getElementById('cart-summary').style.display = 'block';
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    renderCatalog();
    updateCartBadge();
};

function updateCartBadge() {
    document.getElementById('cart-badge').textContent = cart.length;
}

// ========== ОФОРМЛЕНИЕ ЗАКАЗА ==========
window.submitOrder = async function() {
    if (cart.length === 0) {
        tg.showAlert('Корзина пуста');
        return;
    }

    const now = Date.now();
    if (now - lastOrderTime < SPAM_DELAY) {
        const remaining = Math.ceil((SPAM_DELAY - (now - lastOrderTime)) / 1000);
        tg.showAlert(`Подождите ${remaining} сек.`);
        return;
    }

    const btn = document.getElementById('submit-order-btn');
    btn.disabled = true;
    btn.textContent = 'ОТПРАВКА...';

    try {
        const orderData = {
            userId: String(user.id),
            userName: user.first_name || 'Гость',
            username: user.username || 'guest',
            items: cart.map(item => ({
                type: item.type,
                name: item.name,
                query: item.query || '',
                size: item.size || '',
                color: item.color || '',
                notes: item.notes || '',
                photos: item.photos || []
            })),
            promoCode: appliedPromo ? appliedPromo.code : null,
            totalItems: cart.length,
            referredBy: referredBy
        };

        console.log('📤 Отправка заказа:', orderData);

        let response = await fetch(API_URL + '/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        let result = await response.json();

        if (result.success) {
            lastOrderTime = Date.now();

            tg.showPopup({
                title: 'ЗАКАЗ ОФОРМЛЕН',
                message: `Заказ #${result.orderId}\n\nПо вопросам: @closersmanager`,
                buttons: [
                    { type: 'default', text: 'НАПИСАТЬ АДМИНУ', url: ADMIN_CONTACT },
                    { type: 'ok', text: 'ОК' }
                ]
            });

            cart = [];
            appliedPromo = null;
            localStorage.removeItem('cart');
            renderCart();
            renderCatalog();
            updateCartBadge();
            await loadOrders();
            showView('orders');
        }
    } catch (error) {
        console.error(error);
        tg.showAlert('Ошибка соединения с сервером');
    } finally {
        btn.disabled = false;
        btn.textContent = 'ОФОРМИТЬ ЗАКАЗ';
    }
};

// ========== ЗАГРУЗКА ЗАКАЗОВ ==========
async function loadOrders() {
    try {
        let response = await fetch(API_URL + '/user-orders?userId=' + user.id);
        let orders = await response.json();

        if (!orders || orders.length === 0) {
            document.getElementById('orders-list').innerHTML = '<div class="empty-state">У ВАС ПОКА НЕТ ЗАКАЗОВ</div>';
            return;
        }

        let html = '';
        orders.forEach(order => {
            const statuses = [
                { key: 'pending', label: 'Ожидание', date: order.date },
                { key: 'searching', label: 'Поиск на POIZON', date: order.searchDate },
                { key: 'ordered', label: 'Заказано у поставщика', date: order.orderedDate },
                { key: 'shipping', label: 'В пути в Россию', date: order.shippingDate },
                { key: 'stock', label: 'На складе', date: order.stockDate },
                { key: 'delivery', label: 'Передано в доставку', date: order.deliveryDate },
                { key: 'completed', label: 'Получен', date: order.completedDate }
            ];

            const currentStatus = order.status || 'pending';
            let currentIndex = statuses.findIndex(s => s.key === currentStatus);
            if (currentIndex === -1) currentIndex = 0;

            html += `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-id">ЗАКАЗ #${order.id}</span>
                        <span class="order-status-badge">${statuses[currentIndex].label}</span>
                    </div>

                    <div class="status-timeline">
                        ${statuses.map((status, idx) => {
                            let statusClass = '';
                            if (idx < currentIndex) statusClass = 'completed';
                            else if (idx === currentIndex) statusClass = 'active';

                            return `
                                <div class="status-step">
                                    <div class="status-dot ${statusClass}"></div>
                                    ${idx < statuses.length - 1 ? '<div class="status-line"></div>' : ''}
                                    <div class="status-content">
                                        <div class="status-title">${status.label}</div>
                                        ${status.date ? `<div class="status-date">${new Date(status.date).toLocaleString('ru-RU')}</div>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="order-meta">
                        Товаров: ${order.items ? order.items.length : 1}
                        ${order.promoCode ? `\nПромокод: ${order.promoCode}` : ''}
                    </div>
                </div>
            `;
        });

        document.getElementById('orders-list').innerHTML = html;
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        document.getElementById('orders-list').innerHTML = '<div class="empty-state">ОШИБКА ЗАГРУЗКИ</div>';
    }
}

// ========== НАВИГАЦИЯ ==========
function showView(view) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById('catalog-view').style.display = 'none';
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('orders-view').style.display = 'none';
    document.getElementById('support-view').style.display = 'none';

    if (view === 'catalog') {
        document.querySelectorAll('.nav-item')[0].classList.add('active');
        document.getElementById('catalog-view').style.display = 'block';
        renderCatalog();
    } else if (view === 'cart') {
        document.querySelectorAll('.nav-item')[1].classList.add('active');
        document.getElementById('cart-view').style.display = 'block';
        renderCart();
    } else if (view === 'orders') {
        document.querySelectorAll('.nav-item')[2].classList.add('active');
        document.getElementById('orders-view').style.display = 'block';
        loadOrders();
    } else if (view === 'support') {
        document.querySelectorAll('.nav-item')[3].classList.add('active');
        document.getElementById('support-view').style.display = 'block';
    }
}
window.showView = showView;

// ========== ИНИЦИАЛИЗАЦИЯ ==========
renderCatalog();
updateCartBadge();
loadOrders();
