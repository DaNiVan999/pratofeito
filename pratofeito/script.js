const STORAGE = {
    users: "pratofeito_users",
    products: "pratofeito_products",
    cart: "pratofeito_cart",
    orders: "pratofeito_orders",
    currentUser: "pratofeito_current_user"
};

let users = JSON.parse(localStorage.getItem(STORAGE.users)) || [];
let products = JSON.parse(localStorage.getItem(STORAGE.products)) || [];
let cart = JSON.parse(localStorage.getItem(STORAGE.cart)) || [];
let orders = JSON.parse(localStorage.getItem(STORAGE.orders)) || [];
let currentUser = JSON.parse(localStorage.getItem(STORAGE.currentUser)) || null;
let currentFilter = "all";

const productEmojis = {
    "Padaria": "🥖",
    "Frutas": "🍎",
    "Verduras": "🥬",
    "Legumes": "🥕",
    "Refeições": "🍱",
    "Laticínios": "🥛",
    "Bebidas": "🧃",
    "Mercado": "🛒",
    "Doações": "💚"
};

const defaultSuppliers = [
    "Mercado Esperança",
    "Padaria Sabor da Casa",
    "Hortifruti Verde Vida",
    "Restaurante Bom Prato",
    "Supermercado Economia"
];

function saveData() {
    localStorage.setItem(STORAGE.users, JSON.stringify(users));
    localStorage.setItem(STORAGE.products, JSON.stringify(products));
    localStorage.setItem(STORAGE.cart, JSON.stringify(cart));
    localStorage.setItem(STORAGE.orders, JSON.stringify(orders));
}

function money(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function generateId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR");
}

function daysUntil(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(date + "T00:00:00");
    target.setHours(0, 0, 0, 0);

    return Math.ceil((target - today) / 86400000);
}

function getValidity(product) {
    const days = daysUntil(product.expiry);

    if (days < 0) {
        return {
            label: "VENCIDO",
            className: "expired",
            available: false
        };
    }

    if (days === 0) {
        return {
            label: "VENCE HOJE",
            className: "urgent",
            available: false
        };
    }

    if (days <= 3) {
        return {
            label: "RESGATE URGENTE",
            className: "urgent",
            available: true
        };
    }

    if (days <= 7) {
        return {
            label: "VALIDADE PRÓXIMA",
            className: "urgent",
            available: true
        };
    }

    return {
        label: "DISPONÍVEL",
        className: "active",
        available: true
    };
}

