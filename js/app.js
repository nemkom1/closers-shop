let tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor?.('#0d0e11');
tg.setBackgroundColor?.('#0d0e11');

let user = tg.initDataUnsafe?.user || {
    id: Math.floor(Math.random() * 1000000),
    first_name: 'Гость',
    username: 'guest'
};

const API_URL = 'https://closers-backend.onrender.com/api';
const ADMIN_CONTACT = 'https://t.me/closersmanager';
const BOT_USERNAME = 'closers_shop_bot';
const ADMIN_ID = 721667711;

// ========== БАННЕР ПРО VPN — ПОКАЗЫВАЕМ ОДИН РАЗ ==========
window.dismissVpnNotice = function() {
    localStorage.setItem('vpnNoticeDismissed', '1');
    document.getElementById('vpn-notification')?.remove();
};

if (localStorage.getItem('vpnNoticeDismissed')) {
    document.getElementById('vpn-notification')?.remove();
}

// ========== ПРИГЛАШЕНИЕ ДРУГА ==========
// Условий вознаграждения нет — ссылка просто приводит друга в приложение,
// поэтому текст ничего не обещает.
const referredBy = tg.initDataUnsafe?.start_param || null;
const referralLink = `https://t.me/${BOT_USERNAME}?startapp=${user.id}`;

window.shareReferralLink = function() {
    const text = 'Заказываю оригинальные вещи с POIZON через CLOSERS — вот приложение';
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`);
};

window.copyReferralLink = function() {
    navigator.clipboard.writeText(referralLink)
        .then(() => tg.showAlert('Ссылка скопирована'))
        .catch(() => tg.showAlert(referralLink));
};

// ========== ПРОМОКОДЫ ==========
let appliedPromo = null;
const VALID_PROMOS = {
    'CLOSERS10': { discount: 10, type: 'percent' },
    'FIRST5': { discount: 5, type: 'percent' },
    'FREESHIP': { discount: 500, type: 'fixed' }
};

// ========== КАТЕГОРИИ ==========
let currentCategory = 'all';
const CATEGORIES = [
    { key: 'all', label: 'Всё' },
    { key: 'shoes', label: 'Обувь' },
    { key: 'clothes', label: 'Одежда' },
    { key: 'perfume', label: 'Парфюм' },
    { key: 'glasses', label: 'Очки' },
    { key: 'bags', label: 'Сумки' }
];

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
let wishlistOnly = false;
let lastToggledWishlistId = null;
let modalFreePhotos = [];
let currentModalProduct = null;
let userOrders = [];
let lastOrderTime = 0;
const SPAM_DELAY = 30000;

// ========== ПОДТВЕРЖДЕНИЕ ДОБАВЛЕНИЯ В КОРЗИНУ ==========
function bumpCartBadge() {
    const el = document.getElementById('bar-count');
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
}

// Клонирует фото товара и «долетает» им до значка корзины — подтверждает
// добавление конкретной вещью, а не абстрактной галочкой.
function flyToCart(sourceImg, sourceRect) {
    const bar = document.getElementById('cart-bar');
    if (!bar || bar.hidden) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof sourceImg.animate !== 'function') {
        bumpCartBadge();
        return;
    }

    const bagIcon = bar.querySelector('.icon');
    const targetRect = bagIcon.getBoundingClientRect();

    const clone = sourceImg.cloneNode(false);
    clone.className = 'fly-shot';
    clone.style.left = sourceRect.left + 'px';
    clone.style.top = sourceRect.top + 'px';
    clone.style.width = sourceRect.width + 'px';
    clone.style.height = sourceRect.height + 'px';
    document.body.appendChild(clone);

    const dx = (targetRect.left + targetRect.width / 2) - (sourceRect.left + sourceRect.width / 2);
    const dy = (targetRect.top + targetRect.height / 2) - (sourceRect.top + sourceRect.height / 2);

    // WebView в некоторых версиях Telegram-клиента может не поддержать
    // Element.animate() — тогда просто гасим клон и подтверждаем бампом,
    // а не оставляем зависшую картинку на экране.
    try {
        const anim = clone.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px) scale(0.1)`, opacity: 0 }
        ], { duration: 520, easing: 'cubic-bezier(.2,.8,.3,1)' });

        anim.onfinish = () => {
            clone.remove();
            bumpCartBadge();
        };
    } catch (e) {
        clone.remove();
        bumpCartBadge();
    }
}

// ========== ДЕНЬГИ ==========
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
            if (data?.rates?.RUB) {
                usdToRub = data.rates.RUB;
                localStorage.setItem('fxRate', JSON.stringify({ rate: usdToRub, fetchedAt: Date.now() }));
                renderCatalog();
                updateCartBar();
            }
        })
        .catch(() => {});
})();

