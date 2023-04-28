async function signUp(data) {
  try {
    const response = await fetch('http://localhost:5000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (response.ok) {
      localStorage.setItem('username', data.username);
      localStorage.setItem('token', responseData.token);
      window.location.href = "main.html";
    } else {
      throw new Error('Invalid input data');
    }
  } catch (error) {
    console.error('Error creating user:', error.message);
      // add error message
    swal.fire({
      icon: 'error',
      title: 'Error creating user',
      text: error.message
    });
  }
}

const registrForm = document.getElementById('signup-form');
registrForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent default form submission
  const username = document.querySelector('#inputUsername').value;
  const firstname = document.querySelector('#inputName').value;
  const lastname = document.querySelector('#inputSurname').value;
  const email = document.querySelector('#inputEmail').value;
  const password = document.querySelector('#inputPassword').value;
  const phone = document.querySelector('#inputPhone').value;

  const data = {
    username,
    firstname,
    lastname,
    email,
    password,
    phone
  };
  await signUp(data);
});
