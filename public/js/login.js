document.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.getElementById('btn-login');
  const errorMsg = document.getElementById('error-msg');

  btnLogin.addEventListener('click', async () => {
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    btnLogin.disabled = true;
    errorMsg.style.display = 'none';

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('adminToken', data.token);
        window.location.href = 'admin.html';
      } else if (response.status === 401) {
        errorMsg.textContent = "Credenciales inválidas.";
        errorMsg.style.display = 'block';
      } else {
        errorMsg.textContent = "Error de servidor. Intenta nuevamente.";
        errorMsg.style.display = 'block';
      }
    } catch (error) {
      errorMsg.textContent = "Error de servidor. Intenta nuevamente.";
      errorMsg.style.display = 'block';
      console.error(error);
    } finally {
      btnLogin.disabled = false;
    }
  });
});
