/* =========================
   DOM References
========================= */

const confirmationModal = document.querySelector(".confirmation-modal");
const confirmedItems = document.querySelector(".confirmed-items");
const startNewOrderButton = document.querySelector(".start-new-order");
const productList = document.querySelector(".list");
const cart = document.querySelector(".cart");
const cartItems = document.querySelector(".cart-items");
const emptyPlaceholder = document.querySelector(".empty-placeholder");
const addedItems = document.querySelector(".added-items");

/* =========================
   Application State
========================= */

const state = {
    products: [],
    cart: []
};

/* =========================
   Load Product Data
========================= */

async function loadProducts() {
    try {
        const response = await fetch("scripts/data.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        state.products = await response.json();

    } catch (error) {
        console.error("Unable to load product data:", error);
    }
}

/* =========================
   Render Products
========================= */

function renderProducts() {
    productList.innerHTML = "";

    state.products.forEach((product, index) => {
        const article = document.createElement("article");
        article.className = "item";

        article.innerHTML = `
            <div class="item-image-and-add-to-cart-button">
                <div class="item-image">
                    <picture>
                        <source
                            media="(max-width: 576px)"
                            srcset="${product.image.mobile}"
                        >
                        <source
                            media="(max-width: 1200px)"
                            srcset="${product.image.tablet}"
                        >
                        <img
                            src="${product.image.desktop}"
                            alt="${product.name}"
                        >
                    </picture>
                </div>

                <button
                    class="add-to-cart"
                    type="button"
                    aria-pressed="false"
                    data-index="${index}"
                >
                    <img
                        src="images/icon-add-to-cart.svg"
                        alt=""
                    >
                    Add to Cart
                </button>

                <div class="add-open hidden">
                    <button
                        class="subtract"
                        type="button"
                        aria-label="Remove one ${product.name}"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <path d="M5 9.375H15V10.625H5V9.375Z"/>
                        </svg>
                    </button>

                    <span class="value">1</span>

                    <button
                        class="add"
                        type="button"
                        aria-label="Add another ${product.name}"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <path d="M15 9.375H10.625V5H9.375V9.375H5V10.625H9.375V15H10.625V10.625H15V9.375Z"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="item-info">
                <p class="category">${product.category}</p>
                <h3 class="name">${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
            </div>
        `;

        productList.appendChild(article);
    });
}

/* =========================
Application Initialization
========================= */

loadProducts().then(() => {
    renderProducts();
});

/* =========================
Update Product UI
========================= */

function updateProductUI(article, quantity) {
    const image = article.querySelector(".item-image");
    const addToCartButton = article.querySelector(".add-to-cart");
    const addOpen = article.querySelector(".add-open");
    const value = article.querySelector(".value");

    if (quantity > 0) {
        image.classList.add("selected");
        addToCartButton.classList.add("hidden");
        addOpen.classList.remove("hidden");
        value.textContent = quantity;
        
    } else {
        image.classList.remove("selected");
        addToCartButton.classList.remove("hidden");
        addOpen.classList.add("hidden");
        value.textContent = "1";
    }
}

/* =========================
Render Cart
========================= */

function renderCart() {
    
    // Total quantity of all products
    const totalQuantity = state.cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // Update cart count
    cartItems.textContent = totalQuantity;

    // Empty cart
    if (state.cart.length === 0) {
        emptyPlaceholder.classList.remove("hidden");
        addedItems.classList.add("hidden");
        return;
    }

    // Cart contains products
    emptyPlaceholder.classList.add("hidden");
    addedItems.classList.remove("hidden");

    // Clear existing cart items
    addedItems.innerHTML = "";

    // Create cart items
    state.cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "added-item-on-cart";
        
        cartItem.innerHTML = `
            <div class="added-item-information">
                <p class="added-item-information-name">
                    ${item.name}
                </p>

                <div class="quantity-and-price">
                    <span class="card-quantity">
                        ${item.quantity}x
                    </span>

                    <span class="card-price">
                        @ $${item.price.toFixed(2)}
                    </span>

                    <span class="card-total">
                        $${itemTotal.toFixed(2)}
                    </span>
                </div>
            </div>

            <button
                class="remove"
                type="button"
                aria-label="Remove ${item.name} from cart"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path d="M10 1.25C5.125 1.25 1.25 5.125 1.25 10C1.25 14.875 5.125 18.75 10 18.75C14.875 18.75 18.75 14.875 18.75 10C18.75 5.125 14.875 1.25 10 1.25ZM10 17.5C5.875 17.5 2.5 14.125 2.5 10C2.5 5.875 5.875 2.5 10 2.5C14.125 2.5 17.5 5.875 17.5 10C17.5 14.125 14.125 17.5 10 17.5Z"/>
                    <path d="M13.375 14.375L10 11L6.625 14.375L5.625 13.375L9 10L5.625 6.625L6.625 5.625L10 9L13.375 5.625L14.375 6.625L11 10L14.375 13.375L13.375 14.375Z"/>
                </svg>
            </button>
        `;
        
        addedItems.appendChild(cartItem);
        
        // Separator
        const separator = document.createElement("div");
        separator.className = "separator";

        addedItems.appendChild(separator);
    });

    // Calculate order total
    const orderTotal = state.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const orderTotalElement = document.createElement("div");
    orderTotalElement.className = "order-total";

    orderTotalElement.innerHTML = `
        <p>Order Total</p>
        <span class="order-total-price">
            $${orderTotal.toFixed(2)}
        </span>
    `;

    addedItems.appendChild(orderTotalElement);
    
    const carbonNeutral = document.createElement("div");
    carbonNeutral.className = "carbon-neutral-info";

    carbonNeutral.innerHTML = `
        <div class="carbon-neutral">
            <div class="carbon-tree">
                <img src="images/icon-carbon-neutral.svg" alt="tree-icon" loading="lazy">
            </div>

            <p class="carbon-text">
                This is a <span>carbon neutral</span> delivery
            </p>
        </div>
    `;

    addedItems.appendChild(carbonNeutral);


    const confirmButton = document.createElement("button");

    confirmButton.className = "btn-primary confirm-order";
    confirmButton.type = "button";
    confirmButton.textContent = "Confirm Order";

    addedItems.appendChild(confirmButton);
    
}

