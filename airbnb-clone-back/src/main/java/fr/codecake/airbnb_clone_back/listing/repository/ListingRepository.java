package fr.codecake.airbnb_clone_back.listing.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fr.codecake.airbnb_clone_back.listing.domain.Listing;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Integer> {

    @Query("""
            SELECT listing FROM Listing listing
            LEFT JOIN FETCH listing.pictures picture
            WHERE listing.landlordPublicId = :landlordPublicId
            AND picture.isCover = true
            """)
    List<Listing> findAllByLandlordPublicIdFetchCoverPicture(UUID landlordPublicId);

    long deleteByPublicIdAndLandlordPublicId(UUID publicId, UUID landlordPublicId);
}
