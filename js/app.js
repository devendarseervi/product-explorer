import { fetchProducts, fetchCategories } from "./api.js";

const productGrid = document.querySelector("#product-grid");
const statusMessage = document.querySelector("#status-message");
const categoryFilter = document.querySelector("#category-filter");

let allProducts = [];

const CART_STORAGE_KEY = "product-explorer-cart";

function loadCart() {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY) || "[]",
    );

    if (
      !Array.isArray(savedCart) ||
      !savedCart.every(
        (item) =>
          Number.isInteger(item.id) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0,
      )
    ) {
      return [];
    }

    return savedCart;
  } catch {
    return [];
  }
}

let cart = loadCart();

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  document.querySelector("#cart-count").textContent = totalItems;
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  updateCartCount();
}

function renderCart() {
  const cartItemsContainer = document.querySelector("#cart-items");
  const cartTotal = document.querySelector("#cart-total");

  cartItemsContainer.replaceChildren();

  let total = 0;

  cart.forEach((item) => {
    const product = allProducts.find((product) => product.id === item.id);

    if (!product) return;

    total += product.price * item.quantity;

    const itemElement = document.createElement("div");

    const itemText = document.createElement("p");
    itemText.textContent = `${product.title} × ${item.quantity} — $${(product.price * item.quantity).toFixed(2)}`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      cart = cart.filter((cartItem) => cartItem.id !== item.id);
      saveCart();
      updateCartCount();
      renderCart();
    });

    itemElement.append(itemText, removeButton);
    cartItemsContainer.append(itemElement);
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function showLoadingSkeletons() {
  productGrid.replaceChildren();

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 8; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton";
    skeleton.setAttribute("aria-hidden", "true");

    fragment.append(skeleton);
  }

  productGrid.append(fragment);
  statusMessage.textContent = "Loading products...";
}

function renderProducts(products) {
  productGrid.replaceChildren();

  if (products.length === 0) {
    statusMessage.textContent = "No products found.";
    return;
  }

  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;
    image.loading = "lazy";

    const title = document.createElement("h2");
    title.textContent = product.title;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = `$${product.price.toFixed(2)}`;

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => addToCart(product.id));

    card.append(image, title, price, category, addButton);
    fragment.append(card);
  });

  productGrid.append(fragment);
  statusMessage.textContent = `${products.length} products loaded.`;
}

function applyFilters() {
  const searchTerm = document
    .querySelector("#search-input")
    .value.trim()
    .toLowerCase();

  const selectedCategory = categoryFilter.value;
  const sortOption = document.querySelector("#sort-select").value;

  let filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (sortOption === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "name-asc") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  renderProducts(filteredProducts);
}

function populateCategories(categories) {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });
}

async function initializeApp() {
  showLoadingSkeletons();
  productGrid.setAttribute("aria-busy", "true");

  try {
    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
    ]);

    allProducts = products;
    populateCategories(categories);
    renderProducts(allProducts);
    updateCartCount();
  } catch (error) {
    console.error("Unable to initialize product explorer:", error);

    productGrid.replaceChildren();
    statusMessage.textContent =
      "We couldn't load products. Please check your connection and try again.";

    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.textContent = "Retry";
    retryButton.addEventListener("click", initializeApp);

    statusMessage.append(" ");
    statusMessage.append(retryButton);
  } finally {
    productGrid.setAttribute("aria-busy", "false");
  }
}

initializeApp();

document.querySelector("#search-input").addEventListener("input", applyFilters);

categoryFilter.addEventListener("change", applyFilters);

document.querySelector("#sort-select").addEventListener("change", applyFilters);

const cartSection = document.querySelector("#cart-section");

document.querySelector("#cart-toggle").addEventListener("click", () => {
  cartSection.hidden = !cartSection.hidden;

  if (!cartSection.hidden) {
    renderCart();
  }
});

document.querySelector("#cart-close").addEventListener("click", () => {
  cartSection.hidden = true;
});

document.querySelector("#clear-cart").addEventListener("click", () => {
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
});
