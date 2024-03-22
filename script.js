const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
  updateCartModal();
});

//Fechar o modal
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");
  // console.log(parentButton)

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
  }
});

// Adicionar carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

//Colocar valores do carrinho
function updateCartModal() {
  cartItemContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElemnet = document.createElement("div");
    cartItemElemnet.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElemnet.innerHTML = `
        <div class="flex items-center justify-between">
        <div>
        <p class="font-medium">${item.name}</P>
        <p>Quantidade: ${item.quantity}</P>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</P>
        </div>

        <div>
        <button  class="remove-btn"  data-name="${item.name}">
         Remover
         </button>
        </div>
        </div> `;

    total += item.price * item.quantity;

    cartItemContainer.appendChild(cartItemElemnet);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  //Adicionar no carrinho quantidade

  cartCounter.innerHTML = cart.length;
}

//Remover item do carrinho

cartItemContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

// Endereço

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("boder-red-500");
    addressWarn.classList.add("hidden");
  }
});

//Finalizar pedido

checkoutBtn.addEventListener("click", function () {
  //verificaçao estabelicimento aberto
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, a padaria está fechada!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "left", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#FDE047",
      },
    }).showToast();
    return;
  }
  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("boder-red-500");
    return;
  }

  //Enviar pedido api whats
  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`;
    })
    .join("");
  const message = encodeURIComponent(cartItems);
  const phone = "11944540951";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value} `,
    "_blank"
  );

  cart = [];
  updateCartModal();
});

//Verificaçao horario

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 6 && hora < 21;
  //true = aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-yellow-300");
} else {
  spanItem.classList.remove("bg-yellow-300");
  spanItem.classList.add("bg-red-500");
}