function seedProducts() {
    if (products.length > 0) return;

    const today = new Date();

    function datePlus(days) {
        const d = new Date(today);
        d.setDate(d.getDate() + days);
        return d.toISOString().split("T")[0];
    }

    products = [
        {
            id: generateId(),
            name: "Cesta de frutas",
            category: "Frutas",
            description: "Cesta com frutas selecionadas.",
            supplier: "Mercado Esperança",
            quantity: 15,
            unit: "cesta",
            expiry: datePlus(10),
            originalPrice: 25,
            price: 12,
            offerType: "discount",
            distance: 0.8,
            pickup: "08:00 às 18:00",
            address: "Centro",
            emoji: "🍎",
            active: true
        },
        {
            id: generateId(),
            name: "Banana madura",
            category: "Frutas",
            description: "Bananas maduras próprias para consumo.",
            supplier: "Hortifruti Verde Vida",
            quantity: 30,
            unit: "kg",
            expiry: datePlus(3),
            originalPrice: 8,
            price: 3,
            offerType: "urgent",
            distance: 1.2,
            pickup: "07:00 às 18:00",
            address: "Centro",
            emoji: "🍌",
            active: true
        },
        {
            id: generateId(),
            name: "Tomates",
            category: "Legumes",
            description: "Tomates frescos selecionados.",
            supplier: "Hortifruti Verde Vida",
            quantity: 20,
            unit: "kg",
            expiry: datePlus(5),
            originalPrice: 12,
            price: 6,
            offerType: "discount",
            distance: 1.2,
            pickup: "07:00 às 18:00",
            address: "Centro",
            emoji: "🍅",
            active: true
        },
        {
            id: generateId(),
            name: "Pães artesanais",
            category: "Padaria",
            description: "Pães artesanais produzidos no dia.",
            supplier: "Padaria Sabor da Casa",
            quantity: 25,
            unit: "unidade",
            expiry: datePlus(2),
            originalPrice: 18,
            price: 4,
            offerType: "urgent",
            distance: 2.5,
            pickup: "16:00 às 20:00",
            address: "Jardim Central",
            emoji: "🥖",
            active: true
        },
        {
            id: generateId(),
            name: "Croissants",
            category: "Padaria",
            description: "Croissants frescos.",
            supplier: "Padaria Sabor da Casa",
            quantity: 12,
            unit: "unidade",
            expiry: datePlus(1),
            originalPrice: 10,
            price: 3,
            offerType: "urgent",
            distance: 2.5,
            pickup: "16:00 às 20:00",
            address: "Jardim Central",
            emoji: "🥐",
            active: true
        },
        {
            id: generateId(),
            name: "Marmita do dia",
            category: "Refeições",
            description: "Refeição completa preparada no dia.",
            supplier: "Restaurante Bom Prato",
            quantity: 18,
            unit: "unidade",
            expiry: datePlus(1),
            originalPrice: 25,
            price: 10,
            offerType: "urgent",
            distance: 0.8,
            pickup: "18:00 às 20:30",
            address: "Avenida Brasil",
            emoji: "🍱",
            active: true
        },
        {
            id: generateId(),
            name: "Kit de hortaliças",
            category: "Verduras",
            description: "Mix de verduras e folhas.",
            supplier: "Hortifruti Verde Vida",
            quantity: 10,
            unit: "kit",
            expiry: datePlus(4),
            originalPrice: 20,
            price: 9,
            offerType: "discount",
            distance: 1.2,
            pickup: "07:00 às 18:00",
            address: "Centro",
            emoji: "🥬",
            active: true
        },
        {
            id: generateId(),
            name: "Leite próximo do vencimento",
            category: "Laticínios",
            description: "Leite refrigerado dentro da validade.",
            supplier: "Supermercado Economia",
            quantity: 20,
            unit: "litro",
            expiry: datePlus(3),
            originalPrice: 6,
            price: 2.5,
            offerType: "urgent",
            distance: 3.7,
            pickup: "08:00 às 19:00",
            address: "Setor Oeste",
            emoji: "🥛",
            active: true
        },
        {
            id: generateId(),
            name: "Legumes variados",
            category: "Legumes",
            description: "Mix de legumes frescos.",
            supplier: "Mercado Esperança",
            quantity: 15,
            unit: "kg",
            expiry: datePlus(8),
            originalPrice: 18,
            price: 9,
            offerType: "discount",
            distance: 0.8,
            pickup: "08:00 às 18:00",
            address: "Centro",
            emoji: "🥕",
            active: true
        },
        {
            id: generateId(),
            name: "Bolo do dia",
            category: "Padaria",
            description: "Bolo caseiro produzido hoje.",
            supplier: "Padaria Sabor da Casa",
            quantity: 8,
            unit: "unidade",
            expiry: datePlus(1),
            originalPrice: 20,
            price: 7,
            offerType: "urgent",
            distance: 2.5,
            pickup: "17:00 às 20:00",
            address: "Jardim Central",
            emoji: "🍰",
            active: true
        },
        {
            id: generateId(),
            name: "Cesta de supermercado",
            category: "Mercado",
            description: "Produtos variados próximos da validade.",
            supplier: "Supermercado Economia",
            quantity: 6,
            unit: "cesta",
            expiry: datePlus(6),
            originalPrice: 60,
            price: 25,
            offerType: "discount",
            distance: 3.7,
            pickup: "08:00 às 19:00",
            address: "Setor Oeste",
            emoji: "🛒",
            active: true
        },
        {
            id: generateId(),
            name: "Kit de alimentos gratuitos",
            category: "Doações",
            description: "Alimentos disponíveis gratuitamente.",
            supplier: "Mercado Esperança",
            quantity: 10,
            unit: "kit",
            expiry: datePlus(4),
            originalPrice: 30,
            price: 0,
            offerType: "donation",
            distance: 0.8,
            pickup: "10:00 às 16:00",
            address: "Centro",
            emoji: "💚",
            active: true
        }
    ];

    saveData();
}