/* =========================
Render Confirmation Modal
========================= */

function renderConfirmationModal() {
    confirmedItems.innerHTML = "";

    state.cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;

        const purchasedItem = document.createElement("div");
        purchasedItem.className = "purchased-item-row";

        purchasedItem.innerHTML = `
            <div class="purchased-item">
                <div class="purchased-item-image">
                    <img src="${item.image.thumbnail}" alt="">
                </div>

                <div class="purchased-item-text">
                    <p>${item.name}</p>

                    <div class="purchased-amount">
                        <span class="purchased-quantity">
                            ${item.quantity}x
                        </span>

                        <span class="purchased-price">
                            @ $${item.price.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <p class="purchased-total">
                $${itemTotal.toFixed(2)}
            </p>
        `;

        confirmedItems.appendChild(purchasedItem);
        
        // Add separator between purchased items
        const separator = document.createElement("div");
        separator.className = "separator";

        confirmedItems.appendChild(separator);
    });


    const orderTotal = state.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );


    const total = document.createElement("div");
    total.className = "purchased-order-total";

    total.innerHTML = `
        <span>Order Total</span>
        <span class="purchased-order-price">
            $${orderTotal.toFixed(2)}
        </span>
    `;

    confirmedItems.appendChild(total);
}

/* =========================
Product List Events
========================= */

