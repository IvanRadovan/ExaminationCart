class Product {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }
}

let isSidebarOpen = false;
const ul = document.getElementById('ul-cart');
const totalSumElement = document.getElementById("total-sum");
let totalSum = 0;

let productArray = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
localStorage.setItem("cart", JSON.stringify(productArray));
const cartData = JSON.parse(localStorage.getItem("cart"));

const productDivMaker = (productName, productPrice) => {
  // Create the main card div
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card rounded-3 mb-4';

  // Create the card body
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body p-4';
  cardDiv.appendChild(cardBody);

  // Create the row
  const rowDiv = document.createElement('div');
  rowDiv.className = 'row d-flex justify-content-between align-items-center';
  cardBody.appendChild(rowDiv);

  // Product Name Column
  const productNameCol = document.createElement('div');
  productNameCol.className = 'col-md-3 col-lg-3 col-xl-3';
  productNameCol.innerHTML = `<p class="lead fw-normal mb-2">${productName}</p>`;
  rowDiv.appendChild(productNameCol);

  // Quantity Adjuster Column
  const quantityAdjusterCol = document.createElement('div');
  quantityAdjusterCol.className = 'col-md-4 col-lg-4 col-xl-3 d-flex';
  quantityAdjusterCol.innerHTML = `
    <button class="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
      <i class="fas fa-minus"></i>
    </button>
    <input id="form1" min="0" name="quantity" value="${1}" type="number" class="form-control form-control-sm"/>
    <button class="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
      <i class="fas fa-plus"></i>
    </button>`;
  rowDiv.appendChild(quantityAdjusterCol);

  // Price Column
  const priceCol = document.createElement('div');
  priceCol.className = 'col-md-3 col-lg-2 col-xl-2 offset-lg-1';
  priceCol.innerHTML = `<h5 class="mb-0">$${productPrice}</h5>`;
  rowDiv.appendChild(priceCol);

  // Delete Button Column
  const deleteButtonCol = document.createElement('div');
  deleteButtonCol.className = 'col-md-1 col-lg-1 col-xl-1 text-end';
  deleteButtonCol.innerHTML = `<a href="#!" class="text-danger"><i class="fas fa-trash fa-lg"></i></a>`;
  rowDiv.appendChild(deleteButtonCol);

  // Add to the cart
  ul.appendChild(cardDiv);
  cardDiv.removeAttribute("hidden");
  updateTotalSum();
}

cartData.forEach(product => {
  productDivMaker(product.title, product.price);
});
updateTotalSum();

function updateTotalSum() {

  // Calculate the total sum
  productArray.forEach(product => {
    totalSum += parseFloat(product.price);
  });

  // Update the total sum element
  totalSumElement.textContent = `$${totalSum.toFixed(2)}`;
}


function toggleSidebar() {
  const sidebar = document.getElementById("shoppingCartSidebar");
  sidebar.classList.toggle("active");
  document.body.classList.toggle("no-scroll");

  // Update the sidebar state based on the "active" class presence
  isSidebarOpen = sidebar.classList.contains("active");

  // Adjust the width accordingly
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
  // If isSidebarOpen is true, do nothing (sidebar stays open)
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

function addOrderButtonListeners() {
  const productsContainer = document.getElementById("products");
  productsContainer.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("order-button")) {
      // Find the closest product element to the clicked button
      const productElement = target.closest(".product");

      // Extract the product details from the product element
      const productTitle = productElement.querySelector("h2").textContent;
      const productPrice = productElement.querySelector("p").textContent.replace('Price: ', '');

      // Create a new product object with the extracted details
      const product = new Product(productTitle, productPrice);

      // Add the new product object to the cart array
      cartData.push(product);

      // Save the updated cart back to local storage, converting it to a JSON string
      localStorage.setItem("cart", JSON.stringify(cartData));

      // Optionally: provide some feedback or update the UI to reflect the item addition
      //alert("Added to cart: " + productTitle);
      openSidebar();
      productDivMaker(product.title, product.price);
      updateTotalSum();
    }
  });
}


function clearCart() {
  while (ul.firstChild) {
    ul.removeChild(ul.lastChild);
  }
  cartData = [];
  updateTotalSum();
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

function submitOrderForm(event) {
  event.preventDefault();
  if (validateForm()) {
    document.getElementById("orderForm").reset();
    const orderedProduct = localStorage.getItem("selectedProduct");

    document.getElementById("orderedProduct").textContent = orderedProduct;
    document.getElementById("confirmationMessage").style.display = "block";

    setTimeout(function () {
      window.location.href = "index.html";
    }, 3000);
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

  const orderedProduct = document.getElementById("product").value;

  document.getElementById("orderedProduct").textContent = orderedProduct;
  document.getElementById("confirmationMessage").style.display = "block";

  return false;
}

function redirectToHomePage(url) {
  window.location.href = url;
}
