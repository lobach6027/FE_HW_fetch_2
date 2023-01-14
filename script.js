const form = document.querySelector(".add-form");
const root = document.querySelector(".container");


function write_local(arrayOfProducts) {
  localStorage.setItem("products", JSON.stringify(arrayOfProducts));
}
function read_local() {
  return JSON.parse(localStorage.getItem("products")) ?? [];
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = e.target.id.value;

  fetch(`https://fakestoreapi.com/products/${id}`)
    .then((resp) => resp.json())
    .then(({ id, title, price, description, category }) => {
      createProductCard(id,title, price, description, category);
      write_local([
        ...read_local(),
        { id, title, price, description, category },
      ]);
      rerender()
    });

  e.target.id.value = "";
  
});

function rerender() {
  root.innerText = "";
  if (read_local().length === 0) {
    const info = document.createElement("p");
    info.innerText = "There are no products selected...";
    root.append(info);
  } else {
    read_local().forEach(({ id, title, price, description, category }) => {
      const newCard = createProductCard( id, title, price, description, category);
     root.append(newCard);
    });
  }
}
rerender();

function deleteCard(id) {
  let arrayOfProducts = read_local().filter((item) => item.id != id);
  write_local(arrayOfProducts);
  rerender();
}

function createProductCard( id, title, price, description, category){
  const productContainer = document.createElement("div");
  const productTitle = document.createElement("p");
  const productPrice = document.createElement("p");
  const productDescription = document.createElement("p");
  const productCategory = document.createElement("p");
  const deleteButton = document.createElement("button");

  productContainer.classList.add("card");
  productTitle.classList.add("product-name");
  deleteButton.classList.add("delete-button");

  productTitle.innerText = title;
  productPrice.innerText = `Product price: ${price}$`;
  productDescription.innerText = `Product descriprion: ${description}`;
  productCategory.innerText = `Product category: ${category}`;
  deleteButton.innerText = "Delete product";

  productContainer.append(
    productTitle,
    productPrice,
    productDescription,
    productCategory,
    deleteButton
  );
  
  deleteButton.addEventListener("click", () => {
    deleteCard(id);
    
  });
  return productContainer;
}
