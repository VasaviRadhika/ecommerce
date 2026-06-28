const usersDiv = document.getElementById("users");
const productsDiv = document.getElementById("products");

let cart = [];
let allProducts = [];
let isProductsOpen = false;

/* TOGGLE MENU */
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
}

/* SHOW SECTION */
function showSection(section) {
  document.querySelector(".user-section").style.display = "none";
  document.querySelector(".product-section").style.display = "none";
  document.querySelector(".cart-section").style.display = "none";

  if (section === "users") {
    document.querySelector(".user-section").style.display = "block";
    loadUsers();
  }

  if (section === "products") {
    document.querySelector(".product-section").style.display = "block";
    isProductsOpen = true;
    displayProducts(allProducts);
  }

  if (section === "cart") {
    document.querySelector(".cart-section").style.display = "block";
    displayCart();
  }
}

/* LOAD USERS */
async function loadUsers() {
  const res = await fetch("https://6a2cdb633e2b60ab03900ffe.mockapi.io/api/v1/users");
  const data = await res.json();

  usersDiv.innerHTML = "";

  data.forEach(user => {
    usersDiv.innerHTML += `
      <div class="user">
        <h3>${user.first_name}</h3>
        <p>${user.email}</p>
        <p>${user.gender}</p>
      </div>
    `;
  });
}

/* LOAD PRODUCTS ONCE */
async function loadProductsOnce() {
  try {
    const res = await fetch("https://6a2cdb633e2b60ab03900ffe.mockapi.io/api/v1/products");
    allProducts = await res.json();
    displayProducts(allProducts);
  } catch {
    productsDiv.innerHTML = "<h2>Failed to load products ❌</h2>";
  }
}

/* DISPLAY PRODUCTS */
function displayProducts(products) {
  productsDiv.innerHTML = "";

  if (products.length === 0) {
    productsDiv.innerHTML = "<h2>No product found ❌</h2>";
    return;
  }

  products.forEach(product => {
    productsDiv.innerHTML += `
      <div class="product">
        <h3>${product.productname}</h3>
        <p>₹${product.price}</p>
        <img src="${product.image}">
        <button onclick="addToCart('${product.productname}', ${product.price})">
          Add to Cart
        </button>
      </div>
    `;
  });
}

/* SEARCH */
function searchProduct() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allProducts.filter(product =>
    product.productname.toLowerCase().includes(searchText)
  );

  openProducts();
  displayProducts(filtered);
}

/* LIVE SEARCH */
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("searchInput");

  searchBox.addEventListener("keyup", function () {
    const searchText = this.value.toLowerCase();

    const filtered = allProducts.filter(product =>
      product.productname.toLowerCase().includes(searchText)
    );

    openProducts();
    displayProducts(filtered);
  });

  loadProductsOnce();
});

/* OPEN PRODUCTS */
function openProducts() {
  if (!isProductsOpen) {
    document.querySelector(".user-section").style.display = "none";
    document.querySelector(".product-section").style.display = "block";
    document.querySelector(".cart-section").style.display = "none";
    isProductsOpen = true;
  }
}

/* CART */
function addToCart(name, price) {
  let item = cart.find(p => p.name === name);

  if (item) item.quantity++;
  else cart.push({ name, price, quantity: 1 });

  displayCart();
}

function displayCart() {
  const cartDiv = document.getElementById("cartItems");
  let total = 0;

  cartDiv.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartDiv.innerHTML += `
      <div class="cart-item">
        ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}
        <br>
        <button onclick="removeItem(${index})">❌ Remove</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

function removeItem(index) {
  cart.splice(index, 1);
  displayCart();
}