document.addEventListener('layoutReady', () => {
  const token = localStorage.getItem('adminToken');
  const authNav = document.getElementById('auth-nav');
  
  if (authNav) {
    if (token) {
      authNav.innerHTML = `
        <a href="admin.html" style="color:white; text-decoration:none;"><i class="bi bi-gear-fill"></i> Panel Admin</a>
        <a href="#" id="btn-logout" style="color:white; text-decoration:none; margin-left: 15px;"><i class="bi bi-box-arrow-right"></i> Cerrar sesión</a>
      `;

      document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        window.location.href = 'index.html'; 
      });

      if (window.location.pathname.endsWith('login.html')) {
        window.location.href = 'admin.html';
      }
    } else {
      if (window.location.pathname.endsWith('admin.html')) {
        window.location.href = 'login.html';
      } else {
        authNav.innerHTML = `<a href="login.html" style="color:white; text-decoration:none;"><i class="bi bi-person-fill"></i> Iniciar Sesión</a>`;
      }
    }
  }
});
