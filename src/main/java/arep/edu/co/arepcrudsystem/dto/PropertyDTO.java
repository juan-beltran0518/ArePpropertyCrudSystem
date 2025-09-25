package arep.edu.co.arepcrudsystem.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Data Transfer Object for Property entity.
 * Used for API communication and data validation.
 */
public class PropertyDTO {
    
    private Long id;
    
    @NotBlank(message = "La dirección es obligatoria")
    @Size(min = 5, max = 500, message = "La dirección debe tener entre 5 y 500 caracteres")
    private String address;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a cero")
    private Double price;
    
    @NotNull(message = "El área es obligatoria")
    @DecimalMin(value = "1.0", message = "El área debe ser de al menos 1 m²")
    private Double size;
    
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String description;
    
    // Campos del propietario
    @NotBlank(message = "El nombre del propietario es obligatorio")
    @Size(min = 2, max = 200, message = "El nombre del propietario debe tener entre 2 y 200 caracteres")
    private String ownerName;
    
    @Pattern(regexp = "^[+]?[0-9\\s\\-()]*$", message = "El teléfono debe contener solo números, espacios, guiones, paréntesis y el signo +")
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String ownerPhone;
    
    @Email(message = "El email del propietario debe tener un formato válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String ownerEmail;
    
    @Size(max = 50, message = "El documento de identidad no puede exceder 50 caracteres")
    @Pattern(regexp = "^[A-Za-z0-9\\-\\.\\s]*$", message = "El documento debe contener solo letras, números, guiones, puntos y espacios")
    private String ownerDocument;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // Constructor por defecto
    public PropertyDTO() {
    }
    
    // Constructor con parámetros principales
    public PropertyDTO(String address, Double price, Double size, String description) {
        this.address = address;
        this.price = price;
        this.size = size;
        this.description = description;
    }
    
    // Constructor con propietario
    public PropertyDTO(String address, Double price, Double size, String description,
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
    
    // Constructor completo
    public PropertyDTO(Long id, String address, Double price, Double size, String description, 
                      String ownerName, String ownerPhone, String ownerEmail, String ownerDocument,
                      LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.address = address;
        this.price = price;
        this.size = size;
        this.description = description;
        this.ownerName = ownerName;
        this.ownerPhone = ownerPhone;
        this.ownerEmail = ownerEmail;
        this.ownerDocument = ownerDocument;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
    
    // Método para verificar si la propiedad es nueva
    public boolean isNew() {
        return id == null;
    }
    
    // Método para obtener un resumen de la propiedad
    public String getSummary() {
        return String.format("Propiedad en %s - %,.0f m² - $%,.0f", 
                           address != null ? address : "Dirección no especificada",
                           size != null ? size : 0.0,
                           price != null ? price : 0.0);
    }
    
    // Métodos equals, hashCode y toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PropertyDTO that = (PropertyDTO) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "PropertyDTO{" +
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