function usdOf(priceStr) {
    const value = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
    return Number.isFinite(value) ? value : 0;
}

// Запасной курс на случай, если fx ещё не подтянулся (первая секунда
// самого первого запуска, пока не пришёл live-курс и нет кэша в localStorage) —
// чтобы рубли не были пустыми, а не потому что курс правда такой.
const FALLBACK_USD_RUB = 80;

function rubOf(usd) {
    if (!usd) return '';
    const rate = usdToRub || FALLBACK_USD_RUB;
    const rub = Math.round(usd * rate / 10) * 10;
    return `${rub.toLocaleString('ru-RU')} ₽`;
}

// Цены каталога — ориентир по POIZON. Менеджер подтверждает итог до оплаты,
// поэтому всё, что показываем здесь, помечено как предварительное.
function cartTotals() {
    let usd = 0;
    let unpriced = 0;

    cart.forEach(item => {
        const value = usdOf(item.price);
        if (value) usd += value;
        else unpriced += 1;
    });

    let discount = 0;
    if (appliedPromo && usd) {
        discount = appliedPromo.type === 'percent'
            ? Math.round(usd * appliedPromo.discount / 100)
            : Math.min(usd, Math.round(appliedPromo.discount / (usdToRub || FALLBACK_USD_RUB)));
    }

    return { usd, unpriced, discount, total: Math.max(0, usd - discount) };
}

// ========== ЛЕНТА ==========
function renderCats() {
    document.getElementById('cats').innerHTML = CATEGORIES.map(c => `
        <button class="cat ${c.key === currentCategory ? 'on' : ''}" onclick="filterCategory('${c.key}')">${c.label}</button>
    `).join('');
}

window.filterCategory = function(key) {
    currentCategory = key;
    renderCats();
    renderCatalog();
};

function renderCatalog() {
    let list = CATALOG;

    if (currentCategory !== 'all') list = list.filter(p => p.category === currentCategory);

    const term = document.getElementById('catalog-search')?.value.trim().toLowerCase();
    if (term) list = list.filter(p => p.name.toLowerCase().includes(term));

    if (wishlistOnly) list = list.filter(p => wishlist.includes(p.id));

    const feed = document.getElementById('catalog-grid');

    if (!list.length) {
        feed.innerHTML = `
            <div class="empty" style="grid-column:1/-1;padding-top:20px">
                <p class="empty-title">${wishlistOnly ? 'Пока ничего не отложено' : 'В каталоге не нашлось'}</p>
                <p class="empty-text">${wishlistOnly
                    ? 'Нажимайте на сердечко у товара — он появится здесь.'
                    : 'Каталог небольшой, но привезти можем что угодно с POIZON. Опишите, что ищете.'}</p>
                ${wishlistOnly ? '' : '<button class="btn" onclick="showFreeRequestModal()">Описать свой запрос</button>'}
            </div>`;
        return;
    }

    feed.innerHTML = list.map((product, index) => {
        // Ритм ленты: каждый третий товар занимает всю ширину
        const wide = index % 3 === 0;
        const inCart = cart.filter(i => i.catalogId === product.id).length;
        const saved = wishlist.includes(product.id);
        const justSaved = product.id === lastToggledWishlistId;
        const shot = product.photos?.[0];
        const rub = rubOf(usdOf(product.price));

        return `
            <div class="cell ${wide ? 'wide' : ''}" style="--i:${index}">
                <button class="item" onclick="openProductModal(${product.id})">
                    <span class="item-shot">
                        ${shot ? `<img src="${shot}" alt="${product.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
                        <span class="item-blank" style="${shot ? 'display:none' : 'display:flex'}"><svg class="icon"><use href="#icon-bag"></use></svg></span>
                        ${inCart ? `<span class="item-in">${inCart}</span>` : ''}
                    </span>
                    <span class="item-body">
                        <span class="item-name">${product.name}</span>
                        <span class="item-price">${rub}</span>
                    </span>
                </button>
                <button class="item-save ${saved ? 'on' : ''} ${justSaved ? 'pop' : ''}" onclick="toggleWishlist(${product.id})" aria-label="${saved ? 'Убрать из отложенного' : 'Отложить'}">
                    <svg class="icon"><use href="#icon-heart"></use></svg>
                </button>
            </div>
        `;
    }).join('');

    lastToggledWishlistId = null;
}

window.toggleWishlist = function(productId) {
    const idx = wishlist.indexOf(productId);
    if (idx === -1) {
        wishlist.push(productId);
        lastToggledWishlistId = productId;
    } else {
        wishlist.splice(idx, 1);
        lastToggledWishlistId = null;
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    tg.HapticFeedback?.selectionChanged();
    renderCatalog();
};

window.toggleWishlistFilter = function() {
    wishlistOnly = !wishlistOnly;
    document.getElementById('wishlist-toggle-btn').classList.toggle('on', wishlistOnly);
    renderCatalog();
};

// ========== ТАБЛИЦА РАЗМЕРОВ ==========
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

// Чипы вместо нативного <select> — тап виден и понятен без открытия
// системного пикера; выбранный размер держим в скрытом input.value,
// чтобы остальной код (addToCartFromModal и т.п.) не менялся.
function fillSizeChips() {
    [
        { chips: 'modal-size-chips', hidden: 'modal-size' },
        { chips: 'modal-free-size-chips', hidden: 'modal-free-size' }
    ].forEach(({ chips, hidden }) => {
        document.getElementById(chips).innerHTML = SIZES.map(s => `
            <button type="button" class="chip" data-size="${s}" onclick="selectSize('${hidden}','${chips}','${s}')">${/^\d+$/.test(s) ? s : s}</button>
        `).join('');
    });
}

window.selectSize = function(hiddenId, chipsId, size) {
    const hiddenInput = document.getElementById(hiddenId);
    const deselect = hiddenInput.value === size;
    hiddenInput.value = deselect ? '' : size;
    document.querySelectorAll(`#${chipsId} .chip`).forEach(c => {
        c.classList.toggle('on', !deselect && c.dataset.size === size);
    });
    tg.HapticFeedback?.selectionChanged();
};

