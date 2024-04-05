class Product {
  constructor(productId, title, price, quantity) {
    this.productId = productId;
    this.title = title;
    this.price = price;
    this.quantity = quantity;
  }

  getPrice() {
    return this.price * this.quantity;
  }
}

let productCounter = 0;

let isSidebarOpen = false;
const ul = document.getElementById("ul-cart");
const totalSumElement = document.getElementById("total-sum");
let totalSum = 0;

let productArray = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];
localStorage.setItem("cart", JSON.stringify(productArray));
let cartData = JSON.parse(localStorage.getItem("cart"));
cartData = cartData.map(
  (product) =>
    new Product(
      product.productId,
      product.title,
      product.price,
      product.quantity
    )
);

function findProductInCart(product) {
  return cartData.find((p) => p.id === product.id);
}

function updateTotalSum() {
  totalSum = 0;

  if (cartData != null || cartData.length > 0) {
    cartData.forEach((product) => {
      totalSum += parseFloat(product.getPrice());
    });
  }

  totalSumElement.textContent = `$${totalSum.toFixed(2)}`;
}

const productDivMaker = (product) => {
  // Main card div
  const cardDiv = document.createElement("div");
  cardDiv.id = `div-${product.id}`;
  cardDiv.className = "card rounded-3 mb-4";

  // Card body
  const cardBody = document.createElement("div");
  cardBody.className = "card-body p-4";
  cardDiv.appendChild(cardBody);

  // Row
  const rowDiv = document.createElement("div");
  rowDiv.className = "row d-flex justify-content-between align-items-center";
  cardBody.appendChild(rowDiv);

  // Product Name Column
  const productNameCol = document.createElement("div");
  productNameCol.className = "col-md-3 col-lg-3 col-xl-3";
  productNameCol.innerHTML = `<p class="lead fw-normal mb-2">${product.title}</p>`;
  rowDiv.appendChild(productNameCol);

  // Quantity Adjuster Column
  const quantityAdjusterCol = document.createElement("div");
  quantityAdjusterCol.className = "col-md-4 col-lg-4 col-xl-3 d-flex";

  // Decrease quantity button
  const decreaseButton = document.createElement("button");
  decreaseButton.className = "btn btn-link px-2";
  decreaseButton.innerHTML = '<i class="fas fa-minus"></i>';
  decreaseButton.addEventListener("click", function () {
    this.parentNode.querySelector("input[type=number]").stepDown();

    const clickedProduct = findProductInCart(product);
    if (clickedProduct.quantity > 1) {
      clickedProduct.quantity--;
      localStorage.setItem("cart", JSON.stringify(cartData));
      updateTotalSum();
    }
  });

  // Quantity input
  const quantityInput = document.createElement("input");
  quantityInput.setAttribute("min", "1");
  quantityInput.setAttribute("value", product.quantity);
  quantityInput.setAttribute("type", "number");
  quantityInput.className = "form-control form-control-sm";

  // Increase quantity button
  const increaseButton = document.createElement("button");
  increaseButton.className = "btn btn-link px-2";
  increaseButton.innerHTML = '<i class="fas fa-plus"></i>';
  increaseButton.addEventListener("click", function () {
    this.parentNode.querySelector("input[type=number]").stepUp();
    findProductInCart(product).quantity++;
    localStorage.setItem("cart", JSON.stringify(cartData));
    updateTotalSum();
  });

  // Add all elements to the Quantity Adjuster and finally adding it to the Row
  quantityAdjusterCol.appendChild(decreaseButton);
  quantityAdjusterCol.appendChild(quantityInput);
  quantityAdjusterCol.appendChild(increaseButton);
  rowDiv.appendChild(quantityAdjusterCol);

  // Price Column
  const priceCol = document.createElement("div");
  priceCol.className = "col-md-3 col-lg-2 col-xl-2 offset-lg-1";
  priceCol.innerHTML = `<h5 class="mb-0">$${product.getPrice()}</h5>`;
  rowDiv.appendChild(priceCol);

  // Delete Button Column
  const deleteButtonCol = document.createElement("div");
  deleteButtonCol.className = "col-md-1 col-lg-1 col-xl-1 text-end";
  deleteButtonCol.innerHTML = `<a href="#!" class="text-danger"><i class="fas fa-trash fa-lg"></i></a>`;
  deleteButtonCol.addEventListener("click", () => deleteProduct(product.id));

  rowDiv.appendChild(deleteButtonCol);
  ul.appendChild(cardDiv);
  cardDiv.removeAttribute("hidden");
};

cartData.forEach((product) => {
  productDivMaker(product);
});
updateTotalSum();

function toggleSidebar() {
  const sidebar = document.getElementById("shoppingCartSidebar");
  sidebar.classList.toggle("active");
  document.body.classList.toggle("no-scroll");
  isSidebarOpen = sidebar.classList.contains("active");
  sidebar.style.width = isSidebarOpen ? "800px" : "0";
}

