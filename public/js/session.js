document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('adminToken');
  const header = document.querySelector('header');
  
  if (header) {
    let nav = header.querySelector('nav');
    if (!nav) {
      nav = document.createElement('nav');
      header.appendChild(nav);
    }

    if (token) {
      nav.innerHTML = `
        <a href="admin.html">Panel Admin</a>
        <a href="#" id="btn-logout" style="margin-left: 15px;">Cerrar sesión</a>
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
        nav.innerHTML = `<a href="login.html">Admin</a>`;
      }
    }
  }
});
