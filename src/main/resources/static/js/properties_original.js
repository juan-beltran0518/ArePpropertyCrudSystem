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
            },
            ownerName: {
                required: true,
                minLength: 2,
                maxLength: 200,
                pattern: /^[A-Za-zÀ-ÿñÑ\s]+$/,
                message: 'El nombre del propietario es obligatorio y debe contener solo letras (2-200 caracteres)'
            },
            ownerPhone: {
                required: false,
                maxLength: 20,
                pattern: /^[+]?[0-9\s\-()]+$/,
                message: 'El teléfono debe contener solo números, espacios, guiones, paréntesis y el signo +'
            },
            ownerEmail: {
                required: false,
                maxLength: 100,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'El email debe tener un formato válido'
            },
            ownerDocument: {
                required: false,
                maxLength: 50,
                pattern: /^[A-Za-z0-9\-.\s]*$/,
                message: 'El documento debe contener solo letras, números, guiones, puntos y espacios'
            }
        };
        this.initValidation();
    }

    // Inicializar validaciones en tiempo real
    initValidation() {
        const fields = ['address', 'price', 'size', 'ownerName', 'ownerPhone', 'ownerEmail', 'ownerDocument'];
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
            case 'ownerName':
                return this.validateOwnerName(value);
            case 'ownerPhone':
                return this.validateOwnerPhone(value);
            case 'ownerEmail':
                return this.validateOwnerEmail(value);
            case 'ownerDocument':
                return this.validateOwnerDocument(value);
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

    // Validar nombre del propietario
    validateOwnerName(name) {
        const rules = this.validationRules.ownerName;
        
        // Verificar longitud mínima
        if (name.length < rules.minLength) {
            this.showError('ownerName', `El nombre debe tener al menos ${rules.minLength} caracteres`);
            return false;
        }

        // Verificar longitud máxima
        if (name.length > rules.maxLength) {
            this.showError('ownerName', `El nombre no puede exceder ${rules.maxLength} caracteres`);
            return false;
        }

        // Verificar patrón (solo letras y espacios, incluye acentos)
        if (!rules.pattern.test(name)) {
            this.showError('ownerName', 'El nombre debe contener solo letras y espacios');
            return false;
        }

        return true;
    }

    // Validar teléfono del propietario
    validateOwnerPhone(phone) {
        if (!phone) return true; // Campo opcional
        
        const rules = this.validationRules.ownerPhone;

        // Verificar longitud máxima
        if (phone.length > rules.maxLength) {
            this.showError('ownerPhone', `El teléfono no puede exceder ${rules.maxLength} caracteres`);
            return false;
        }

        // Verificar patrón
        if (!rules.pattern.test(phone)) {
            this.showError('ownerPhone', rules.message);
            return false;
        }

        return true;
    }

    // Validar email del propietario
    validateOwnerEmail(email) {
        if (!email) return true; // Campo opcional
        
        const rules = this.validationRules.ownerEmail;

        // Verificar longitud máxima
        if (email.length > rules.maxLength) {
            this.showError('ownerEmail', `El email no puede exceder ${rules.maxLength} caracteres`);
            return false;
        }

        // Verificar patrón de email
        if (!rules.pattern.test(email)) {
            this.showError('ownerEmail', rules.message);
            return false;
        }

        return true;
    }

    // Validar documento del propietario
    validateOwnerDocument(document) {
        if (!document) return true; // Campo opcional
        
        const rules = this.validationRules.ownerDocument;

        // Verificar longitud máxima
        if (document.length > rules.maxLength) {
            this.showError('ownerDocument', `El documento no puede exceder ${rules.maxLength} caracteres`);
            return false;
        }

        // Verificar patrón
        if (!rules.pattern.test(document)) {
            this.showError('ownerDocument', rules.message);
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
            size: 'El área',
            ownerName: 'El nombre del propietario',
            ownerPhone: 'El teléfono',
            ownerEmail: 'El email',
            ownerDocument: 'El documento'
        };
        return labels[fieldName] || 'El campo';
    }

    // Validar todo el formulario
    validateForm() {
        let isValid = true;
        const fields = ['address', 'price', 'size', 'ownerName', 'ownerPhone', 'ownerEmail', 'ownerDocument'];
        
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
            description: document.getElementById('description').value.trim(),
            ownerName: document.getElementById('ownerName').value.trim(),
            ownerPhone: document.getElementById('ownerPhone').value.trim(),
            ownerEmail: document.getElementById('ownerEmail').value.trim(),
            ownerDocument: document.getElementById('ownerDocument').value.trim()
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
                <div class="owner-info">
                    <div class="owner-name">
                        <i class="fas fa-user"></i>
                        ${property.ownerName || 'No especificado'}
                    </div>
                </div>
            </td>
            <td>
                <div class="contact-info">
                    ${property.ownerPhone ? `
                        <div class="owner-phone">
                            <i class="fas fa-phone"></i>
                            ${property.ownerPhone}
                        </div>
                    ` : ''}
                    ${property.ownerEmail ? `
                        <div class="owner-email">
                            <i class="fas fa-envelope"></i>
                            ${property.ownerEmail}
                        </div>
                    ` : ''}
                    ${!property.ownerPhone && !property.ownerEmail ? 'No especificado' : ''}
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

    // Renderizar vista de grid
    renderGridView(properties) {
        document.getElementById('tableView').style.display = 'none';
        document.getElementById('gridView').style.display = 'block';
        
        const gridContainer = document.getElementById('propertiesGrid');
        gridContainer.innerHTML = '';
        
        properties.forEach(property => {
            const card = this.createPropertyCard(property);
            gridContainer.appendChild(card);
        });
    }

    // Crear tarjeta de propiedad para vista de grid
    createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="property-address">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.address}
                </div>
            </div>
            <div class="card-body">
                <div class="property-details">
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span class="detail-label">Precio:</span>
                        <span class="detail-value">${this.formatCurrency(property.price)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-ruler-combined"></i>
                        <span class="detail-label">Área:</span>
                        <span class="detail-value">${property.size} m²</span>
                    </div>
                    ${property.ownerName ? `
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <span class="detail-label">Propietario:</span>
                        <span class="detail-value">${property.ownerName}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="property-description">
                    <p>${property.description || 'Sin descripción'}</p>
                </div>
                ${(property.ownerPhone || property.ownerEmail) ? `
                <div class="owner-contact">
                    <h4><i class="fas fa-address-book"></i> Contacto</h4>
                    ${property.ownerPhone ? `<p><i class="fas fa-phone"></i> ${property.ownerPhone}</p>` : ''}
                    ${property.ownerEmail ? `<p><i class="fas fa-envelope"></i> ${property.ownerEmail}</p>` : ''}
                </div>
                ` : ''}
            </div>
            <div class="card-footer">
                <div class="action-buttons">
                    <button class="btn btn-sm btn-info" onclick="propertyManager.viewProperty(${property.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="propertyManager.editProperty(${property.id})" title="Editar">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="propertyManager.confirmDeleteProperty(${property.id})" title="Eliminar">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        return card;
    }

    // Ver detalles de una propiedad
    async viewProperty(id) {
        try {
            const response = await fetch(`/api/properties/${id}`);
            if (response.ok) {
                const property = await response.json();
                this.showPropertyDetails(property);
            } else {
                this.showToast('Error al cargar los detalles de la propiedad', 'error');
            }
        } catch (error) {
            console.error('Error viewing property:', error);
            this.showToast('Error de conexión al cargar detalles', 'error');
        }
    }

    // Mostrar detalles de propiedad en modal
    showPropertyDetails(property) {
        const modalBody = document.getElementById('detailsModalBody');
        modalBody.innerHTML = `
            <div class="property-details-modal">
                <div class="detail-section">
                    <h3><i class="fas fa-map-marker-alt"></i> Dirección</h3>
                    <p>${property.address}</p>
                </div>
                <div class="detail-section">
                    <h3><i class="fas fa-dollar-sign"></i> Precio</h3>
                    <p class="price-display">${this.formatCurrency(property.price)}</p>
                </div>
                <div class="detail-section">
                    <h3><i class="fas fa-ruler-combined"></i> Área</h3>
                    <p>${property.size} m²</p>
                </div>
                ${property.ownerName ? `
                <div class="detail-section">
                    <h3><i class="fas fa-user"></i> Información del Propietario</h3>
                    <div class="owner-details">
                        <div class="owner-item">
                            <span class="owner-label">Nombre:</span>
                            <span class="owner-value">${property.ownerName}</span>
                        </div>
                        ${property.ownerDocument ? `
                        <div class="owner-item">
                            <span class="owner-label">Documento:</span>
                            <span class="owner-value">${property.ownerDocument}</span>
                        </div>
                        ` : ''}
                        ${property.ownerPhone ? `
                        <div class="owner-item">
                            <span class="owner-label">Teléfono:</span>
                            <span class="owner-value">${property.ownerPhone}</span>
                        </div>
                        ` : ''}
                        ${property.ownerEmail ? `
                        <div class="owner-item">
                            <span class="owner-label">Email:</span>
                            <span class="owner-value">${property.ownerEmail}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}
                <div class="detail-section">
                    <h3><i class="fas fa-align-left"></i> Descripción</h3>
                    <p>${property.description || 'Sin descripción proporcionada'}</p>
                </div>
                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> Información adicional</h3>
                    <div class="additional-info">
                        <div class="info-item">
                            <span class="info-label">ID:</span>
                            <span class="info-value">${property.id}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Precio por m²:</span>
                            <span class="info-value">${this.formatCurrency(property.price / property.size)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('detailsModal');
    }

    // Editar propiedad
    async editProperty(id) {
        try {
            const response = await fetch(`/api/properties/${id}`);
            if (response.ok) {
                const property = await response.json();
                this.populateFormForEdit(property);
            } else {
                this.showToast('Error al cargar los datos de la propiedad', 'error');
            }
        } catch (error) {
            console.error('Error loading property for edit:', error);
            this.showToast('Error de conexión al cargar datos para editar', 'error');
        }
    }

    // Poblar formulario para editar
    populateFormForEdit(property) {
        this.editingPropertyId = property.id;
        
        // Llenar campos del formulario
        document.getElementById('address').value = property.address;
        document.getElementById('price').value = property.price;
        document.getElementById('size').value = property.size;
        document.getElementById('description').value = property.description || '';
        
        // Llenar campos del propietario
        document.getElementById('ownerName').value = property.ownerName || '';
        document.getElementById('ownerPhone').value = property.ownerPhone || '';
        document.getElementById('ownerEmail').value = property.ownerEmail || '';
        document.getElementById('ownerDocument').value = property.ownerDocument || '';
        
        // Cambiar título del formulario
        document.getElementById('formTitle').innerHTML = `
            <i class="fas fa-edit"></i>
            Editar Propiedad
        `;
        
        document.getElementById('submitBtn').innerHTML = `
            <i class="fas fa-save"></i>
            Actualizar Propiedad
        `;
        
        // Mostrar formulario
        document.getElementById('formSection').style.display = 'block';
        document.getElementById('address').focus();
    }

    // Confirmar eliminación de propiedad
    async confirmDeleteProperty(id) {
        try {
            const response = await fetch(`/api/properties/${id}`);
            if (response.ok) {
                const property = await response.json();
                this.showDeleteConfirmation(property);
            } else {
                this.showToast('Error al cargar los datos de la propiedad', 'error');
            }
        } catch (error) {
            console.error('Error loading property for delete:', error);
            this.showToast('Error de conexión', 'error');
        }
    }

    // Mostrar confirmación de eliminación
    showDeleteConfirmation(property) {
        const propertyPreview = document.getElementById('propertyPreview');
        propertyPreview.innerHTML = `
            <div class="property-preview-card">
                <div class="preview-address">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.address}
                </div>
                <div class="preview-details">
                    <span class="preview-price">${this.formatCurrency(property.price)}</span>
                    <span class="preview-size">${property.size} m²</span>
                </div>
            </div>
        `;
        
        // Configurar botón de confirmación
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        confirmBtn.onclick = () => this.deleteProperty(property.id);
        
        this.openModal('confirmModal');
    }

    // Eliminar propiedad
    async deleteProperty(id) {
        try {
            const response = await fetch(`/api/properties/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showToast('Propiedad eliminada exitosamente', 'success');
                this.closeModal('confirmModal');
                this.loadProperties();
            } else {
                const errorData = await response.json();
                this.showToast(`Error: ${errorData.message || 'No se pudo eliminar la propiedad'}`, 'error');
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            this.showToast('Error de conexión al eliminar propiedad', 'error');
        }
    }

    // Filtrar propiedades por búsqueda
    filterProperties(searchTerm) {
        const searchLower = searchTerm.toLowerCase().trim();
        
        if (!searchTerm) {
            // Si no hay término de búsqueda, recargar todas las propiedades
            this.loadProperties();
            return;
        }

        // Obtener todas las filas de la tabla o tarjetas del grid
        if (this.currentView === 'table') {
            const rows = document.querySelectorAll('#propertiesTableBody tr');
            rows.forEach(row => {
                const address = row.querySelector('.property-address').textContent.toLowerCase();
                const description = row.querySelector('.property-description').textContent.toLowerCase();
                
                if (address.includes(searchLower) || description.includes(searchLower)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        } else {
            const cards = document.querySelectorAll('.property-card');
            cards.forEach(card => {
                const address = card.querySelector('.property-address').textContent.toLowerCase();
                const description = card.querySelector('.property-description p').textContent.toLowerCase();
                
                if (address.includes(searchLower) || description.includes(searchLower)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }

    // Abrir modal
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Cerrar modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
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

function closeModal(modalId) {
    if (window.propertyManager) {
        window.propertyManager.closeModal(modalId);
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.propertyManager = new PropertyManager();
    
    // Ocultar formulario inicialmente
    document.getElementById('formSection').style.display = 'none';
});
