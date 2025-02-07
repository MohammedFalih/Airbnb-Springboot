package fr.codecake.airbnb_clone_back.booking.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import fr.codecake.airbnb_clone_back.booking.domain.Booking;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @Query("""
            SELECT CASE WHEN COUNT(booking) > 0
            THEN TRUE ELSE FALSE END FROM Booking booking
            WHERE NOT (booking.endDate <= :startDate OR booking.startDate >= :endDate)
            AND booking.fkListing = :fkListing
            """)
    boolean bookingExistsAtInterval(OffsetDateTime startDate, OffsetDateTime endDate, UUID fkListing);

    List<Booking> findAllByFkListing(UUID fkListing);

    List<Booking> findAllByFkTenant(UUID publicId);

    int deleteBookingByFkTenantAndPublicId(UUID tenantPublicId, UUID bookingPublicId);

    int deleteBookingByPublicIdAndFkListing(UUID bookingPublicId, UUID listingPublicId);

    List<Booking> findAllByFkListingIn(List<UUID> allPropertyPublicIds);

    @Query("""
            SELECT booking FROM Booking booking WHERE
            NOT (booking.endDate <= :startDate or booking.startDate >= :endDate)
            AND booking.fkListing IN :fkListings
            """)
    List<Booking> findAllMatchWithDate(List<UUID> fkListings, OffsetDateTime startDate, OffsetDateTime endDate);
}
