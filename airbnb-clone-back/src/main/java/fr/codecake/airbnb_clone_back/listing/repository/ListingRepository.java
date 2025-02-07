package fr.codecake.airbnb_clone_back.listing.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fr.codecake.airbnb_clone_back.listing.domain.BookingCategory;
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

        @Query("""
                        SELECT listing from Listing listing
                        LEFT JOIN FETCH listing.pictures picture
                        WHERE picture.isCover = true AND
                        listing.bookingCategory = :bookingCategory
                                            """)
        Page<Listing> findAllByBookingCategoryWithCoverOnly(Pageable pageable, BookingCategory bookingCategory);

        @Query("""
                        SELECT listing from Listing listing
                        LEFT JOIN FETCH listing.pictures picture
                        WHERE picture.isCover = true
                        """)
        Page<Listing> findAllWithCoverOnly(Pageable pageable);

        Optional<Listing> findByPublicId(UUID publicId);

        List<Listing> findAllByPublicIdIn(List<UUID> allListingPublicIds);

        Optional<Listing> findOneByPublicIdAndLandlordPublicId(UUID listingPublicId, UUID landlordPublicId);
}
