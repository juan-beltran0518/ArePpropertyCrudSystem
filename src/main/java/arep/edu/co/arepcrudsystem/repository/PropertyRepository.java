package arep.edu.co.arepcrudsystem.repository;

import arep.edu.co.arepcrudsystem.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Property entity operations.
 * Extends JpaRepository to provide CRUD operations and custom queries.
 */
@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    
    /**
     * Find properties by address containing the given text (case insensitive)
     * @param address The address text to search for
     * @return List of properties matching the address
     */
    @Query("SELECT p FROM Property p WHERE LOWER(p.address) LIKE LOWER(CONCAT('%', :address, '%'))")
    List<Property> findByAddressContainingIgnoreCase(@Param("address") String address);
    
    /**
     * Find properties within a price range
     * @param minPrice Minimum price
     * @param maxPrice Maximum price
     * @return List of properties within the price range
     */
    @Query("SELECT p FROM Property p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Property> findByPriceBetween(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    /**
     * Find properties within a size range
     * @param minSize Minimum size in square meters
     * @param maxSize Maximum size in square meters
     * @return List of properties within the size range
     */
    @Query("SELECT p FROM Property p WHERE p.size BETWEEN :minSize AND :maxSize")
    List<Property> findBySizeBetween(@Param("minSize") Double minSize, @Param("maxSize") Double maxSize);
    
    /**
     * Find properties ordered by price (ascending)
     * @return List of properties ordered by price
     */
    List<Property> findAllByOrderByPriceAsc();
    
    /**
     * Find properties ordered by price (descending)
     * @return List of properties ordered by price
     */
    List<Property> findAllByOrderByPriceDesc();
    
    /**
     * Find properties ordered by size (ascending)
     * @return List of properties ordered by size
     */
    List<Property> findAllByOrderBySizeAsc();
    
    /**
     * Find properties ordered by size (descending)
     * @return List of properties ordered by size
     */
    List<Property> findAllByOrderBySizeDesc();
}