function resetSizeChips(chipsId, hiddenId) {
    document.getElementById(hiddenId).value = '';
    document.querySelectorAll(`#${chipsId} .chip`).forEach(c => c.classList.remove('on'));
}

const GUIDE_HTML = `
    <div class="guide-head">Обувь</div>
    <table>
        <thead><tr><th>US</th><th>EU</th><th>UK</th><th>см</th></tr></thead>
        <tbody>
            <tr><td>6</td><td>39</td><td>5.5</td><td>24.5</td></tr>
            <tr><td>7</td><td>40</td><td>6.5</td><td>25.5</td></tr>
            <tr><td>8</td><td>41</td><td>7.5</td><td>26.5</td></tr>
            <tr><td>9</td><td>42</td><td>8.5</td><td>27.5</td></tr>
            <tr><td>10</td><td>43</td><td>9.5</td><td>28.5</td></tr>
            <tr><td>11</td><td>44</td><td>10.5</td><td>29.5</td></tr>
            <tr><td>12</td><td>45</td><td>11.5</td><td>30.5</td></tr>
        </tbody>
    </table>
    <div class="guide-head" style="border-top:1px solid var(--line)">Одежда</div>
    <table>
        <thead><tr><th>Размер</th><th>RU</th><th>EU</th><th>Грудь</th></tr></thead>
        <tbody>
            <tr><td>XS</td><td>42</td><td>44</td><td>84-88</td></tr>
            <tr><td>S</td><td>44</td><td>46</td><td>88-92</td></tr>
            <tr><td>M</td><td>46-48</td><td>48</td><td>92-98</td></tr>
            <tr><td>L</td><td>48-50</td><td>50</td><td>98-104</td></tr>
            <tr><td>XL</td><td>50-52</td><td>52</td><td>104-110</td></tr>
            <tr><td>XXL</td><td>52-54</td><td>54</td><td>110-116</td></tr>
        </tbody>
    </table>
    <p class="guide-note">Китайские бренды часто маломерят на 0.5–1 шаг. При сомнении между размерами берите больший.</p>
`;

window.toggleSizeGuide = function(kind) {
    const id = kind === 'free' ? 'size-guide-free' : 'size-guide';
    const guide = document.getElementById(id);
    const button = document.querySelector(`[aria-controls="${id}"]`);
    const open = guide.hidden;

    if (open && !guide.innerHTML.trim()) guide.innerHTML = GUIDE_HTML;

    guide.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
};

