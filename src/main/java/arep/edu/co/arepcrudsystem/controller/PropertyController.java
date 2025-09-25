package arep.edu.co.arepcrudsystem.controller;

import arep.edu.co.arepcrudsystem.dto.PropertyDTO;
import arep.edu.co.arepcrudsystem.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Property operations.
 * Handles HTTP requests for CRUD operations on properties.
 */
@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {
    
    private final PropertyService propertyService;
    
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }
    
    /**
     * Get all properties
     * @return List of all properties
     */
    @GetMapping
    public ResponseEntity<List<PropertyDTO>> getAllProperties() {
        try {
            List<PropertyDTO> properties = propertyService.getAllProperties();
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get property by ID
     * @param id Property ID
     * @return Property if found, 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long id) {
        try {
            PropertyDTO property = propertyService.getPropertyById(id);
            if (property != null) {
                return ResponseEntity.ok(property);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Create a new property
     * @param propertyDTO Property data
     * @return Created property
     */
    @PostMapping
    public ResponseEntity<PropertyDTO> createProperty(@Valid @RequestBody PropertyDTO propertyDTO) {
        try {
            PropertyDTO createdProperty = propertyService.createProperty(propertyDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProperty);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Update an existing property
     * @param id Property ID
     * @param propertyDTO Updated property data
     * @return Updated property if found, 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<PropertyDTO> updateProperty(@PathVariable Long id, 
                                                     @Valid @RequestBody PropertyDTO propertyDTO) {
        try {
            PropertyDTO updatedProperty = propertyService.updateProperty(id, propertyDTO);
            if (updatedProperty != null) {
                return ResponseEntity.ok(updatedProperty);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Delete a property by ID
     * @param id Property ID
     * @return 204 if deleted successfully, 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        try {
            boolean deleted = propertyService.deleteProperty(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Search properties by address
     * @param address Address to search for
     * @return List of properties matching the address
     */
    @GetMapping("/search")
    public ResponseEntity<List<PropertyDTO>> searchPropertiesByAddress(@RequestParam String address) {
        try {
            List<PropertyDTO> properties = propertyService.searchPropertiesByAddress(address);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Find properties within a price range
     * @param minPrice Minimum price
     * @param maxPrice Maximum price
     * @return List of properties within the price range
     */
    @GetMapping("/price-range")
    public ResponseEntity<List<PropertyDTO>> findPropertiesByPriceRange(@RequestParam Double minPrice, 
                                                                       @RequestParam Double maxPrice) {
        try {
            List<PropertyDTO> properties = propertyService.findPropertiesByPriceRange(minPrice, maxPrice);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Find properties within a size range
     * @param minSize Minimum size
     * @param maxSize Maximum size
     * @return List of properties within the size range
     */
    @GetMapping("/size-range")
    public ResponseEntity<List<PropertyDTO>> findPropertiesBySizeRange(@RequestParam Double minSize, 
                                                                      @RequestParam Double maxSize) {
        try {
            List<PropertyDTO> properties = propertyService.findPropertiesBySizeRange(minSize, maxSize);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Get properties ordered by price
     * @param ascending true for ascending order, false for descending
     * @return List of properties ordered by price
     */
    @GetMapping("/order-by-price")
    public ResponseEntity<List<PropertyDTO>> getPropertiesOrderedByPrice(@RequestParam(defaultValue = "true") boolean ascending) {
        try {
            List<PropertyDTO> properties = propertyService.getPropertiesOrderedByPrice(ascending);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get properties ordered by size
     * @param ascending true for ascending order, false for descending
     * @return List of properties ordered by size
     */
    @GetMapping("/order-by-size")
    public ResponseEntity<List<PropertyDTO>> getPropertiesOrderedBySize(@RequestParam(defaultValue = "true") boolean ascending) {
        try {
            List<PropertyDTO> properties = propertyService.getPropertiesOrderedBySize(ascending);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}