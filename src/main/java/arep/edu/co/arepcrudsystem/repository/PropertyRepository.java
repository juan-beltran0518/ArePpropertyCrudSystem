package arep.edu.co.arepcrudsystem.repository;

import arep.edu.co.arepcrudsystem.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Property entity operations.
 * Extends JpaRepository to provide basic CRUD operations.
 */
@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    // All basic CRUD operations are inherited from JpaRepository
}