// ========== КАРТОЧКА ТОВАРА ==========
window.openProductModal = function(productId) {
    const product = CATALOG.find(p => p.id === productId);
    if (!product) return;

    currentModalProduct = product;
    const photos = product.photos?.length ? product.photos : null;
    const usd = usdOf(product.price);
    const rub = rubOf(usd);

    document.getElementById('product-sheet-title').textContent = 'Товар';
    document.getElementById('modal-product').innerHTML = `
        ${photos ? `
            <div class="gal">
                <div class="gal-track" id="gal-track">
                    ${photos.map(p => `<div class="gal-shot"><img src="${p}" alt="${product.name}" onerror="this.parentElement.remove()"></div>`).join('')}
                </div>
                ${photos.length > 1 ? `<div class="gal-ticks">${photos.map((_, i) => `<span class="gal-tick${i === 0 ? ' on' : ''}"></span>`).join('')}</div>` : ''}
            </div>
        ` : `<div class="gal gal-blank"><svg class="icon"><use href="#icon-bag"></use></svg></div>`}
        <div class="headline">
            <h3 class="headline-name">${product.name}</h3>
            <p class="headline-price">${rub}</p>
            <p class="headline-rub">цена ориентировочная, менеджер подтвердит итог</p>
        </div>
    `;

    if (photos && photos.length > 1) {
        const track = document.getElementById('gal-track');
        const ticks = document.querySelectorAll('#modal-product .gal-tick');
        track.addEventListener('scroll', () => {
            const i = Math.round(track.scrollLeft / track.clientWidth);
            ticks.forEach((t, idx) => t.classList.toggle('on', idx === i));
        }, { passive: true });
    }

    resetSizeChips('modal-size-chips', 'modal-size');
    document.getElementById('modal-color').value = '';
    document.getElementById('modal-notes').value = '';
    const guide = document.getElementById('size-guide');
    guide.hidden = true;
    document.querySelector('[aria-controls="size-guide"]').setAttribute('aria-expanded', 'false');

    openSheet('product-modal');
};

window.closeModal = function() {
    closeSheet('product-modal');
    currentModalProduct = null;
};

window.addToCartFromModal = function() {
    if (!currentModalProduct) return;

    // Рект снимаем до закрытия модалки — после closeModal() элемент скрыт
    // и getBoundingClientRect() вернёт нули.
    const flyImg = document.querySelector('#modal-product .gal-track .gal-shot img');
    const flyRect = flyImg ? flyImg.getBoundingClientRect() : null;

    cart.push({
        catalogId: currentModalProduct.id,
        type: 'catalog',
        name: currentModalProduct.name,
        price: currentModalProduct.price,
        size: document.getElementById('modal-size').value,
        color: document.getElementById('modal-color').value,
        notes: document.getElementById('modal-notes').value,
        addedAt: new Date().toISOString()
    });

    saveCart();
    closeModal();
    tg.HapticFeedback?.notificationOccurred('success');

    if (flyImg && flyRect) flyToCart(flyImg, flyRect);
    else bumpCartBadge();
};

// ========== СВОБОДНЫЙ ЗАПРОС ==========
window.showFreeRequestModal = function() {
    modalFreePhotos = [];
    ['modal-free-query', 'modal-free-color', 'modal-free-notes']
        .forEach(id => { document.getElementById(id).value = ''; });
    resetSizeChips('modal-free-size-chips', 'modal-free-size');
    document.getElementById('modal-free-photo-preview').innerHTML = '';
    const guide = document.getElementById('size-guide-free');
    guide.hidden = true;
    document.querySelector('[aria-controls="size-guide-free"]').setAttribute('aria-expanded', 'false');

    openSheet('free-request-modal');
};

window.closeFreeRequestModal = function() {
    closeSheet('free-request-modal');
    modalFreePhotos = [];
};

window.handleModalFreePhotos = function(event) {
    const files = Array.from(event.target.files);
    if (modalFreePhotos.length + files.length > 5) {
        tg.showAlert('Можно приложить не более 5 фото');
        return;
    }

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            modalFreePhotos.push(e.target.result);
            renderFreePhotos();
        };
        reader.readAsDataURL(file);
    });
};

function renderFreePhotos() {
    document.getElementById('modal-free-photo-preview').innerHTML = modalFreePhotos.map((photo, index) => `
        <div class="shot">
            <img src="${photo}" alt="Фото ${index + 1}">
            <button class="shot-x" onclick="removeModalFreePhoto(${index})" aria-label="Убрать фото"><svg class="icon"><use href="#icon-close"></use></svg></button>
        </div>
    `).join('');
}

window.removeModalFreePhoto = function(index) {
    modalFreePhotos.splice(index, 1);
    renderFreePhotos();
};

window.addFreeRequestFromModal = function() {
    const query = document.getElementById('modal-free-query').value.trim();

    if (!query) {
        tg.showAlert('Напишите, что ищете — ссылку, артикул или название');
        return;
    }

    cart.push({
        type: 'free',
        name: query.length > 40 ? query.substring(0, 40) + '…' : query,
        query: query,
        size: document.getElementById('modal-free-size').value,
        color: document.getElementById('modal-free-color').value,
        notes: document.getElementById('modal-free-notes').value,
        photos: modalFreePhotos.slice(),
        addedAt: new Date().toISOString()
    });

    saveCart();
    closeFreeRequestModal();
    bumpCartBadge();
    openCart();
};

