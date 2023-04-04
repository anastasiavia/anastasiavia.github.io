const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('id');
var price = 0;
// Make a GET request to the server to get the drug details
fetch(`http://127.0.0.1:5000/item/${itemId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then(response => response.json())
  .then(data => {
    // Populate the HTML elements with the drug details
    //   document.getElementById('item-name').innerHTML = data.Name;
    document.getElementById('item-title').innerHTML = data.name;
    document.getElementById('item-description').innerHTML = data.description;
    document.getElementById('item-price').innerHTML = `$${data.price}`;
    price = data.price;
    document.getElementById('item-image').src = data.image;
    //   document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    //     // Implement your add-to-cart logic here
    //   });
  })
  .catch(error => {
    console.error('Error:', error);
  });

function displayOrderForm() {
  // document.getElementById('item-price').innerHTML = `$${price}`;
  window.location.href = `order.html?id=${itemId}&price=${price}`;
} 