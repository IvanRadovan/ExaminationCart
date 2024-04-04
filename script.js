function toggleSidebar() {
  document.getElementById("shoppingCartSidebar").classList.toggle("active");
  getElementById("body").classList.toggle();
}

function openSidebar() {
  document.getElementById("shoppingCartSidebar").style.width = "800px";
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
      // Find the product title of the clicked item
      const productTitle = target
        .closest(".product")
        .querySelector("h2").textContent;

      // Retrieve the current cart from local storage, parse it into an array
      // If there's no cart, start with an empty array
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Add the new product to the cart array
      cart.push(productTitle);

      // Save the updated cart back to local storage, converting it to a JSON string
      localStorage.setItem("cart", JSON.stringify(cart));

      // Optionally: provide some feedback or update the UI to reflect the item addition
      alert("Added to cart: " + productTitle);
      openSidebar();

      // TODO: Lägg till produkten i kundvagnen genom att skapa elementet

      //--------------------->https://taniarascia.github.io/sandbox/tab/
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