// ========== КОРЗИНА ==========
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCatalog();
    updateCartBar();
    if (document.getElementById('cart-sheet').classList.contains('open')) renderCart();
}

function updateCartBar() {
    const bar = document.getElementById('cart-bar');
    bar.hidden = cart.length === 0;
    if (!cart.length) return;

    const { total, unpriced } = cartTotals();
    document.getElementById('bar-count').textContent = cart.length;
    document.getElementById('bar-sum').textContent = total
        ? (unpriced ? `от ${rubOf(total)}` : rubOf(total))
        : 'цену уточним';
}

window.openCart = function() {
    renderCart();
    openSheet('cart-sheet');
};

window.closeCart = function() {
    closeSheet('cart-sheet');
};

function renderCart() {
    const items = document.getElementById('cart-items');
    const foot = document.getElementById('cart-foot');

    if (!cart.length) {
        items.innerHTML = '';
        foot.innerHTML = `
            <div class="empty" style="padding-top:24px">
                <p class="empty-title">В корзине пусто</p>
                <p class="empty-text">Выберите вещь из каталога или опишите, что нужно привезти с POIZON.</p>
                <button class="btn btn-line" onclick="closeCart()">Вернуться к каталогу</button>
            </div>`;
        return;
    }

    items.innerHTML = cart.map((item, index) => {
        const product = item.catalogId ? CATALOG.find(p => p.id === item.catalogId) : null;
        const shot = product?.photos?.[0];
        const usd = usdOf(item.price);

        const spec = [];
        if (item.query) spec.push(item.query.length > 46 ? item.query.substring(0, 46) + '…' : item.query);
        if (item.size) spec.push(`Размер ${item.size}`);
        if (item.color) spec.push(`Цвет ${item.color}`);
        if (item.notes) spec.push(item.notes.length > 40 ? item.notes.substring(0, 40) + '…' : item.notes);
        if (item.photos?.length) spec.push(`${item.photos.length} фото`);

        return `
            <div class="line">
                <div class="line-shot">
                    ${shot ? `<img src="${shot}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
                    <div class="line-blank" style="${shot ? 'display:none' : 'display:flex'}"><svg class="icon"><use href="#${product ? 'icon-bag' : 'icon-search'}"></use></svg></div>
                </div>
                <div class="line-body">
                    <p class="line-name">${item.name}</p>
                    ${spec.length ? `<p class="line-spec">${spec.join('\n')}</p>` : ''}
                    <p class="line-price ${usd ? '' : 'soft'}">${usd ? rubOf(usd) : 'цену уточнит менеджер'}</p>
                </div>
                <button class="line-x" onclick="removeFromCart(${index})" aria-label="Убрать из корзины"><svg class="icon"><use href="#icon-close"></use></svg></button>
            </div>
        `;
    }).join('');

    const { usd, unpriced, discount, total } = cartTotals();

    foot.innerHTML = `
        <div class="promo">
            <input type="text" id="promo-code" placeholder="Промокод" value="${appliedPromo ? appliedPromo.code : ''}">
            <button onclick="applyPromoCode()">Применить</button>
        </div>
        <div id="promo-message"></div>

        <div class="sum">
            <div class="sum-row">
                <span>${cart.length} ${plural(cart.length, 'позиция', 'позиции', 'позиций')} из каталога</span>
                <span>${usd ? rubOf(usd) : '—'}</span>
            </div>
            ${unpriced ? `
            <div class="sum-row">
                <span>${unpriced} ${plural(unpriced, 'запрос', 'запроса', 'запросов')} без цены</span>
                <span>по подтверждению</span>
            </div>` : ''}
            ${discount ? `
            <div class="sum-row cut">
                <span>Промокод ${appliedPromo.code}</span>
                <span>−${rubOf(discount)}</span>
            </div>` : ''}
            <div class="sum-row total">
                <span>${unpriced ? 'Ориентир от' : 'Ориентир'}</span>
                <b>${total ? rubOf(total) : '—'}</b>
            </div>
            <p class="sum-note">Это цены с POIZON без комиссии и доставки. Менеджер проверит наличие, пересчитает итог и пришлёт точную сумму до оплаты.</p>
        </div>

        <button class="btn" style="margin-top:20px" onclick="submitOrder()" id="submit-order-btn">Оформить заказ</button>
    `;
}

function plural(n, one, few, many) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
};

// renderCart() пересоздаёт #promo-code при каждом вызове, поэтому shake
// нужно вешать на элемент уже ПОСЛЕ рендера, а не на тот, что был в момент клика
function shakePromoInput() {
    const input = document.getElementById('promo-code');
    if (!input) return;
    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
}

window.applyPromoCode = function() {
    const code = document.getElementById('promo-code').value.trim().toUpperCase();
    const msg = document.getElementById('promo-message');

    if (!code) {
        appliedPromo = null;
        msg.className = 'msg bad';
        msg.textContent = 'Введите промокод';
        shakePromoInput();
        return;
    }

    if (VALID_PROMOS[code]) {
        appliedPromo = { code, ...VALID_PROMOS[code] };
        renderCart();
        const fresh = document.getElementById('promo-message');
        fresh.className = 'msg ok';
        fresh.textContent = 'Промокод применён — скидка учтена в ориентире';
    } else {
        appliedPromo = null;
        renderCart();
        const fresh = document.getElementById('promo-message');
        fresh.className = 'msg bad';
        fresh.textContent = 'Такой промокод не действует';
        shakePromoInput();
    }
};

// ========== ОФОРМЛЕНИЕ ==========
window.submitOrder = async function() {
    if (!cart.length) return;

    const now = Date.now();
    if (now - lastOrderTime < SPAM_DELAY) {
        tg.showAlert(`Подождите ${Math.ceil((SPAM_DELAY - (now - lastOrderTime)) / 1000)} сек.`);
        return;
    }

    const btn = document.getElementById('submit-order-btn');
    btn.disabled = true;
    btn.textContent = 'Отправляем…';

    try {
        const response = await fetch(API_URL + '/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
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
            })
        });

        const result = await response.json();

        if (result.success) {
            lastOrderTime = Date.now();

            tg.showPopup({
                title: 'Заказ оформлен',
                message: `Заказ №${result.orderId}\n\nМенеджер проверит цены и свяжется с вами.`,
                buttons: [
                    { type: 'default', text: 'Написать', url: ADMIN_CONTACT },
                    { type: 'ok', text: 'ОК' }
                ]
            });

            cart = [];
            appliedPromo = null;
            localStorage.removeItem('cart');
            renderCatalog();
            updateCartBar();
            closeCart();
            await loadOrders();
            showView('orders');
        } else {
            tg.showAlert('Сервер не принял заказ — попробуйте ещё раз');
        }
    } catch (error) {
        console.error(error);
        tg.showAlert('Нет связи с сервером — проверьте интернет и VPN');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Оформить заказ';
    }
};

// ========== ЗАКАЗЫ ==========
const STEPS = [
    { key: 'pending', label: 'Заказ принят', field: 'date' },
    { key: 'searching', label: 'Ищем на POIZON', field: 'searchDate' },
    { key: 'ordered', label: 'Выкуплено у поставщика', field: 'orderedDate' },
    { key: 'shipping', label: 'В пути в Россию', field: 'shippingDate' },
    { key: 'stock', label: 'На складе', field: 'stockDate' },
    { key: 'delivery', label: 'Передано в доставку', field: 'deliveryDate' },
    { key: 'completed', label: 'Получен', field: 'completedDate' }
];

// Форма повторяет .order/.track, чтобы после ответа сервера макет не прыгал
function skeletonOrders(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="skel-order">
                <div class="skel-row">
                    <span class="skel-bar" style="--i:${i * 4}"></span>
                    <span class="skel-bar" style="--i:${i * 4 + 1}"></span>
                </div>
                <div class="skel-steps">
                    ${[0, 1, 2].map(j => `
                        <div class="skel-step">
                            <span class="skel-dot" style="--i:${i * 4 + j}"></span>
                            <span class="skel-line" style="--i:${i * 4 + j}"></span>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }
    return html;
}

function trackHtml(order, currentIndex) {
    return `<div class="track">${STEPS.map((step, idx) => {
        const state = idx < currentIndex ? 'done' : (idx === currentIndex ? 'now' : '');
        const when = order ? order[step.field] : null;
        return `
            <div class="step ${state}">
                <span class="step-dot"></span>
                <div>
                    <span class="step-name">${step.label}</span>
                    ${when ? `<span class="step-when">${new Date(when).toLocaleString('ru-RU')}</span>` : ''}
                </div>
            </div>`;
    }).join('')}</div>`;
}

async function loadOrders() {
    const list = document.getElementById('orders-list');

    // Бэкенд на бесплатном тарифе просыпается небыстро (холодный старт до
    // ~50с), поэтому пустой экран во время ожидания недопустим — показываем
    // скелет в форме реальных карточек заказа, а не текст-заглушку.
    if (!list.children.length) {
        list.innerHTML = skeletonOrders(2);
    }

    try {
        const response = await fetch(API_URL + '/user-orders?userId=' + user.id);
        const orders = await response.json();
        userOrders = Array.isArray(orders) ? orders : [];

        updateOrderRail();
        document.getElementById('menu-orders-count').textContent = userOrders.length || '';

        if (!userOrders.length) {
            list.innerHTML = `
                <div class="empty">
                    <p class="empty-title">Заказов пока нет</p>
                    <p class="empty-text">Когда оформите первый, он появится здесь и будет обновляться на каждом шаге — вот как выглядит путь заказа.</p>
                    <div class="preview-track">
                        <p class="preview-title">Путь заказа</p>
                        ${trackHtml(null, -1)}
                    </div>
                    <button class="btn" onclick="showView('catalog')">Перейти в каталог</button>
                </div>`;
            return;
        }

        list.innerHTML = userOrders.map(order => {
            const current = order.status || 'pending';
            let idx = STEPS.findIndex(s => s.key === current);
            if (idx === -1) idx = 0;
            const done = current === 'completed';

            const meta = [`${order.items ? order.items.length : 1} ${plural(order.items ? order.items.length : 1, 'позиция', 'позиции', 'позиций')}`];
            if (order.promoCode) meta.push(`Промокод ${order.promoCode}`);

            return `
                <article class="order">
                    <div class="order-top">
                        <h2 class="order-id">Заказ №${order.id}</h2>
                        <span class="order-now ${done ? 'done' : ''}">${STEPS[idx].label}</span>
                    </div>
                    ${trackHtml(order, idx)}
                    <div class="order-foot">${meta.join('\n')}</div>
                    ${payHtml(order)}
                </article>`;
        }).join('');
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        list.innerHTML = `
            <div class="empty">
                <p class="empty-title">Не удалось загрузить заказы</p>
                <p class="empty-text">Похоже, нет связи с сервером. Проверьте интернет и VPN, затем попробуйте снова.</p>
                <button class="btn btn-line" onclick="loadOrders()">Повторить</button>
            </div>`;
    }
}

function updateOrderRail() {
    const rail = document.getElementById('order-rail');
    const active = userOrders.find(o => (o.status || 'pending') !== 'completed');

    if (!active) {
        rail.hidden = true;
        return;
    }

    let idx = STEPS.findIndex(s => s.key === (active.status || 'pending'));
    if (idx === -1) idx = 0;

    document.getElementById('order-rail-text').textContent = `Заказ №${active.id} · ${STEPS[idx].label}`;
    rail.hidden = false;
}

function payHtml(order) {
    const status = order.paymentStatus || 'unpaid';

    if (status === 'confirmed') {
        return `<div class="order-pay"><p class="pay-state"><svg class="icon"><use href="#icon-check"></use></svg> Оплата подтверждена</p></div>`;
    }
    if (status === 'submitted') {
        return `<div class="order-pay"><p class="pay-wait">Скриншот оплаты на проверке у менеджера</p></div>`;
    }

    return `
        <div class="order-pay">
            ${status === 'rejected' ? '<p class="pay-bad">Оплата не подтверждена — пришлите скриншот ещё раз</p>' : ''}
            <button class="btn btn-line" onclick="document.getElementById('payment-file-${order.id}').click()">Приложить скриншот оплаты</button>
            <input type="file" id="payment-file-${order.id}" accept="image/*" hidden onchange="submitPaymentScreenshot(${order.id}, event)">
        </div>`;
}

window.submitPaymentScreenshot = function(orderId, event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const response = await fetch(API_URL + '/submit-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, userId: String(user.id), screenshot: e.target.result })
            });
            const result = await response.json();
            if (result.success) {
                tg.showAlert('Скриншот отправлен — ждите подтверждения');
                loadOrders();
            } else {
                tg.showAlert('Не удалось отправить скриншот');
            }
        } catch (error) {
            console.error(error);
            tg.showAlert('Нет связи с сервером');
        }
    };
    reader.readAsDataURL(file);
};