function showPage(page) {
    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    const pageElement = document.getElementById(page + "Page");

    if (pageElement) {
        pageElement.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (page === "explore") {
        renderProducts();
    }

    if (page === "impact") {
        renderImpact();
    }

    if (page === "buyerDashboard") {
        renderBuyerDashboard();
    }

    if (page === "supplierDashboard") {
        renderSupplierDashboard();
    }

    if (page === "buyerOrders") {
        renderBuyerOrders();
    }
}

function toggleMenu() {
    const nav = document.querySelector(".nav-links");
    const actions = document.querySelector(".nav-actions");

    if (nav.style.display === "flex") {
        nav.style.display = "";
        actions.style.display = "";
    } else {
        nav.style.display = "flex";
        nav.style.flexDirection = "column";
        nav.style.position = "absolute";
        nav.style.top = "65px";
        nav.style.left = "0";
        nav.style.right = "0";
        nav.style.padding = "20px";
        nav.style.background = "white";

        actions.style.display = "flex";
        actions.style.position = "absolute";
        actions.style.top = "250px";
        actions.style.left = "20px";
    }
}

function openAuth(type, selectedType = null) {
    if (type === "login") {
        showPage("login");
        return;
    }

    showPage("register");

    document.getElementById("registerType").classList.remove("hidden");
    document.getElementById("buyerRegister").classList.add("hidden");
    document.getElementById("supplierRegister").classList.add("hidden");

    if (selectedType) {
        selectRegisterType(selectedType);
    }
}

function selectRegisterType(type) {
    document.getElementById("registerType").classList.add("hidden");

    if (type === "buyer") {
        document.getElementById("buyerRegister").classList.remove("hidden");
        document.getElementById("supplierRegister").classList.add("hidden");
    } else {
        document.getElementById("supplierRegister").classList.remove("hidden");
        document.getElementById("buyerRegister").classList.add("hidden");
    }
}

function registerUser(event, type) {
    event.preventDefault();

    let user;

    if (type === "buyer") {
        user = {
            id: generateId(),
            type: "buyer",
            name: document.getElementById("buyerName").value,
            email: document.getElementById("buyerEmail").value.toLowerCase(),
            password: document.getElementById("buyerPassword").value,
            phone: document.getElementById("buyerPhone").value,
            city: document.getElementById("buyerCity").value,
            address: document.getElementById("buyerAddress").value
        };
    } else {
        user = {
            id: generateId(),
            type: "supplier",
            name: document.getElementById("supplierName").value,
            cnpj: document.getElementById("supplierCnpj").value,
            email: document.getElementById("supplierEmail").value.toLowerCase(),
            password: document.getElementById("supplierPassword").value,
            phone: document.getElementById("supplierPhone").value,
            address: document.getElementById("supplierAddress").value,
            city: document.getElementById("supplierCity").value,
            establishmentType: document.getElementById("supplierType").value
        };
    }

    const exists = users.some(u => u.email === user.email);

    if (exists) {
        toast("Este e-mail já está cadastrado.", "error");
        return;
    }

    users.push(user);
    currentUser = user;

    localStorage.setItem(STORAGE.currentUser, JSON.stringify(currentUser));
    saveData();

    toast("Conta criada com sucesso!", "success");

    setTimeout(() => {
        if (type === "buyer") {
            showPage("buyerDashboard");
        } else {
            showPage("supplierDashboard");
        }

        updateNavigation();
    }, 500);
}

function login(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        toast("E-mail ou senha incorretos.", "error");
        return;
    }

    currentUser = user;
    localStorage.setItem(STORAGE.currentUser, JSON.stringify(currentUser));

    toast("Login realizado com sucesso!", "success");

    setTimeout(() => {
        updateNavigation();

        if (user.type === "buyer") {
            showPage("buyerDashboard");
        } else {
            showPage("supplierDashboard");
        }
    }, 500);
}

function logout() {
    currentUser = null;
    localStorage.removeItem(STORAGE.currentUser);
    updateNavigation();
    showPage("home");
    toast("Você saiu da conta.");
}

function updateNavigation() {
    const navActions = document.getElementById("navActions");

    if (!currentUser) {
        navActions.innerHTML = `
            <button class="btn btn-outline" onclick="openAuth('login')">Entrar</button>
            <button class="btn btn-primary" onclick="openAuth('register')">Criar conta</button>
        `;
        return;
    }

    navActions.innerHTML = `
        <button class="btn btn-outline" onclick="${currentUser.type === "buyer" ? "showPage('buyerDashboard')" : "showPage('supplierDashboard')"}">
            Minha conta
        </button>
        <button class="btn btn-primary" onclick="logout()">Sair</button>
    `;
}

function renderProducts() {
    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    let list = products.filter(p => p.active !== false);

    const search = document.getElementById("searchInput")?.value.toLowerCase() || "";

    if (search) {
        list = list.filter(p =>
            p.name.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search) ||
            p.supplier.toLowerCase().includes(search)
        );
    }

    if (currentFilter === "free") {
        list = list.filter(p => p.price === 0);
    }

    if (currentFilter === "5") {
        list = list.filter(p => p.price <= 5);
    }

    if (currentFilter === "10") {
        list = list.filter(p => p.price <= 10);
    }

    if (currentFilter === "near") {
        list.sort((a, b) => a.distance - b.distance);
    }

    if (currentFilter === "urgent") {
        list = list.filter(p => daysUntil(p.expiry) <= 7);
    }

    if (currentFilter === "discount") {
        list.sort((a, b) => getDiscount(b) - getDiscount(a));
    }

    const sort = document.getElementById("sortFilter")?.value;

    if (sort === "price") {
        list.sort((a, b) => a.price - b.price);
    }

    if (sort === "discount") {
        list.sort((a, b) => getDiscount(b) - getDiscount(a));
    }

    if (sort === "distance") {
        list.sort((a, b) => a.distance - b.distance);
    }

    if (list.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px">
                <h2>Nenhum alimento encontrado</h2>
                <p style="color:#6B7280">Tente mudar sua busca ou seus filtros.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = list.map(productCard).join("");
}

function getDiscount(product) {
    if (product.originalPrice <= 0) return 0;

    return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
}

