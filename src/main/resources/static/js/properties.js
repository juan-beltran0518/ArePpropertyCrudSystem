// Sistema de Validaciones del Cliente
class PropertyValidator {
    constructor() {
        this.validationRules = {
            address: {
                required: true,
                minLength: 5,
                message: 'La dirección es obligatoria y debe tener al menos 5 caracteres'
            },
            price: {
                required: true,
                type: 'number',
                min: 0.01,
                pattern: /^\d+(\.\d{1,2})?$/,
                message: 'El precio es obligatorio y debe ser un número positivo con máximo 2 decimales'
            },
            size: {
                required: true,
                type: 'number',
                min: 1,
                pattern: /^\d+(\.\d{1,2})?$/,
                message: 'El área es obligatoria y debe ser un número positivo en m²'
            }
        };
        this.initValidation();
    }

    // Inicializar validaciones en tiempo real
    initValidation() {
        const fields = ['address', 'price', 'size'];
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                // Validar mientras escribe (con pequeño delay)
                field.addEventListener('input', (e) => {
                    this.debounce(() => this.validateField(fieldName), 300)();
                });
                
                // Validar al perder el foco
                field.addEventListener('blur', () => {
                    this.validateField(fieldName);
                });

                // Limpiar errores al comenzar a escribir
                field.addEventListener('focus', () => {
                    this.clearError(fieldName);
                });
            }
        });
    }

    // Función debounce para evitar validaciones excesivas
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Validar campo individual
    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];

        // Limpiar errores previos
        this.clearError(fieldName);

        // Validar campo requerido
        if (rules.required && !value) {
            this.showError(fieldName, `${this.getFieldLabel(fieldName)} es obligatorio`);
            return false;
        }

        // Si el campo está vacío y no es requerido, no validar más
        if (!value && !rules.required) {
            return true;
        }

        // Validaciones específicas por tipo de campo
        switch (fieldName) {
            case 'address':
                return this.validateAddress(value);
            case 'price':
                return this.validatePrice(value);
            case 'size':
                return this.validateSize(value);
            default:
                return true;
        }
    }

    // Validar dirección
    validateAddress(address) {
        if (address.length < 5) {
            this.showError('address', 'La dirección debe tener al menos 5 caracteres');
            return false;
        }
        
        // Validar que contenga al menos algunos caracteres alfanuméricos
        if (!/[a-zA-Z0-9]/.test(address)) {
            this.showError('address', 'La dirección debe contener caracteres válidos');
            return false;
        }

        return true;
    }

    // Validar precio
    validatePrice(price) {
        const numericPrice = parseFloat(price);

        // Verificar que sea un número válido
        if (isNaN(numericPrice)) {
            this.showError('price', 'El precio debe ser un número válido');
            return false;
        }

        // Verificar que sea positivo
        if (numericPrice <= 0) {
            this.showError('price', 'El precio debe ser mayor a cero');
            return false;
        }

        // Verificar formato de decimales (máximo 2 decimales)
        if (!/^\d+(\.\d{1,2})?$/.test(price)) {
            this.showError('price', 'El precio puede tener máximo 2 decimales');
            return false;
        }

        // Verificar rango razonable (opcional, ajustar según necesidades)
        if (numericPrice > 999999999.99) {
            this.showError('price', 'El precio excede el valor máximo permitido');
            return false;
        }

        return true;
    }

    // Validar tamaño/área
    validateSize(size) {
        const numericSize = parseFloat(size);

        // Verificar que sea un número válido
        if (isNaN(numericSize)) {
            this.showError('size', 'El área debe ser un número válido');
            return false;
        }

        // Verificar que sea positivo
        if (numericSize <= 0) {
            this.showError('size', 'El área debe ser mayor a cero m²');
            return false;
        }

        // Verificar formato de decimales (máximo 2 decimales)
        if (!/^\d+(\.\d{1,2})?$/.test(size)) {
            this.showError('size', 'El área puede tener máximo 2 decimales');
            return false;
        }

        // Verificar rango razonable para área en m²
        if (numericSize > 999999.99) {
            this.showError('size', 'El área excede el valor máximo permitido');
            return false;
        }

        if (numericSize < 1) {
            this.showError('size', 'El área debe ser de al menos 1 m²');
            return false;
        }

        return true;
    }

    // Mostrar mensaje de error
    showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const fieldElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (fieldElement) {
            fieldElement.classList.add('error');
        }
    }

    // Limpiar mensaje de error
    clearError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const fieldElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        if (fieldElement) {
            fieldElement.classList.remove('error');
        }
    }

    // Obtener etiqueta del campo para mensajes
    getFieldLabel(fieldName) {
        const labels = {
            address: 'La dirección',
            price: 'El precio',
            size: 'El área'
        };
        return labels[fieldName] || 'El campo';
    }

    // Validar todo el formulario
    validateForm() {
        let isValid = true;
        const fields = ['address', 'price', 'size'];
        
        fields.forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Formatear valores antes de enviar
    formatFormData() {
        const price = document.getElementById('price').value;
        const size = document.getElementById('size').value;
        
        return {
            address: document.getElementById('address').value.trim(),
            price: parseFloat(price),
            size: parseFloat(size),
            description: document.getElementById('description').value.trim()
        };
    }
}

// Sistema de Gestión de Propiedades
class PropertyManager {
    constructor() {
        this.validator = new PropertyValidator();
        this.currentView = 'table';
        this.editingPropertyId = null;
        this.initEventListeners();
        this.loadProperties();
    }

