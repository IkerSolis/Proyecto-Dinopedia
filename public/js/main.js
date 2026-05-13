// --- Módulo: Carga de dinosaurios ---
document.addEventListener('layoutReady', () => {
  const dinosContainer = document.getElementById('dinos-container');
  const errorContainer = document.getElementById('error-container');
  const searchBar = document.getElementById('search-bar');
  let debounceTimeout;

  const renderDinos = (dinos) => {
    if (!dinosContainer) return;
    dinosContainer.innerHTML = '';
    errorContainer.style.display = 'none';

    if (dinos.length === 0) {
      errorContainer.textContent = "No se encontraron dinosaurios con ese nombre.";
      errorContainer.style.display = 'block';
      return;
    }

    dinos.forEach(dino => {
      const card = document.createElement('div');
      card.className = 'card';
      card.addEventListener('click', () => {
        window.location.href = `dino.html?id=${dino.id}`;
      });

      const img = document.createElement('img');
      img.src = dino.imagen_url || 'https://via.placeholder.com/250x200?text=Sin+Imagen';
      img.alt = dino.nombre;

      const content = document.createElement('div');
      content.className = 'card-content';

      const title = document.createElement('h3');
      title.textContent = dino.nombre;

      const diet = document.createElement('p');
      diet.textContent = `Dieta: ${dino.dieta || 'Desconocida'}`;

      content.appendChild(title);
      content.appendChild(diet);
      card.appendChild(img);
      card.appendChild(content);

      dinosContainer.appendChild(card);
    });
  };

  const fetchDinos = async () => {
    try {
      const response = await fetch('/api/dinos');
      if (!response.ok) throw new Error('Error al obtener datos');
      const data = await response.json();
      renderDinos(data);
    } catch (error) {
      if (errorContainer) {
        errorContainer.textContent = "Error al conectar con el servidor.";
        errorContainer.style.display = 'block';
      }
      console.error(error);
    }
  };

  // --- Módulo: Búsqueda ---
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      const term = e.target.value.trim();
      
      clearTimeout(debounceTimeout);
      
      debounceTimeout = setTimeout(async () => {
        if (term.length >= 2) {
          try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
            if (!response.ok) throw new Error('Error en búsqueda');
            const data = await response.json();
            renderDinos(data);
          } catch (error) {
            if (errorContainer) {
              errorContainer.textContent = "Error al buscar dinosaurios.";
              errorContainer.style.display = 'block';
            }
          }
        } else if (term.length === 0) {
          fetchDinos();
        }
      }, 300);
    });
  }

  // Carga inicial
  fetchDinos();
});