// ========== АДМИН ==========
const PAY_LABEL = { unpaid: 'Не оплачен', submitted: 'На проверке', confirmed: 'Оплачен', rejected: 'Отклонён' };

async function renderAdminOrders() {
    const list = document.getElementById('admin-orders-list');
    const stats = document.getElementById('admin-stats');
    list.innerHTML = '<div class="empty"><p class="empty-text">Загружаем…</p></div>';
    stats.innerHTML = '';

    try {
        const response = await fetch(API_URL + '/admin/orders?initData=' + encodeURIComponent(tg.initData));
        const orders = await response.json();

        if (!Array.isArray(orders)) {
            list.innerHTML = '<div class="empty"><p class="empty-title">Нет доступа</p><p class="empty-text">Этот раздел открыт только администратору.</p></div>';
            return;
        }

        const waiting = orders.filter(o => o.paymentStatus === 'submitted').length;
        const running = orders.filter(o => (o.status || 'pending') !== 'completed').length;

        stats.innerHTML = `
            <div class="admin-stat"><b>${orders.length}</b><span>всего</span></div>
            <div class="admin-stat"><b>${running}</b><span>в работе</span></div>
            <div class="admin-stat"><b>${waiting}</b><span>ждут проверки</span></div>`;

        if (!orders.length) {
            list.innerHTML = '<div class="empty"><p class="empty-title">Заказов ещё нет</p><p class="empty-text">Как только клиент оформит первый заказ, он появится здесь.</p></div>';
            return;
        }

        list.innerHTML = orders.map(order => `
            <article class="order">
                <div class="order-top">
                    <h2 class="order-id">Заказ №${order.id}</h2>
                    <span class="order-now ${order.paymentStatus === 'confirmed' ? 'done' : ''}">${PAY_LABEL[order.paymentStatus] || order.paymentStatus}</span>
                </div>
                <p class="admin-who">${order.userName || '—'} · @${order.username || 'guest'}${order.promoCode ? ` · промокод ${order.promoCode}` : ''}</p>
                <div class="admin-pick">
                    <label for="admin-status-${order.id}">Этап заказа</label>
                    <select id="admin-status-${order.id}" onchange="adminChangeStatus(${order.id}, this.value)">
                        ${STEPS.map(s => `<option value="${s.key}" ${s.key === order.status ? 'selected' : ''}>${s.label}</option>`).join('')}
                    </select>
                </div>
            </article>`).join('');
    } catch (error) {
        console.error('Ошибка загрузки заказов (админ):', error);
        list.innerHTML = '<div class="empty"><p class="empty-title">Не удалось загрузить</p><p class="empty-text">Нет связи с сервером.</p><button class="btn btn-line" onclick="renderAdminOrders()">Повторить</button></div>';
    }
}