function productCard(product) {
    const validity = getValidity(product);
    const discount = getDiscount(product);

    let badge = "";

    if (product.offerType === "donation") {
        badge = `<span class="product-badge donation">DOAÇÃO</span>`;
    } else if (product.offerType === "urgent") {
        badge = `<span class="product-badge urgent">PRÓXIMO DO VENCIMENTO</span>`;
    } else {
        badge = `<span class="product-badge">${discount}% OFF</span>`;
    }

    const image = product.image
        ? `<img src="${product.image}" alt="${product.name}">`
        : product.emoji || productEmojis[product.category] || "🍽️";

    const unavailable = !validity.available || product.quantity <= 0;

    return `
        <article class="product-card">
            <div class="product-image">
                ${image}
                ${badge}
            </div>

            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <div class="supplier">${product.supplier}</div>

                <div class="product-meta">
                    <span>📍 ${String(product.distance).replace(".", ",")} km de você</span>
                    <span>📅 Validade: ${formatDate(product.expiry)}</span>
                    <span>📦 ${product.quantity} ${product.unit} disponíveis</span>
                </div>

                <div class="product-price">
                    <div>
                        ${product.price < product.originalPrice
                            ? `<div class="old">${money(product.originalPrice)}</div>`
                            : ""}
                        <strong>${product.price === 0 ? "GRÁTIS" : money(product.price)}</strong>
                    </div>
                </div>

                ${
                    unavailable
                        ? `<button class="add-cart" disabled>${product.quantity <= 0 ? "SEM ESTOQUE" : "INDISPONÍVEL"}</button>`
                        : `<button class="add-cart" onclick="addToCart('${product.id}')">+ Adicionar ao carrinho</button>`
                }
            </div>
        </article>
    `;
}

function setFilter(filter, element) {
    currentFilter = filter;

    document.querySelectorAll(".filter").forEach(button => {
        button.classList.remove("active");
    });

    element.classList.add("active");

    renderProducts();
}

function filterCategory(category) {
    showPage("explore");

    setTimeout(() => {
        document.getElementById("searchInput").value = category;
        renderProducts();
    }, 100);
}

function addToCart(productId) {
    if (!currentUser) {
        toast("Faça login para adicionar produtos ao carrinho.", "error");
        openAuth("login");
        return;
    }

    if (currentUser.type !== "buyer") {
        toast("Apenas compradores podem fazer pedidos.", "error");
        return;
    }

    const product = products.find(p => p.id === productId);

    if (!product) return;

    const validity = getValidity(product);

    if (!validity.available) {
        toast("Este alimento não está mais disponível.", "error");
        return;
    }

    const existing = cart.find(item => item.productId === productId);

    if (existing) {
        if (existing.quantity >= product.quantity) {
            toast("Quantidade máxima em estoque atingida.", "error");
            return;
        }

        existing.quantity++;
    } else {
        cart.push({
            productId,
            quantity: 1
        });
    }

    saveData();
    updateCartCount();
    toast("Produto adicionado ao carrinho!", "success");
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    const element = document.getElementById("cartCount");

    if (element) {
        element.textContent = count;
    }
}

function getCartDetails() {
    return cart.map(item => {
        const product = products.find(p => p.id === item.productId);

        if (!product) return null;

        return {
            ...product,
            cartQuantity: item.quantity
        };
    }).filter(Boolean);
}

function getCartTotal() {
    return getCartDetails().reduce(
        (total, product) => total + product.price * product.cartQuantity,
        0
    );
}

function openCart() {
    if (!currentUser) {
        openAuth("login");
        return;
    }

    if (currentUser.type !== "buyer") {
        toast("Apenas compradores possuem carrinho.", "error");
        return;
    }

    renderCart();
    document.getElementById("cartModal").classList.add("open");
}

function renderCart() {
    const items = document.getElementById("cartItems");
    const summary = document.getElementById("cartSummary");
    const details = getCartDetails();

    if (details.length === 0) {
        items.innerHTML = `
            <div style="text-align:center;padding:40px 0">
                <div style="font-size:50px">🛒</div>
                <h3>Seu carrinho está vazio</h3>
                <p style="color:#6B7280">Encontre alimentos e adicione ao carrinho.</p>
            </div>
        `;

        summary.innerHTML = "";
        return;
    }

    items.innerHTML = details.map(product => `
        <div class="cart-item">
            <div class="cart-item-image">${product.emoji || "🍽️"}</div>

            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <span>${money(product.price)} cada</span>
            </div>

            <div class="quantity-controls">
                <button onclick="changeCartQuantity('${product.id}',-1)">−</button>
                <strong>${product.cartQuantity}</strong>
                <button onclick="changeCartQuantity('${product.id}',1)">+</button>
            </div>

            <strong>${money(product.price * product.cartQuantity)}</strong>

            <button onclick="removeFromCart('${product.id}')" style="border:none;background:none;color:#EF4444">×</button>
        </div>
    `).join("");

    summary.innerHTML = `
        <div class="cart-summary">
            <div class="checkout-total">
                <span>Total</span>
                <strong>${money(getCartTotal())}</strong>
            </div>
            <button class="btn btn-primary full" onclick="openCheckout()">Continuar para checkout</button>
        </div>
    `;
}

