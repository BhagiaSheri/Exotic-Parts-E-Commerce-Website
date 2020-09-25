// get the category and sub category id from url
let getUrlParams = function (url) {
  let params = {};
  (url + "?")
    .split("?")[1]
    .split("&")
    .forEach(function (pair) {
      pair = (pair + "=").split("=").map(decodeURIComponent);
      if (pair[0].length) {
        params[pair[0]] = pair[1];
      }
    });

  return params;
};

// asynchronous function to get fetch products from JSON
async function getProducts() {
  let products = true;

  // get the id's
  let params = getUrlParams(window.location.href);
  let pid = params.p_id; // product id url

  // fetch the data from local json file
  // ***NOTE: Live Server Extension should be
  // installed for fetching local JSON.
  const response = await fetch("../assets/JSON/exotic-parts.json");

  //convert the response in JSON format
  const categories = await response.json();

  categories.forEach((category) => {
    // get sub categories array from each category
    let sub_categories = category.autoSubPart;
    sub_categories.forEach((sub_cat) => {
      // get product array from each sub category
      let product_categories = sub_cat.products;
      product_categories.forEach((product_detail) => {
        let totalPrice = 0;

        // console.log("subcat: " + sub_cat.c_id);
        if (product_detail.p_id == pid) {
          products = sub_cat.products;
          // console.log(products);
          // set the products information and product specs into the UI
          document.querySelector(".products-container").innerHTML = products
            .map((product) => {
              if (product.p_id == pid) {
                if (product.stock_amount > 0) {
                  product.stock_amount = "In Stock";
                } else {
                  product.stock_amount = "Out Of Stock";
                }

                return `
              <div class = "container">
              <div class="row">
              <div class="col-md-6">
                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                    <ol class="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    </ol>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src=${product.url1} class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item">
                            <img src=${product.url2} class="d-block w-100"
                                alt="...">
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>

            <div class="col-md-6 product-det">
                <p><p><b> <a href="../index.html">Home</a> / <a href="../index.html#${category.id}"> ${category.autoPart}</a> / ${sub_cat.name} / ${product_detail.name}</b></p>
                <hr></p>
                <h1>${product.name}</h1>
                <p>Product Code: ${product.p_id}</p>
                <p>${product.description}</p>
                <h4 class="product-price">Rs: ${product.price}</h4>
                <p><b>Company:</b> Exotic Parts</p>
                <p><b>Warranty:</b> 30 Days</p>
                <p><b>Availability:</b> <span class="badge badge-pill badge-primary">${product.stock_amount}</span></p>

                <div>
                    <label>Quantity:</label>
                    <button class="sub-product">-</button>
                    <input type="number" name="quantity" value="1" disabled class="product-quantity">
                    <button class="add-product">+</button>
                    <button type="button" class="btn btn-default cart add-to-cart">Add to Cart</button>
                </div>

                <p class="wishlist"><a href="#"><b>Add to Wishlist</b></a></p>
                <hr>
            </div>
            </div>
        </div>
        <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <h3 class="title"> Product Specs</h3>
                <hr>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12">
                <p>${product.description}.</p>
            </div>
        </div>
    </div> `;
              }
            })
            .join("");

          // adding add to cart functionality using the product data
          function addToCart() {
            let quantity = 1;
            // get elements
            let subtractProduct = document.querySelector(".sub-product");
            let addProduct = document.querySelector(".add-product");
            let productQuantity = document.querySelector(".product-quantity");
            let addToCart = document.querySelector(".add-to-cart");
            // add totalprice and quantity
            addProduct.onclick = function () {
              totalPrice += product_detail.price;
              quantity++;
              productQuantity.value = quantity;
            };
            // subtract totalprice and quantity
            subtractProduct.onclick = function () {
              if (quantity > 1) {
                totalPrice -= product_detail.price;
                quantity--;
                productQuantity.value = quantity;
              }
            };
            // Save the total price and quantiy from all the products
            addToCart.onclick = function () {
              if (productQuantity.value == 1) {
                totalPrice = product_detail.price; // initialize the Total price when the quantity is 1
              }
              // adding the selected products in local storage
              let productKey = product_detail.p_id; // generating unique key w.r.t to the product id for storing product in local storage

              // getting all selected product details
              let productJson = {
                product_id: product_detail.p_id,
                category_name: category.autoPart,
                product_name: product_detail.name,
                product_description: product_detail.description,
                product_image: product_detail.url1,
                product_quantity: productQuantity.value,
                product_price: totalPrice
              };

              // storing purchased product detail in local storage with totalprice and quantity
              localStorage.setItem(productKey, JSON.stringify(productJson));
            };
          }

          // function call - add products into localStorage
          addToCart();
        }

      });
    });
  });
}
//function calling - get products
getProducts();