function openSidebar() {
  if (!isSidebarOpen) {
    const sidebar = document.getElementById("shoppingCartSidebar");
    sidebar.style.width = "800px";
    sidebar.classList.add("active");
    document.body.classList.add("no-scroll");
    isSidebarOpen = true;
  }
}

function fetchAndDisplayProducts() {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((products) => {
      const productsContainer = document.getElementById("products");
      products.forEach((product) => {
        const productElement = createProductElement(product);
        productsContainer.appendChild(productElement);
      });
      addOrderButtonListeners();
    })
    .catch((error) => {
      console.error("An error occurred while fetching products:", error);
    });
}

function createProductElement(product) {
  const productElement = document.createElement("div");
  productElement.classList.add("product");

  productElement.innerHTML = `
    <h2>${product.title}</h2>
    <img src="${product.image}" alt="${product.title}">
    <p>Price: ${product.price}</p>
    <p>Category: ${product.category}</p>
    <p>Description: ${product.description}</p>
    <button type="button" class="order-button">Order</button>`;

  return productElement;
}

function addToCart(product) {
  cartData.push(product);
  localStorage.setItem("cart", JSON.stringify(cartData));
  productArray = cartData.slice();
  productDivMaker(product);

  updateTotalSum();
  openSidebar();
}

function addOrderButtonListeners() {
  const productsContainer = document.getElementById("products");
  productsContainer.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("order-button")) {
      const productElement = target.closest(".product");
      const productTitle = productElement.querySelector("h2").textContent;
      const productPrice = productElement
        .querySelector("p")
        .textContent.replace("Price: ", "");
      addToCart(new Product(productCounter++, productTitle, productPrice, 1));
    }
  });
}

function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const postalCode = document.getElementById("postalCode").value.trim();
  const city = document.getElementById("city").value.trim();

  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10,50}$/;
  const addressRegex = /^.{2,50}$/;
  const postalCodeRegex = /^\d{5}$/;
  const cityRegex = /^.{2,50}$/;

  if (!nameRegex.test(name)) {
    alert(
      "Please enter a valid name (2-50 characters, alphabetic characters and spaces only)."
    );
    return false;
  }

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (!phoneRegex.test(phone)) {
    alert("Please enter a valid phone number (10-50 digits).");
    return false;
  }

  if (!addressRegex.test(address)) {
    alert("Please enter a valid address (2-50 characters).");
    return false;
  }

  if (!postalCodeRegex.test(postalCode)) {
    alert("Please enter a valid postal code (exactly 5 digits).");
    return false;
  }

  if (!cityRegex.test(city)) {
    alert("Please enter a valid city (2-50 characters).");
    return false;
  }

  return true;
}

function deleteProduct(productId) {
  const productIndex = cartData.findIndex(
    (product) => product.id === productId
  );
  if (productIndex > -1) {
    cartData.splice(productIndex, 1);
    localStorage.setItem("cart", JSON.stringify(cartData));
    productArray = cartData.slice();
    const productElement = document.getElementById("div-" + productId).remove();
    updateTotalSum();
  }
}

function clearCart() {
  while (ul.firstChild) {
    ul.removeChild(ul.lastChild);
  }
  localStorage.removeItem("cart");
  cartData = [];
  productArray = [];
  updateTotalSum();
}

function submitOrderForm(event) {
  event.preventDefault();
  if (validateForm()) {
    document.getElementById("orderForm").reset();
    document.getElementById("confirmationMessage").style.display = "block";

    setTimeout(function () {
      window.location.href = "index.html";
    }, 5000);
  }
}

window.onload = function () {
  fetchAndDisplayProducts();
  const productName = localStorage.getItem("productName");
  document.getElementById("productLabel").textContent += productName
    ? ` ${productName}`
    : "";
  const orderForm = document.getElementById("orderForm");
  orderForm.addEventListener("submit", submitOrderForm);
};

window.onscroll = function () {
  var slider = document.getElementById("slider");
  if (window.scrollY > 20) {
    slider.classList.add("show");
  } else {
    slider.classList.remove("show");
  }
};

const selectedProduct = localStorage.getItem("selectedProduct");
if (selectedProduct === null) {
  document.getElementById("product").value = "No product selected";
} else {
  document.getElementById("product").value = selectedProduct;
}

function handleSubmit(event) {
  event.preventDefault();
  document.getElementById("confirmationMessage").style.display = "block";
  return false;
}

function redirectToHomePage(url) {
  window.location.href = url;
}

function redirectToOrderPage() {
  if (totalSum > 0) {
    localStorage.setItem("totalPrice", totalSum.toFixed(2));
    window.location.href = "order.html";
  }
}
