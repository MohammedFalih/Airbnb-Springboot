package fr.codecake.airbnb_clone_back.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.codecake.airbnb_clone_back.booking.domain.Booking;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

}
