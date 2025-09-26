let properties = [];
let filteredProperties = [];
let editingId = null;

let currentPage = 1;
let propertiesPerPage = 5;

document.addEventListener('DOMContentLoaded', function() {
    loadProperties();
    setupFormSubmission();
});

function setupFormSubmission() {
    const form = document.getElementById('propertyForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProperty();
    });
}

function showForm() {
    document.getElementById('formSection').classList.remove('hidden');
    document.getElementById('formTitle').textContent = 'Agregar Nueva Propiedad';
    document.getElementById('showFormBtn').style.display = 'none';
    editingId = null;
    clearForm();
}

function hideForm() {
    document.getElementById('formSection').classList.add('hidden');
    document.getElementById('showFormBtn').style.display = 'inline-block';
    editingId = null;
    clearForm();
}

function clearForm() {
    document.getElementById('propertyForm').reset();
}

async function loadProperties() {
    try {
        showLoading();
        const response = await fetch('/api/properties');
        
        if (response.ok) {
            properties = await response.json();
            filteredProperties = [...properties];
            currentPage = 1;
            renderProperties();
            showNotification('Propiedades cargadas exitosamente', 'success');
        } else {
            showNotification('Error al cargar las propiedades', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

function renderProperties() {
    const tableBody = document.getElementById('propertiesTableBody');
    const table = document.getElementById('propertiesTable');
    const emptyState = document.getElementById('emptyState');
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (filteredProperties.length === 0) {
        table.classList.add('hidden');
        paginationContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        emptyState.textContent = properties.length === 0 ? 'No hay propiedades registradas' : 'No se encontraron propiedades con los filtros aplicados';
        return;
    }
    
    table.classList.remove('hidden');
    paginationContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const currentProperties = filteredProperties.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    currentProperties.forEach(property => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${property.address}</td>
            <td>$${formatNumber(property.price)}</td>
            <td>${property.size} m²</td>
            <td>${property.ownerName || 'N/A'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProperty(${property.id})">
                    Editar
                </button>
                <button class="action-btn delete-btn" onclick="showDeleteModal(${property.id})">
                    Eliminar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    updatePagination();
}

function formatNumber(number) {
    return new Intl.NumberFormat('es-CO').format(number);
}

async function saveProperty() {
    const formData = new FormData(document.getElementById('propertyForm'));
    
    const propertyData = {
        address: formData.get('address'),
        price: parseFloat(formData.get('price')),
        size: parseFloat(formData.get('size')),
        description: formData.get('description'),
        ownerName: formData.get('ownerName')
    };
    
    try {
        let response;
        
        if (editingId) {
            response = await fetch(`/api/properties/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(propertyData)
            });
        } else {
            response = await fetch('/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(propertyData)
            });
        }
        
        if (response.ok) {
            hideForm();
            loadProperties();
            showNotification(
                editingId ? 'Propiedad actualizada exitosamente' : 'Propiedad creada exitosamente', 
                'success'
            );
        } else {
            showNotification('Error al guardar la propiedad', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
}

function editProperty(id) {
    const property = properties.find(p => p.id === id);
    if (!property) return;
    
    document.getElementById('address').value = property.address;
    document.getElementById('price').value = property.price;
    document.getElementById('size').value = property.size;
    document.getElementById('description').value = property.description || '';
    document.getElementById('ownerName').value = property.ownerName || '';
    
    editingId = id;
    document.getElementById('formTitle').textContent = 'Editar Propiedad';
    document.getElementById('formSection').classList.remove('hidden');
    document.getElementById('showFormBtn').style.display = 'none';
}

function showDeleteModal(id) {
    editingId = id;
    document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
    editingId = null;
}

async function confirmDelete() {
    if (!editingId) return;
    
    try {
        const response = await fetch(`/api/properties/${editingId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            closeDeleteModal();
            loadProperties();
            showNotification('Propiedad eliminada exitosamente', 'success');
        } else {
            showNotification('Error al eliminar la propiedad', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('propertiesTable').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}


function filterProperties() {
    const searchAddress = document.getElementById('searchAddress').value.toLowerCase();
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const minSize = parseFloat(document.getElementById('minSize').value) || 0;
    
    filteredProperties = properties.filter(property => {
        const addressMatch = property.address.toLowerCase().includes(searchAddress);
        const priceMatch = property.price >= minPrice && property.price <= maxPrice;
        const sizeMatch = property.size >= minSize;
        
        return addressMatch && priceMatch && sizeMatch;
    });
    
    currentPage = 1; 
    renderProperties();
}

function clearFilters() {
    document.getElementById('searchAddress').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('minSize').value = '';
    
    filteredProperties = [...properties];
    currentPage = 1;
    renderProperties();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
    const paginationInfo = document.getElementById('paginationInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageNumbers = document.getElementById('pageNumbers');
    
    const startItem = (currentPage - 1) * propertiesPerPage + 1;
    const endItem = Math.min(currentPage * propertiesPerPage, filteredProperties.length);
    paginationInfo.textContent = `Mostrando ${startItem}-${endItem} de ${filteredProperties.length} propiedades`;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages <= 7 || i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageBtn = document.createElement('span');
            pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => goToPage(i);
            pageNumbers.appendChild(pageBtn);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.className = 'page-number';
            dots.style.cursor = 'default';
            pageNumbers.appendChild(dots);
        }
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderProperties();
    }
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderProperties();
    }
}