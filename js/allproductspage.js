
fetch('http://localhost:5000/store/inventory')
  .then(response => response.json())
  .then(data => {
    const inventory = data;
    const productsContainer = document.getElementById('product_list');

    inventory.forEach(item => {
      const productCard = `
        <div class="col-md-4">
          <div class="card mb-4">
            <a href="productpage.html?id=${item.iditem}"><img src="${item.image}" alt="Product Image" class="card-img-top"></a>
            <div class="card-body">
              <h5 class="card-title"><a href="productpage.html?id=${item.iditem}">${item.name}</a></h5>
              <p class="card-text">${item.price}$</p>
              <a href="order.html?id=${item.iditem}&price=${item.price}" class="btn btn-primary">Buy Now</a>
            </div>  
          </div>
        </div>
      `;
      productsContainer.insertAdjacentHTML('beforeend', productCard);
    });
  })
  .catch(error => console.error(error));





