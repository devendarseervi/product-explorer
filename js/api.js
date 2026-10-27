
const API_BASE_URL = "https://fakestoreapi.com";

export async function fetchProducts() {
   
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
        throw new Error(`Failed to load products (${response.status})`);
    }

    const products = await response.json();

    if (!Array.isArray(products)) {
        throw new Error("The API returned an unexpected response.");
    }

    return products;
}

export async function fetchCategories() {
    const response = await fetch(`${API_BASE_URL}/products/categories`);

    if (!response.ok) {
        throw new Error(`Failed to load categories (${response.status})`);
    }

    const categories = await response.json();

    if (!Array.isArray(categories)) {
        throw new Error("The API returned unexpected categories.");
    }

    return categories;
}