function changeCartQuantity(productId, amount) {
    const item = cart.find(i => i.productId === productId);
    const product = products.find(p => p.id === productId);

    if (!item || !product) return;

    const newQuantity = item.quantity + amount;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (newQuantity > product.quantity) {
        toast("Quantidade máxima em estoque atingida.", "error");
        return;
    }

    item.quantity = newQuantity;

    saveData();
    renderCart();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);

    saveData();
    renderCart();
    updateCartCount();
    toast("Produto removido do carrinho.");
}

function openCheckout() {
    const details = getCartDetails();

    if (details.length === 0) {
        toast("Seu carrinho está vazio.", "error");
        return;
    }

    closeModal("cartModal");

    document.getElementById("checkoutItems").innerHTML = details.map(product => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px">
            <span>${product.name} × ${product.cartQuantity}</span>
            <strong>${money(product.price * product.cartQuantity)}</strong>
        </div>
    `).join("");

    document.getElementById("checkoutTotal").textContent = money(getCartTotal());

    document.getElementById("checkoutModal").classList.add("open");
}

function toggleDeliveryAddress() {
    const type = document.getElementById("receiptType").value;

    document.getElementById("deliveryAddressBox")
        .classList.toggle("hidden", type !== "delivery");
}

function finishOrder() {
    if (!currentUser) return;

    const details = getCartDetails();

    if (details.length === 0) {
        toast("Carrinho vazio.", "error");
        return;
    }

    const receiptType = document.getElementById("receiptType").value;

    if (
        receiptType === "delivery" &&
        !document.getElementById("deliveryAddress").value
    ) {
        toast("Informe o endereço de entrega.", "error");
        return;
    }

    for (const item of details) {
        const product = products.find(p => p.id === item.id);

        if (!product || product.quantity < item.cartQuantity) {
            toast(`Estoque insuficiente para ${item.name}.`, "error");
            return;
        }

        if (!getValidity(product).available) {
            toast(`${item.name} não está mais disponível.`, "error");
            return;
        }
    }

    const orderNumber = "PF-" + Math.floor(100000 + Math.random() * 900000);

    const order = {
        id: generateId(),
        number: orderNumber,
        userId: currentUser.id,
        date: new Date().toISOString(),
        products: details.map(item => ({
            productId: item.id,
            name: item.name,
            supplier: item.supplier,
            quantity: item.cartQuantity,
            price: item.price
        })),
        total: getCartTotal(),
        receiptType,
        address: receiptType === "delivery"
            ? document.getElementById("deliveryAddress").value
            : currentUser.address,
        status: "Pedido realizado"
    };

    details.forEach(item => {
        const product = products.find(p => p.id === item.id);
        product.quantity -= item.cartQuantity;
    });

    orders.push(order);
    cart = [];

    saveData();
    updateCartCount();
    closeModal("checkoutModal");

    alert(
        `Pedido realizado com sucesso! 🎉\n\n` +
        `Número do pedido: ${orderNumber}\n\n` +
        `Obrigado por ajudar a reduzir o desperdício de alimentos.`
    );

    showPage("buyerOrders");
}

function showBuyerOrders() {
    showPage("buyerOrders");
}

function renderBuyerOrders() {
    const container = document.getElementById("buyerOrdersList");

    if (!container || !currentUser) return;

    const userOrders = orders
        .filter(order => order.userId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (userOrders.length === 0) {
        container.innerHTML = `
            <div class="order-card" style="text-align:center;padding:50px">
                <div style="font-size:45px">📦</div>
                <h3>Você ainda não realizou pedidos.</h3>
                <button class="btn btn-primary" onclick="showPage('explore')" style="margin-top:15px">
                    Encontrar alimentos
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = userOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <strong>Pedido ${order.number}</strong>
                    <div style="font-size:11px;color:#6B7280">
                        ${new Date(order.date).toLocaleString("pt-BR")}
                    </div>
                </div>

                <span class="status active">${order.status}</span>
            </div>

            <div class="order-products">
                ${order.products.map(p =>
                    `${p.quantity}x ${p.name} — ${money(p.price)}`
                ).join("<br>")}
            </div>

            <div class="order-footer">
                <span>${order.receiptType === "delivery" ? "🚚 Entrega" : "🏪 Retirada"}</span>
                <strong>${money(order.total)}</strong>
            </div>
        </div>
    `).join("");
}

function renderBuyerDashboard() {
    if (!currentUser) return;

    document.getElementById("buyerGreeting").textContent =
        `Olá, ${currentUser.name.split(" ")[0]}! 👋`;

    const userOrders = orders.filter(o => o.userId === currentUser.id);

    const totalSaved = userOrders.reduce((sum, order) => {
        return sum + order.products.reduce((s, p) => {
            const product = products.find(x => x.id === p.productId);
            if (!product) return s;

            return s + Math.max(0, product.originalPrice - p.price) * p.quantity;
        }, 0);
    }, 0);

    const foodUnits = userOrders.reduce((sum, order) => {
        return sum + order.products.reduce((s, p) => s + p.quantity, 0);
    }, 0);

    const kg = Math.round(foodUnits * 0.8);

    document.getElementById("buyerStats").innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">📦</div>
            <strong>${userOrders.length}</strong>
            <span>Pedidos realizados</span>
        </div>

        <div class="stat-card">
            <div class="stat-icon">💰</div>
            <strong>${money(totalSaved)}</strong>
            <span>Economia total</span>
        </div>

        <div class="stat-card">
            <div class="stat-icon">🥗</div>
            <strong>${foodUnits}</strong>
            <span>Alimentos resgatados</span>
        </div>

        <div class="stat-card">
            <div class="stat-icon">🌱</div>
            <strong>${kg} kg</strong>
            <span>Impacto gerado</span>
        </div>
    `;

    updateCartCount();

    const recommended = products
        .filter(p => p.active !== false && getValidity(p).available)
        .slice(0, 4);

    document.getElementById("recommendedGrid").innerHTML =
        recommended.map(productCard).join("");
}

function renderSupplierDashboard() {
    if (!currentUser) return;

    document.getElementById("supplierGreeting").textContent =
        `Olá, ${currentUser.name}! 👋`;

    const supplierProducts = products.filter(
        p => p.supplier === currentUser.name
    );

    const supplierOrders = orders.filter(order =>
        order.products.some(p => p.supplier === currentUser.name)
    );

    const sold = supplierOrders.reduce((sum, order) => {
        return sum + order.products
            .filter(p => p.supplier === currentUser.name)
            .reduce((s, p) => s + p.quantity, 0);
    }, 0);

    const donated = supplierOrders.reduce((sum, order) => {
        return sum + order.products
            .filter(p => p.supplier === currentUser.name && p.price === 0)
            .reduce((s, p) => s + p.quantity, 0);
    }, 0);

    const recovered = supplierOrders.reduce((sum, order) => {
        return sum + order.products
            .filter(p => p.supplier === currentUser.name)
            .reduce((s, p) => s + p.price * p.quantity, 0);
    }, 0);

    const kg = Math.round(sold * 0.8);

    document.getElementById("supplierStats").innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">🍎</div>
            <strong>${supplierProducts.length}</strong>
            <span>Alimentos ativos</span>
        </div>

        <div class="stat-card">
            <div class="stat-icon">📦</div>
            <strong>${sold}</strong>
            <span>Unidades vendidas</span>
        </div>

        <div class="stat-card">
            <div class="stat-icon">💚</div>
            <strong>${donated}</strong>
            <span>Unidades doadas</span>
        </div>

        <div class="stat-card">
            <div class="stat-icon">🌱</div>
            <strong>${kg} kg</strong>
            <span>Alimentos reutilizados</span>
        </div>
    `;

    const table = document.getElementById("supplierProductsTable");

    if (supplierProducts.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:35px">
                    Você ainda não cadastrou alimentos.
                </td>
            </tr>
        `;
    } else {
        table.innerHTML = supplierProducts.map(product => {
            const validity = getValidity(product);

            return `
                <tr>
                    <td>
                        <strong>${product.emoji || "🍽️"} ${product.name}</strong>
                    </td>
                    <td>${product.quantity} ${product.unit}</td>
                    <td>${formatDate(product.expiry)}</td>
                    <td>${product.price === 0 ? "GRÁTIS" : money(product.price)}</td>
                    <td>
                        <span class="status ${validity.className}">
                            ${validity.label}
                        </span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button onclick="editProduct('${product.id}')">✏️</button>
                            <button onclick="toggleProduct('${product.id}')">
                                ${product.active === false ? "▶️" : "⏸️"}
                            </button>
                            <button onclick="deleteProduct('${product.id}')">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }

    renderSupplierOrders();
}

function renderSupplierOrders() {
    const container = document.getElementById("supplierOrders");

    if (!currentUser || !container) return;

    const supplierOrders = orders.filter(order =>
        order.products.some(p => p.supplier === currentUser.name)
    );

    if (supplierOrders.length === 0) {
        container.innerHTML = `
            <div class="order-card">
                <p>Nenhum pedido recebido ainda.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = supplierOrders.map(order => {
        const items = order.products.filter(
            p => p.supplier === currentUser.name
        );

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <strong>Pedido ${order.number}</strong>
                        <div style="font-size:11px;color:#6B7280">
                            ${new Date(order.date).toLocaleString("pt-BR")}
                        </div>
                    </div>

                    <select onchange="changeOrderStatus('${order.id}',this.value)">
                        ${[
                            "Pedido realizado",
                            "Confirmado",
                            "Preparando",
                            "Pronto para retirada",
                            "Em entrega",
                            "Concluído"
                        ].map(status =>
                            `<option ${order.status === status ? "selected" : ""}>${status}</option>`
                        ).join("")}
                    </select>
                </div>

                <div class="order-products">
                    Cliente: ${currentUser.name}<br>
                    ${items.map(p => `${p.quantity}x ${p.name}`).join("<br>")}
                </div>

                <div class="order-footer">
                    <span>${order.receiptType === "delivery" ? "🚚 Entrega" : "🏪 Retirada"}</span>
                    <strong>${money(items.reduce((s,p) => s + p.price * p.quantity, 0))}</strong>
                </div>
            </div>
        `;
    }).join("");
}

function changeOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);

    if (!order) return;

    order.status = status;

    saveData();
    renderSupplierOrders();

    toast("Status do pedido atualizado!", "success");
}

function openProductModal(product = null) {
    if (!currentUser || currentUser.type !== "supplier") {
        toast("Faça login como fornecedor para cadastrar alimentos.", "error");
        return;
    }

    document.getElementById("productModal").classList.add("open");

    if (!product) {
        document.getElementById("productModalTitle").textContent =
            "Adicionar alimento";

        document.querySelector("#productModal form").reset();
        document.getElementById("editProductId").value = "";
        document.getElementById("productPrice").disabled = false;
        return;
    }

    document.getElementById("productModalTitle").textContent =
        "Editar alimento";

    document.getElementById("editProductId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productDescription").value = product.description || "";
    document.getElementById("productImage").value = product.image || "";
    document.getElementById("productQuantity").value = product.quantity;
    document.getElementById("productUnit").value = product.unit;
    document.getElementById("productExpiry").value = product.expiry;
    document.getElementById("productOriginalPrice").value = product.originalPrice;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productOfferType").value = product.offerType;
    document.getElementById("productPickup").value = product.pickup || "";
    document.getElementById("productAddress").value = product.address || "";

    handleOfferType();
}

function handleOfferType() {
    const type = document.getElementById("productOfferType").value;
    const price = document.getElementById("productPrice");

    if (type === "donation") {
        price.value = "0";
        price.disabled = true;
    } else {
        price.disabled = false;
    }
}

function saveProduct(event) {
    event.preventDefault();

    const editId = document.getElementById("editProductId").value;

    const type = document.getElementById("productOfferType").value;

    const productData = {
        name: document.getElementById("productName").value,
        category: document.getElementById("productCategory").value,
        description: document.getElementById("productDescription").value,
        image: document.getElementById("productImage").value,
        quantity: Number(document.getElementById("productQuantity").value),
        unit: document.getElementById("productUnit").value,
        expiry: document.getElementById("productExpiry").value,
        originalPrice: Number(document.getElementById("productOriginalPrice").value),
        price: type === "donation"
            ? 0
            : Number(document.getElementById("productPrice").value),
        offerType: type,
        pickup: document.getElementById("productPickup").value,
        address: document.getElementById("productAddress").value
    };

    if (!productData.expiry) {
        toast("Informe a validade.", "error");
        return;
    }

    if (daysUntil(productData.expiry) < 0) {
        toast("A validade não pode estar no passado.", "error");
        return;
    }

    if (editId) {
        const product = products.find(p => p.id === editId);

        if (!product) return;

        Object.assign(product, productData);

        toast("Alimento atualizado com sucesso!", "success");
    } else {
        products.push({
            id: generateId(),
            ...productData,
            supplier: currentUser.name,
            distance: 1.5,
            emoji: productEmojis[productData.category] || "🍽️",
            active: true
        });

        toast("Alimento cadastrado com sucesso!", "success");
    }

    saveData();
    closeModal("productModal");
    renderSupplierDashboard();
}

function editProduct(id) {
    const product = products.find(p => p.id === id);

    if (product) {
        openProductModal(product);
    }
}

function deleteProduct(id) {
    const product = products.find(p => p.id === id);

    if (!product) return;

    if (!confirm(`Excluir "${product.name}"?`)) {
        return;
    }

    products = products.filter(p => p.id !== id);

    cart = cart.filter(item => item.productId !== id);

    saveData();
    updateCartCount();
    renderSupplierDashboard();

    toast("Alimento excluído.");
}

function toggleProduct(id) {
    const product = products.find(p => p.id === id);

    if (!product) return;

    product.active = product.active === false;

    saveData();
    renderSupplierDashboard();

    toast(
        product.active
            ? "Alimento publicado novamente."
            : "Alimento pausado."
    );
}

function renderImpact() {
    const container = document.getElementById("impactContent");

    if (!container) return;

    if (!currentUser) {
        container.innerHTML = `
            <div class="order-card" style="text-align:center;padding:50px">
                <div style="font-size:50px">🌱</div>
                <h2>Entre para acompanhar seu impacto</h2>
                <p style="color:#6B7280;margin:10px 0 20px">
                    Crie uma conta para acompanhar alimentos resgatados,
                    economia e outros indicadores.
                </p>
                <button class="btn btn-primary" onclick="openAuth('login')">Entrar</button>
            </div>
        `;
        return;
    }

    if (currentUser.type === "buyer") {
        renderBuyerImpact(container);
    } else {
        renderSupplierImpact(container);
    }
}

function renderBuyerImpact(container) {
    const userOrders = orders.filter(o => o.userId === currentUser.id);

    const units = userOrders.reduce((sum, order) =>
        sum + order.products.reduce((s, p) => s + p.quantity, 0), 0);

    const saved = userOrders.reduce((sum, order) => {
        return sum + order.products.reduce((s, p) => {
            const original = products.find(x => x.id === p.productId)?.originalPrice || p.price;
            return s + Math.max(0, original - p.price) * p.quantity;
        }, 0);
    }, 0);

    const kg = Math.round(units * 0.8);
    const environmental = Math.round(kg * 2.5);

    container.innerHTML = `
        <div class="impact-grid">
            <div class="impact-card">
                <div class="big">${units}</div>
                <p>Alimentos resgatados</p>
            </div>

            <div class="impact-card">
                <div class="big">${money(saved)}</div>
                <p>Dinheiro economizado</p>
            </div>

            <div class="impact-card">
                <div class="big">${kg} kg</div>
                <p>Alimentos que deixaram de ser desperdiçados</p>
            </div>

            <div class="impact-card">
                <div class="big">${environmental}</div>
                <p>Impacto ambiental estimado</p>
            </div>
        </div>

        <div class="chart-box">
            <h2>Seu impacto ao longo do tempo</h2>
            <p style="color:#6B7280;font-size:13px">
                Estimativa baseada nos alimentos resgatados.
            </p>

            <div class="bar-chart">
                <div class="bar" style="height:${Math.max(15, units * 8)}px">
                    <span>Alimentos</span>
                </div>

                <div class="bar" style="height:${Math.max(15, Math.min(180, saved))}px">
                    <span>Economia</span>
                </div>

                <div class="bar" style="height:${Math.max(15, Math.min(180, kg * 10))}px">
                    <span>Kg</span>
                </div>

                <div class="bar" style="height:${Math.max(15, Math.min(180, environmental / 2))}px">
                    <span>Impacto</span>
                </div>
            </div>
        </div>
    `;
}

function renderSupplierImpact(container) {
    const supplierOrders = orders.filter(order =>
        order.products.some(p => p.supplier === currentUser.name)
    );

    const listed = products.filter(
        p => p.supplier === currentUser.name
    ).length;

    const sold = supplierOrders.reduce((sum, order) =>
        sum + order.products
            .filter(p => p.supplier === currentUser.name)
            .reduce((s,p) => s + p.quantity, 0), 0);

    const donated = supplierOrders.reduce((sum, order) =>
        sum + order.products
            .filter(p => p.supplier === currentUser.name && p.price === 0)
            .reduce((s,p) => s + p.quantity, 0), 0);

    const kg = Math.round(sold * 0.8);
    const people = sold;

    container.innerHTML = `
        <div class="impact-grid">
            <div class="impact-card">
                <div class="big">${listed}</div>
                <p>Alimentos anunciados</p>
            </div>

            <div class="impact-card">
                <div class="big">${sold}</div>
                <p>Alimentos vendidos</p>
            </div>

            <div class="impact-card">
                <div class="big">${donated}</div>
                <p>Alimentos doados</p>
            </div>

            <div class="impact-card">
                <div class="big">${kg} kg</div>
                <p>Alimentos reutilizados</p>
            </div>
        </div>

        <div class="chart-box">
            <h2>Pessoas beneficiadas</h2>
            <p style="color:#6B7280;font-size:13px">
                Estimativa baseada na quantidade de alimentos disponibilizados.
            </p>

            <div style="font-size:55px;font-weight:800;color:#166534;margin-top:25px">
                ${people} 👥
            </div>
        </div>
    `;
}

function closeModal(id) {
    document.getElementById(id).classList.remove("open");
}

function toast(message, type = "") {
    const container = document.getElementById("toastContainer");

    const element = document.createElement("div");
    element.className = `toast ${type}`;
    element.textContent = message;

    container.appendChild(element);

    setTimeout(() => {
        element.remove();
    }, 3000);
}

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("open");
        }
    });
});

function initialize() {
    seedProducts();
    updateNavigation();
    updateCartCount();

    if (currentUser) {
        if (currentUser.type === "buyer") {
            renderBuyerDashboard();
        } else {
            renderSupplierDashboard();
        }
    }

    renderProducts();
}

initialize();