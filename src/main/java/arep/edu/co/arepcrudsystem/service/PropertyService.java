package arep.edu.co.arepcrudsystem.service;

import arep.edu.co.arepcrudsystem.dto.PropertyDTO;
import arep.edu.co.arepcrudsystem.model.Property;
import arep.edu.co.arepcrudsystem.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service class for Property operations.
 * Handles business logic and data transformations between Entity and DTO.
 */
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
     * Search properties by address
     * @param address Address to search for
     * @return List of PropertyDTO matching the address
     */
    @Transactional(readOnly = true)
    public List<PropertyDTO> searchPropertiesByAddress(String address) {
        List<Property> properties = propertyRepository.findByAddressContainingIgnoreCase(address);
        return properties.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Find properties within a price range
     * @param minPrice Minimum price
     * @param maxPrice Maximum price
     * @return List of PropertyDTO within the price range
     */
    @Transactional(readOnly = true)
    public List<PropertyDTO> findPropertiesByPriceRange(Double minPrice, Double maxPrice) {
        List<Property> properties = propertyRepository.findByPriceBetween(minPrice, maxPrice);
        return properties.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Find properties within a size range
     * @param minSize Minimum size
     * @param maxSize Maximum size
     * @return List of PropertyDTO within the size range
     */
    @Transactional(readOnly = true)
    public List<PropertyDTO> findPropertiesBySizeRange(Double minSize, Double maxSize) {
        List<Property> properties = propertyRepository.findBySizeBetween(minSize, maxSize);
        return properties.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get properties ordered by price
     * @param ascending true for ascending order, false for descending
     * @return List of PropertyDTO ordered by price
     */
    @Transactional(readOnly = true)
    public List<PropertyDTO> getPropertiesOrderedByPrice(boolean ascending) {
        List<Property> properties = ascending ? 
                propertyRepository.findAllByOrderByPriceAsc() : 
                propertyRepository.findAllByOrderByPriceDesc();
        return properties.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get properties ordered by size
     * @param ascending true for ascending order, false for descending
     * @return List of PropertyDTO ordered by size
     */
    @Transactional(readOnly = true)
    public List<PropertyDTO> getPropertiesOrderedBySize(boolean ascending) {
        List<Property> properties = ascending ? 
                propertyRepository.findAllByOrderBySizeAsc() : 
                propertyRepository.findAllByOrderBySizeDesc();
        return properties.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
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
        dto.setCreatedAt(property.getCreatedAt());
        dto.setUpdatedAt(property.getUpdatedAt());
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
        return property;
    }
}