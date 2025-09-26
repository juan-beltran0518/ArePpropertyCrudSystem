package arep.edu.co.arepcrudsystem.dto;

import jakarta.validation.constraints.*;
import java.util.Objects;

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
    
    @Size(max = 100, message = "El nombre del propietario no puede exceder 100 caracteres")
    private String ownerName;
    
    public PropertyDTO() {
    }
    
    public PropertyDTO(String address, Double price, Double size, String description, String ownerName) {
        this.address = address;
        this.price = price;
        this.size = size;
        this.description = description;
        this.ownerName = ownerName;
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
    
    public Double getPricePerSquareMeter() {
        if (size != null && size > 0 && price != null) {
            return price / size;
        }
        return 0.0;
    }
    
    public boolean isNew() {
        return id == null;
    }
    
    public String getSummary() {
        return String.format("Propiedad en %s - %,.0f m² - $%,.0f", 
                           address != null ? address : "Dirección no especificada",
                           size != null ? size : 0.0,
                           price != null ? price : 0.0);
    }
    
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
                ", ownerName='" + ownerName + '\'' +
                '}';
    }
}