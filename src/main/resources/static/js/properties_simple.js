// Estado global de la aplicación
let properties = [];
let editingId = null;

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadProperties();
    setupFormSubmission();
});

// Configurar el envío del formulario
function setupFormSubmission() {
    const form = document.getElementById('propertyForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProperty();
    });
}

// Mostrar el formulario
function showForm() {
    document.getElementById('formSection').classList.remove('hidden');
    document.getElementById('formTitle').textContent = 'Agregar Nueva Propiedad';
    document.getElementById('showFormBtn').style.display = 'none';
    editingId = null;
    clearForm();
}

// Ocultar el formulario
function hideForm() {
    document.getElementById('formSection').classList.add('hidden');
    document.getElementById('showFormBtn').style.display = 'inline-block';
    editingId = null;
    clearForm();
}

// Limpiar el formulario
function clearForm() {
    document.getElementById('propertyForm').reset();
}

// Cargar todas las propiedades
async function loadProperties() {
    try {
        showLoading();
        const response = await fetch('/api/properties');
        
        if (response.ok) {
            properties = await response.json();
            renderProperties();
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

// Renderizar la tabla de propiedades
function renderProperties() {
    const tableBody = document.getElementById('propertiesTableBody');
    const table = document.getElementById('propertiesTable');
    const emptyState = document.getElementById('emptyState');
    
    if (properties.length === 0) {
        table.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    table.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    tableBody.innerHTML = '';
    
    properties.forEach(property => {
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
}

// Formatear números con separadores de miles
function formatNumber(number) {
    return new Intl.NumberFormat('es-CO').format(number);
}

// Guardar propiedad (crear o actualizar)
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
            // Actualizar propiedad existente
            response = await fetch(`/api/properties/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(propertyData)
            });
        } else {
            // Crear nueva propiedad
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

// Editar propiedad
function editProperty(id) {
    const property = properties.find(p => p.id === id);
    if (!property) return;
    
    // Llenar el formulario con los datos de la propiedad
    document.getElementById('address').value = property.address;
    document.getElementById('price').value = property.price;
    document.getElementById('size').value = property.size;
    document.getElementById('description').value = property.description || '';
    document.getElementById('ownerName').value = property.ownerName || '';
    
    // Configurar el formulario para edición
    editingId = id;
    document.getElementById('formTitle').textContent = 'Editar Propiedad';
    document.getElementById('formSection').classList.remove('hidden');
    document.getElementById('showFormBtn').style.display = 'none';
}

// Mostrar modal de confirmación de eliminación
function showDeleteModal(id) {
    editingId = id;
    document.getElementById('deleteModal').classList.remove('hidden');
}

// Cerrar modal de eliminación
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
    editingId = null;
}

// Confirmar eliminación
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

// Mostrar estado de carga
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('propertiesTable').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
}

// Ocultar estado de carga
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}