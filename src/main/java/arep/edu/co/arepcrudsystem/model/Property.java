package arep.edu.co.arepcrudsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entity class representing a real estate property.
 * Contains information about address, price, size, and description.
 */
@Entity
@Table(name = "properties")
public class Property {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 500)
    @NotBlank(message = "La dirección es obligatoria")
    @Size(min = 5, max = 500, message = "La dirección debe tener entre 5 y 500 caracteres")
    private String address;
    
    @Column(nullable = false)
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a cero")
    private Double price;
    
    @Column(nullable = false)
    @NotNull(message = "El área es obligatoria")
    @DecimalMin(value = "1.0", message = "El área debe ser de al menos 1 m²")
    private Double size;
    
    @Column(length = 1000)
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String description;
    
    // Campos del propietario
    @Column(name = "owner_name", nullable = false, length = 200)
    @NotBlank(message = "El nombre del propietario es obligatorio")
    @Size(min = 2, max = 200, message = "El nombre del propietario debe tener entre 2 y 200 caracteres")
    private String ownerName;
    
    @Column(name = "owner_phone", length = 20)
    @Pattern(regexp = "^[+]?[0-9\\s\\-()]+$", message = "El teléfono debe contener solo números, espacios, guiones, paréntesis y el signo +")
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String ownerPhone;
    
    @Column(name = "owner_email", length = 100)
    @Email(message = "El email del propietario debe tener un formato válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String ownerEmail;
    
    @Column(name = "owner_document", length = 50)
    @Size(max = 50, message = "El documento de identidad no puede exceder 50 caracteres")
    @Pattern(regexp = "^[A-Za-z0-9\\-\\.\\s]*$", message = "El documento debe contener solo letras, números, guiones, puntos y espacios")
    private String ownerDocument;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructor por defecto
    public Property() {
    }
    
    // Constructor con parámetros básicos
    public Property(String address, Double price, Double size, String description) {
        this.address = address;
        this.price = price;
        this.size = size;
        this.description = description;
    }
    
    // Constructor con parámetros incluyendo propietario
    public Property(String address, Double price, Double size, String description, 
                   String ownerName, String ownerPhone, String ownerEmail, String ownerDocument) {
        this.address = address;
        this.price = price;
        this.size = size;
        this.description = description;
        this.ownerName = ownerName;
        this.ownerPhone = ownerPhone;
        this.ownerEmail = ownerEmail;
        this.ownerDocument = ownerDocument;
    }
    
    // Métodos lifecycle de JPA
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public Double getSize() {
        return size;
    }
    
    public void setSize(Double size) {
        this.size = size;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getOwnerName() {
        return ownerName;
    }
    
    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
    
    public String getOwnerPhone() {
        return ownerPhone;
    }
    
    public void setOwnerPhone(String ownerPhone) {
        this.ownerPhone = ownerPhone;
    }
    
    public String getOwnerEmail() {
        return ownerEmail;
    }
    
    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }
    
    public String getOwnerDocument() {
        return ownerDocument;
    }
    
    public void setOwnerDocument(String ownerDocument) {
        this.ownerDocument = ownerDocument;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Método para calcular precio por m²
    public Double getPricePerSquareMeter() {
        if (size != null && size > 0 && price != null) {
            return price / size;
        }
        return 0.0;
    }
    
    // Métodos equals, hashCode y toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Property property = (Property) o;
        return Objects.equals(id, property.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Property{" +
                "id=" + id +
                ", address='" + address + '\'' +
                ", price=" + price +
                ", size=" + size +
                ", description='" + description + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}