# Product Explorer

A responsive product browsing application built with HTML, CSS, and JavaScript. It fetches product data from the FakeStoreAPI and lets users search, filter, sort, and manage products in a shopping cart.

## Features

- Fetches products and categories from a REST API using `async/await` and `fetch()`
- Search products by name
- Filter products by category
- Sort products by price or name
- Add products to the cart
- Remove individual products or clear the entire cart
- Persist cart items using Local Storage
- Display loading skeletons while products load
- Show user-friendly error messages with a Retry button
- Responsive layout for desktop and mobile screens

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES Modules, DOM manipulation, Fetch API)
- FakeStoreAPI
- Browser Local Storage

## Getting Started

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Run `index.html` using the VS Code Live Server extension.
4. Ensure an internet connection is available to fetch products from the API.

## Project Structure

```text
product-explorer/
├── index.html
├── style.css
├── README.md
└── js/
    ├── api.js
    └── app.js
```

## API

Product data is provided by [FakeStoreAPI](https://fakestoreapi.com/).

## Future Improvements

- Improve cart item quantity controls
- Add automated tests for filtering and cart functionality

## License

This project is available for learning and demonstration purposes.
