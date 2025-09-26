package arep.edu.co.arepcrudsystem.service;

import arep.edu.co.arepcrudsystem.dto.PropertyDTO;
import arep.edu.co.arepcrudsystem.model.Property;
import arep.edu.co.arepcrudsystem.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PropertyService {
    
    private final PropertyRepository propertyRepository;
    
    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }
    
    /**
     * Get all properties
     * @return List of PropertyDTO
     */
    @Transactional(readOnly = true)
    public List<PropertyDTO> getAllProperties() {
        List<Property> properties = propertyRepository.findAll();
        return properties.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get property by ID
     * @param id Property ID
     * @return PropertyDTO if found, null otherwise
     */
    @Transactional(readOnly = true)
    public PropertyDTO getPropertyById(Long id) {
        Optional<Property> property = propertyRepository.findById(id);
        return property.map(this::convertToDTO).orElse(null);
    }
    
    /**
     * Create a new property
     * @param propertyDTO Property data
     * @return Created PropertyDTO
     */
    public PropertyDTO createProperty(PropertyDTO propertyDTO) {
        Property property = convertToEntity(propertyDTO);
        Property savedProperty = propertyRepository.save(property);
        return convertToDTO(savedProperty);
    }
    
    /**
     * Update an existing property
     * @param id Property ID
     * @param propertyDTO Updated property data
     * @return Updated PropertyDTO if found, null otherwise
     */
    public PropertyDTO updateProperty(Long id, PropertyDTO propertyDTO) {
        Optional<Property> existingPropertyOpt = propertyRepository.findById(id);
        if (existingPropertyOpt.isPresent()) {
            Property existingProperty = existingPropertyOpt.get();
            
            // Update fields
            existingProperty.setAddress(propertyDTO.getAddress());
            existingProperty.setPrice(propertyDTO.getPrice());
            existingProperty.setSize(propertyDTO.getSize());
            existingProperty.setDescription(propertyDTO.getDescription());
            existingProperty.setOwnerName(propertyDTO.getOwnerName());
            
            Property updatedProperty = propertyRepository.save(existingProperty);
            return convertToDTO(updatedProperty);
        }
        return null;
    }
    
    /**
     * Delete a property by ID
     * @param id Property ID
     * @return true if deleted successfully, false if not found
     */
    public boolean deleteProperty(Long id) {
        if (propertyRepository.existsById(id)) {
            propertyRepository.deleteById(id);
            return true;
        }
        return false;
    }
    

    
    /**
     * Convert Property entity to PropertyDTO
     * @param property Property entity
     * @return PropertyDTO
     */
    private PropertyDTO convertToDTO(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(property.getId());
        dto.setAddress(property.getAddress());
        dto.setPrice(property.getPrice());
        dto.setSize(property.getSize());
        dto.setDescription(property.getDescription());
        dto.setOwnerName(property.getOwnerName());
        return dto;
    }
    
    /**
     * Convert PropertyDTO to Property entity
     * @param propertyDTO PropertyDTO
     * @return Property entity
     */
    private Property convertToEntity(PropertyDTO propertyDTO) {
        Property property = new Property();
        property.setId(propertyDTO.getId());
        property.setAddress(propertyDTO.getAddress());
        property.setPrice(propertyDTO.getPrice());
        property.setSize(propertyDTO.getSize());
        property.setDescription(propertyDTO.getDescription());
        property.setOwnerName(propertyDTO.getOwnerName());
        return property;
    }
}