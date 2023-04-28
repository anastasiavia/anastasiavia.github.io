async function logIn(username, password) {
  try {
    const response = await fetch('http://localhost:5000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const responseData = await response.json();

    if (response.ok) {
      localStorage.setItem('username', username);
      localStorage.setItem('token', responseData.token);
      window.location.href = "main.html";
    } else {
      throw new Error('Invalid username or password');
    }
  } catch (error) {
    console.error(error);
    swal.fire({
      icon: 'error',
      title: error.message,
      confirmButtonColor: '#FFC0CB'
    });
  }
}

const loginForm = document.getElementById('signin-form');
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent default form submission
  const username = document.querySelector('#inputUsername').value;
  const password = document.querySelector('#inputPassword').value;
  await logIn(username, password);
});