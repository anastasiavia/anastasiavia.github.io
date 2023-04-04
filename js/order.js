// Get references to the form and its elements
const urlParams = new URLSearchParams(window.location.search);
const form = document.querySelector('form');
const addressInput = document.querySelector('#address');
const quantityInput = document.querySelector('#quantity');
const messageInput = document.querySelector('#message');
const price = urlParams.get('price');
document.getElementById('item-price').innerHTML = price;
const itemId = urlParams.get('id');

function handleInputQuantityChange(input) {
  const quantity = input.value;
  document.getElementById('item-price').innerHTML = price * quantity;
}

async function getUserID(username) {
  let id_user;
  const response = await fetch(`http://localhost:5000/user/${username}`);
  const data = await response.json();
  id_user = data.iduser;
  return id_user;
}

// Add an event listener to the form's submit button
form.addEventListener('submit', async event => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Create an object to represent the form data
  const username = localStorage.getItem('username');
  let id_user;
  let formData;
  
  try {
    id_user = await getUserID(username);
    formData = {
      quantity: quantityInput.value,
      address: addressInput.value,
      cost: price * quantityInput.value,
      message: messageInput.value,
      item_id: itemId,
      user_id: id_user
    };
  }
  catch (error) {
    swal.fire({
      icon: 'error',
      title: 'You are not logged in!',
      text: 'Please, log in or sign up!',
      confirmButtonColor: '#FFC0CB'
    });
  }

  const token = localStorage.getItem('token');
  // Make a POST request to your server with the form data
  fetch('http://localhost:5000/store/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      // Handle the response from the server
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Display the order ID to the user
      const orderId = data.orderId;
      // alert(`Your order has been submitted with ID ${orderId}`);
      swal.fire({
        icon: 'success',
        title: 'Thank you!',
        text: `Your order has been submitted with ID ${orderId}`,
        confirmButtonColor: '#FFC0CB'
      });

    })
    .catch(error => {
      // Handle errors that occur during the request
      console.error('Error creating order:', error.message);
      // add error message

    });
});
