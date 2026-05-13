document.addEventListener('DOMContentLoaded', () => {

  const btnAgregar = document.getElementById('btn-agregar');
  const admMsg = document.getElementById('adm-msg');

  btnAgregar.addEventListener('click', async () => {
    const nombre = document.getElementById('adm-nombre').value.trim();
    
    if (!nombre) {
      admMsg.textContent = "El nombre es requerido.";
      admMsg.style.color = "red";
      return;
    }

    const tamanio = document.getElementById('adm-tamanio').value.trim();
    const peso = document.getElementById('adm-peso').value.trim();
    const dieta = document.getElementById('adm-dieta').value.trim();
    const ubicacion = document.getElementById('adm-ubicacion').value.trim();
    const imagen_url = document.getElementById('adm-imagen-url').value.trim();
    const descripcion = document.getElementById('adm-descripcion').value.trim();

    const token = localStorage.getItem('adminToken');
    btnAgregar.disabled = true;

    try {
      const response = await fetch('/api/dinos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, tamanio, peso, dieta, ubicacion, imagen_url, descripcion })
      });

      if (response.status === 201) {
        admMsg.textContent = "Dinosaurio agregado exitosamente.";
        admMsg.style.color = "green";
        
        // Limpiar campos
        document.getElementById('adm-nombre').value = '';
        document.getElementById('adm-tamanio').value = '';
        document.getElementById('adm-peso').value = '';
        document.getElementById('adm-dieta').value = '';
        document.getElementById('adm-ubicacion').value = '';
        document.getElementById('adm-imagen-url').value = '';
        document.getElementById('adm-descripcion').value = '';
      } else if (response.status === 401 || response.status === 403) {
        admMsg.textContent = "Sesión expirada.";
        admMsg.style.color = "red";
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
      } else {
        admMsg.textContent = "Error al agregar. Intenta nuevamente.";
        admMsg.style.color = "red";
      }
    } catch (error) {
      admMsg.textContent = "Error al agregar. Intenta nuevamente.";
      admMsg.style.color = "red";
      console.error(error);
    } finally {
      btnAgregar.disabled = false;
    }
  });
});
