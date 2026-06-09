const params = new URLSearchParams(window.location.search);

const name = params.get("name");
const price = Number(params.get("price"));
const img = params.get("img");

document.getElementById("product-name").innerText = name;
document.getElementById("product-price").innerText = price;
document.getElementById("product-img").src = img;