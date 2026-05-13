document.addEventListener('layoutReady', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id || isNaN(parseInt(id))) {
    window.location.href = 'index.html';
    return;
  }

  const errorMsg = document.getElementById('error-msg');
  const content = document.getElementById('dino-content');

  // Fetch specific dino details
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
    
    // Setup intro text
    let intro = dino.descripcion || "Sin información disponible.";
    document.getElementById('dino-intro').textContent = intro.length > 200 ? intro.substring(0, 200) + '...' : intro;
    
    // Setup classification
    document.getElementById('dino-clasificacion').textContent = `${dino.nombre} es un dinosaurio que habitaba en regiones de ${dino.ubicacion || 'origen desconocido'}.`;
    
    document.getElementById('dino-descripcion').textContent = dino.descripcion || 'Sin descripción disponible.';
    
    // Setup infobox
    document.getElementById('dino-nombre-cientifico').textContent = dino.nombre;
    document.getElementById('dino-periodo').textContent = dino.periodo || 'Desconocido';
    document.getElementById('dino-dieta').textContent = dino.dieta || 'Desconocida';
    document.getElementById('dino-tamanio').textContent = dino.tamanio || 'Desconocido';
    document.getElementById('dino-peso').textContent = dino.peso || 'Desconocido';
    document.getElementById('dino-ubicacion').textContent = dino.ubicacion || 'Desconocida';
    
    const img = document.getElementById('dino-imagen');
    img.src = dino.imagen_url || 'https://via.placeholder.com/600x400?text=Sin+Imagen';
    img.alt = dino.nombre;

    content.style.display = 'block';
  } catch (error) {
    errorMsg.textContent = "Error al conectar con el servidor.";
    errorMsg.style.display = 'block';
    console.error(error);
  }
});
