document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id || isNaN(parseInt(id))) {
    window.location.href = 'index.html';
    return;
  }

  const errorMsg = document.getElementById('error-msg');
  const content = document.getElementById('dino-content');

  try {
    const response = await fetch(`/api/dinos/${id}`);
    
    if (response.status === 404) {
      errorMsg.textContent = "Dinosaurio no encontrado.";
      errorMsg.style.display = 'block';
      return;
    }
    
    if (!response.ok) {
      throw new Error("Error del servidor");
    }

    const dino = await response.json();

    document.getElementById('dino-nombre').textContent = dino.nombre;
    document.getElementById('dino-dieta').textContent = dino.dieta || 'Desconocida';
    document.getElementById('dino-tamanio').textContent = dino.tamanio || 'Desconocido';
    document.getElementById('dino-peso').textContent = dino.peso || 'Desconocido';
    document.getElementById('dino-ubicacion').textContent = dino.ubicacion || 'Desconocida';
    document.getElementById('dino-descripcion').textContent = dino.descripcion || 'Sin descripción disponible.';
    
    const img = document.getElementById('dino-imagen');
    img.src = dino.imagen_url || 'https://via.placeholder.com/600x400?text=Sin+Imagen';
    img.alt = dino.nombre;

    content.style.display = 'flex';
  } catch (error) {
    errorMsg.textContent = "Error al conectar con el servidor.";
    errorMsg.style.display = 'block';
    console.error(error);
  }
});
