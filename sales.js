
const inventoryKey = "inventory";
const salesKey = "sales";

let inventory = JSON.parse(localStorage.getItem(inventoryKey) || "[]");
let cart = [];

const productsGrid = document.getElementById("productsGrid");
const orderItems = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");
const completeSale = document.getElementById("completeSale");

function saveInventory() {
    localStorage.setItem(inventoryKey, JSON.stringify(inventory));
}

function renderProducts() {
    productsGrid.innerHTML = "";

    if (inventory.length === 0) {
        productsGrid.textContent =
            "لا توجد منتجات. أضف المنتجات أولًا من صفحة المخزون.";
        return;
    }

    inventory.forEach((product) => {
        const button = document.createElement("button");
        button.className = "product-card";
        button.type = "button";

        const name = document.createElement("strong");
        name.textContent = product.name;

        const price = document.createElement("span");
        price.textContent = `${product.price} DA`;

        const stock = document.createElement("small");
        stock.textContent = `المتوفر: ${product.quantity} ${product.unit || ""}`;

        button.append(name, price, stock);

        button.addEventListener("click", () => {
            addToCart(product.id);
        });

        productsGrid.appendChild(button);
    });
}

function addToCart(id) {
    const product = inventory.find(p => p.id === id);

    if (!product) return;

    const item = cart.find(p => p.id === id);
    const cartQuantity = item ? item.quantity : 0;

    if (cartQuantity >= Number(product.quantity)) {
        alert("الكمية المتوفرة في المخزون غير كافية.");
        return;
    }

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1
        });
    }

    renderCart();
}

function renderCart() {
    orderItems.innerHTML = "";

    if (cart.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-order";
        empty.textContent = "لم تتم إضافة أي منتجات";
        orderItems.appendChild(empty);
    }

    cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "order-item";

        const info = document.createElement("span");
        info.textContent =
            `${item.name} × ${item.quantity} = ${item.price * item.quantity} DA`;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "−";
        remove.addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart.splice(index, 1);
            }
            renderCart();
        });

        row.append(info, remove);
        orderItems.appendChild(row);
    });

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    orderTotal.textContent = `${total} DA`;
}

completeSale.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("أضف منتجًا إلى الطلب أولًا.");
        return;
    }

    // إعادة قراءة المخزون للتحقق من الكميات الحالية
    inventory = JSON.parse(localStorage.getItem(inventoryKey) || "[]");

    for (const item of cart) {
        const product = inventory.find(p => p.id === item.id);

        if (!product || Number(product.quantity) < item.quantity) {
            alert(`الكمية غير كافية للمنتج: ${item.name}`);
            renderProducts();
            return;
        }
    }

    const sales = JSON.parse(localStorage.getItem(salesKey) || "[]");
    const date = new Date().toISOString();

    for (const item of cart) {
        const product = inventory.find(p => p.id === item.id);
        product.quantity -= item.quantity;

        sales.push({
            product: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            date: date
        });
    }

    saveInventory();
    localStorage.setItem(salesKey, JSON.stringify(sales));

    cart = [];
    renderProducts();
    renderCart();

    alert("تم تسجيل البيع وتحديث المخزون بنجاح!");
});

renderProducts();
renderCart();