productList.addEventListener("click", (event) => {
    const addToCartButton = event.target.closest(".add-to-cart");
    const addButton = event.target.closest(".add");
    const subtractButton = event.target.closest(".subtract");

    // Add product to cart
    if (addToCartButton) {
        const index = Number(addToCartButton.dataset.index);
        const product = state.products[index];

        const existingItem = state.cart.find(
            (item) => item.name === product.name
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            state.cart.push({
                ...product,
                quantity: 1
            });
        }

        const article = addToCartButton.closest(".item");

        updateProductUI(article, existingItem ? existingItem.quantity : 1);
        
        renderCart();

        return;
    }

    // Increase quantity
    if (addButton) {
        const article = addButton.closest(".item");
        const productName = article.querySelector(".name").textContent;

        const cartItem = state.cart.find(
            (item) => item.name === productName
        );

        if (!cartItem) return;

        cartItem.quantity += 1;

        updateProductUI(article, cartItem.quantity);
        
        renderCart();

        return;
    }

    // Decrease quantity
    if (subtractButton) {
        const article = subtractButton.closest(".item");
        const productName = article.querySelector(".name").textContent;

        const cartItem = state.cart.find(
            (item) => item.name === productName
        );

        if (!cartItem) return;

        cartItem.quantity -= 1;

        if (cartItem.quantity <= 0) {
            state.cart = state.cart.filter(
                (item) => item.name !== productName
            );

            updateProductUI(article, 0);
        } else {
            updateProductUI(article, cartItem.quantity);
        }
        
        renderCart();
    }
});

/* =========================
Cart Events
========================= */

cart.addEventListener("click", (event) => {
    
    const confirmButton = event.target.closest(".confirm-order");

    if (confirmButton) {

        renderConfirmationModal();
        
        confirmationModal.classList.add("show");
        confirmationModal.classList.remove("hidden");
        confirmationModal.setAttribute("aria-hidden", "false");
        
        return;
    }
    
    const removeButton = event.target.closest(".remove");

    if (!removeButton) return;

    const cartItem = removeButton.closest(".added-item-on-cart");
    const productName = cartItem.querySelector(
        ".added-item-information-name"
    ).textContent;

    // Remove the product from the cart state
    state.cart = state.cart.filter(
        (item) => item.name !== productName
    );

    // Find the matching product card
    const productIndex = state.products.findIndex(
        (product) => product.name === productName
    );

    if (productIndex !== -1) {
        const productArticles = productList.querySelectorAll(".item");
        const productArticle = productArticles[productIndex];

        updateProductUI(productArticle, 0);
    }

    // Re-render the cart
    renderCart();

});

/* =========================
Remove Cart Item Button
========================= */

addedItems.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove");

    if (!removeButton) return;

    const cartItemElement = removeButton.closest(".added-item-on-cart");
    const productName = cartItemElement
        .querySelector(".added-item-information-name")
        .textContent
        .trim();

    // Remove the item from the cart state
    state.cart = state.cart.filter(
        (item) => item.name !== productName
    );

    // Reset the corresponding product card
    const productIndex = state.products.findIndex(
        (product) => product.name === productName
    );

    if (productIndex !== -1) {
        const productArticles = productList.querySelectorAll(".item");
        const article = productArticles[productIndex];

        updateProductUI(article, 0);
    }

    // Re-render the cart
    renderCart();

});

/* =========================
Start New Order
========================= */

startNewOrderButton.addEventListener("click", () => {

    // Close modal
    confirmationModal.classList.remove("show");
    confirmationModal.classList.add("hidden");
    confirmationModal.setAttribute("aria-hidden", "true");

    // Clear cart state
    state.cart = [];

    // Reset product cards
    const productArticles = productList.querySelectorAll(".item");

    productArticles.forEach((article) => {
        updateProductUI(article, 0);
    });

    // Reset cart display
    renderCart();
    
    // Remove focus from modal button
    document.activeElement.blur();

});

/* =========================
Keyboard Events
========================= */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        confirmationModal.classList.remove("show");
        confirmationModal.setAttribute("aria-hidden", "true");
    }
    
    document.activeElement.blur();
    
});