window.adminChangeStatus = async function(orderId, status) {
    try {
        const response = await fetch(API_URL + '/admin/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status, initData: tg.initData })
        });
        const result = await response.json();
        if (result.success) tg.HapticFeedback?.notificationOccurred('success');
        else tg.showAlert('Не удалось изменить этап');
    } catch (error) {
        console.error(error);
        tg.showAlert('Нет связи с сервером');
    }
};

// ========== ЛИСТЫ ==========
function openSheet(id) {
    document.getElementById(id).classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeSheet(id) {
    document.getElementById(id).classList.remove('open');
    if (!document.querySelector('.sheet.open')) document.body.style.overflow = '';
}

// Клик по затемнению закрывает лист
document.querySelectorAll('.sheet').forEach(sheet => {
    sheet.addEventListener('click', (e) => {
        if (e.target === sheet) closeSheet(sheet.id);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.sheet.open');
    if (open) closeSheet(open.id);
});

window.openMenu = function() { openSheet('menu-sheet'); };
window.closeMenu = function() { closeSheet('menu-sheet'); };

window.goFromMenu = function(view) {
    closeMenu();
    showView(view);
};

// ========== ЭКРАНЫ ==========
const VIEWS = {
    catalog: { el: 'catalog-view', line: 'Поиск и заказ с POIZON', render: renderCatalog },
    orders: { el: 'orders-view', line: 'Ваши заказы', render: loadOrders },
    support: { el: 'support-view', line: 'Менеджер и ответы' },
    admin: { el: 'admin-view', line: 'Панель администратора', render: renderAdminOrders }
};

function showView(view) {
    const config = VIEWS[view];
    if (!config) return;

    Object.values(VIEWS).forEach(v => { document.getElementById(v.el).hidden = true; });

    const el = document.getElementById(config.el);
    el.hidden = false;
    el.classList.remove('enter');
    void el.offsetWidth;
    el.classList.add('enter');

    document.getElementById('brand-line').textContent = config.line;
    document.getElementById('top-back').hidden = view === 'catalog';

    config.render?.();
    window.scrollTo(0, 0);
    tg.HapticFeedback?.selectionChanged();
}
window.showView = showView;

// ========== ЗАПУСК ==========
fillSizeChips();
renderCats();
renderCatalog();
updateCartBar();
loadOrders();

if (user.id === ADMIN_ID) {
    document.getElementById('menu-admin').hidden = false;
}
