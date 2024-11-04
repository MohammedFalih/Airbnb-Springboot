package fr.airbnb.airbnb_backend.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.airbnb.airbnb_backend.booking.domain.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

}