    // Inicializar event listeners
    initEventListeners() {
        const form = document.getElementById('propertyForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Event listener para búsqueda
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProperties(e.target.value);
            });
        }
    }

    // Manejar envío del formulario
    handleFormSubmit() {
        // Validar formulario antes de enviar
        if (!this.validator.validateForm()) {
            this.showToast('Por favor, corrige los errores en el formulario', 'error');
            return;
        }

        // Obtener datos formateados
        const formData = this.validator.formatFormData();
        
        if (this.editingPropertyId) {
            this.updateProperty(this.editingPropertyId, formData);
        } else {
            this.createProperty(formData);
        }
    }

    // Crear nueva propiedad
    async createProperty(propertyData) {
        try {
            const response = await fetch('/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData)
            });

            if (response.ok) {
                const newProperty = await response.json();
                this.showToast('Propiedad creada exitosamente', 'success');
                this.hideForm();
                this.loadProperties();
            } else {
                const errorData = await response.json();
                this.showToast(`Error: ${errorData.message || 'No se pudo crear la propiedad'}`, 'error');
            }
        } catch (error) {
            console.error('Error creating property:', error);
            this.showToast('Error de conexión. Intenta nuevamente.', 'error');
        }
    }

    // Actualizar propiedad existente
    async updateProperty(id, propertyData) {
        try {
            const response = await fetch(`/api/properties/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData)
            });

            if (response.ok) {
                this.showToast('Propiedad actualizada exitosamente', 'success');
                this.hideForm();
                this.loadProperties();
            } else {
                const errorData = await response.json();
                this.showToast(`Error: ${errorData.message || 'No se pudo actualizar la propiedad'}`, 'error');
            }
        } catch (error) {
            console.error('Error updating property:', error);
            this.showToast('Error de conexión. Intenta nuevamente.', 'error');
        }
    }

    // Cargar propiedades
    async loadProperties() {
        this.showLoading();
        
        try {
            const response = await fetch('/api/properties');
            const properties = await response.json();
            
            this.hideLoading();
            
            if (properties.length === 0) {
                this.showEmptyState();
            } else {
                this.hideEmptyState();
                this.renderProperties(properties);
            }
        } catch (error) {
            console.error('Error loading properties:', error);
            this.hideLoading();
            this.showToast('Error al cargar las propiedades', 'error');
        }
    }

    // Mostrar toast de notificación
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    // Mostrar/ocultar estados de carga
    showLoading() {
        document.getElementById('loadingState').style.display = 'block';
        document.getElementById('tableView').style.display = 'none';
        document.getElementById('gridView').style.display = 'none';
        document.getElementById('emptyState').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loadingState').style.display = 'none';
    }

    showEmptyState() {
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('tableView').style.display = 'none';
        document.getElementById('gridView').style.display = 'none';
    }

    hideEmptyState() {
        document.getElementById('emptyState').style.display = 'none';
    }

    // Renderizar propiedades según la vista actual
    renderProperties(properties) {
        if (this.currentView === 'table') {
            this.renderTableView(properties);
        } else {
            this.renderGridView(properties);
        }
    }

    // Renderizar vista de tabla
    renderTableView(properties) {
        document.getElementById('tableView').style.display = 'block';
        document.getElementById('gridView').style.display = 'none';
        
        const tbody = document.getElementById('propertiesTableBody');
        tbody.innerHTML = '';
        
        properties.forEach(property => {
            const row = this.createTableRow(property);
            tbody.appendChild(row);
        });
    }

    // Crear fila de tabla
    createTableRow(property) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="property-address">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.address}
                </div>
            </td>
            <td>
                <div class="property-price">
                    <i class="fas fa-dollar-sign"></i>
                    ${this.formatCurrency(property.price)}
                </div>
            </td>
            <td>
                <div class="property-size">
                    <i class="fas fa-ruler-combined"></i>
                    ${property.size} m²
                </div>
            </td>
            <td>
                <div class="property-description">
                    ${property.description || 'Sin descripción'}
                </div>
            </td>
            <td class="actions-column">
                <div class="action-buttons">
                    <button class="btn btn-sm btn-info" onclick="propertyManager.viewProperty(${property.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="propertyManager.editProperty(${property.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="propertyManager.confirmDeleteProperty(${property.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        return row;
    }

    // Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Mostrar/ocultar formulario
    hideForm() {
        document.getElementById('formSection').style.display = 'none';
        this.resetForm();
    }

    // Resetear formulario
    resetForm() {
        const form = document.getElementById('propertyForm');
        form.reset();
        this.editingPropertyId = null;
        
        // Limpiar todos los errores
        ['address', 'price', 'size'].forEach(field => {
            this.validator.clearError(field);
        });
        
        // Resetear título del formulario
        document.getElementById('formTitle').innerHTML = `
            <i class="fas fa-plus-circle"></i>
            Agregar Nueva Propiedad
        `;
        
        document.getElementById('submitBtn').innerHTML = `
            <i class="fas fa-save"></i>
            Guardar Propiedad
        `;
    }
}

// Funciones globales para compatibilidad con el HTML
function showAddPropertyForm() {
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('address').focus();
}

function hideForm() {
    if (window.propertyManager) {
        window.propertyManager.hideForm();
    }
}

function setView(view) {
    if (window.propertyManager) {
        window.propertyManager.currentView = view;
        
        // Actualizar botones activos
        document.getElementById('gridViewBtn').classList.toggle('active', view === 'grid');
        document.getElementById('tableViewBtn').classList.toggle('active', view === 'table');
        
        // Recargar propiedades en la nueva vista
        window.propertyManager.loadProperties();
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.propertyManager = new PropertyManager();
    
    // Ocultar formulario inicialmente
    document.getElementById('formSection').style.display = 'none';
});
