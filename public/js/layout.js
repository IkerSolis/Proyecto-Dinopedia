async function loadComponent(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const response = await fetch(url);
        const html = await response.text();
        el.outerHTML = html;
    } catch (e) {
        console.error(`Error loading ${url}:`, e);
    }
}

async function populateSidebarDinos() {
    try {
        const response = await fetch('/api/dinos');
        if (response.ok) {
            const allDinos = await response.json();
            const sidebarList = document.getElementById('sidebar-dinos-list');
            if (sidebarList) {
                sidebarList.innerHTML = '';
                const urlParams = new URLSearchParams(window.location.search);
                const currentId = urlParams.get('id');

                allDinos.forEach(d => {
                    const li = document.createElement('li');
                    if (currentId && d.id == currentId) {
                        li.className = 'active-sidebar-item';
                    }
                    const a = document.createElement('a');
                    a.href = `dino.html?id=${d.id}`;
                    a.innerHTML = `<i class="bi bi-caret-right-fill"></i> ${d.nombre}`;
                    li.appendChild(a);
                    sidebarList.appendChild(li);
                });
            }
        }
    } catch(e) {
        console.error("Error fetching sidebar dinos", e);
    }
}

async function initLayout() {
    await Promise.all([
        loadComponent('header-placeholder', 'components/header.html'),
        loadComponent('sidebar-placeholder', 'components/sidebar.html'),
        loadComponent('footer-placeholder', 'components/footer.html')
    ]);
    
    await populateSidebarDinos();

    // Hide search on login/admin
    if (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('admin.html')) {
        const searchContainer = document.getElementById('global-search-container');
        if (searchContainer) searchContainer.style.visibility = 'hidden';
    }

    document.dispatchEvent(new Event('layoutReady'));
}

document.addEventListener('DOMContentLoaded', initLayout);
