function updateNavbar() {
    const loginUl = document.getElementById('login-ul');
    if (!loginUl) {
        return;
    }
    const access_token = localStorage.getItem('token');

    if (access_token) {
        // show logout button
        loginUl.innerHTML = '<li class="nav-item"><a class="btn btn-link text-muted" onclick="logout()"><i class="bi bi-box-arrow-right"></i></a></li>';
    } else {
        // show login button
        loginUl.innerHTML = '<li class="nav-item" id="login-btn"><a class="nav-link" href="login.html">Login</a></li><li class="nav-item"> <a class="nav-link" href="signup.html">Sign up</a> </li>';
    }
    
}
window.onload = function () {
    updateNavbar();
};


function logout() {
    localStorage.setItem('token', '')
    localStorage.setItem('username', '')
    updateNavbar();
  }

  
  