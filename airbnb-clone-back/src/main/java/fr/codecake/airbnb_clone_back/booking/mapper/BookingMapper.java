package fr.codecake.airbnb_clone_back.booking.mapper;

import org.mapstruct.Mapper;

import fr.codecake.airbnb_clone_back.booking.application.dto.BookedDateDTO;
import fr.codecake.airbnb_clone_back.booking.application.dto.NewBookingDTO;
import fr.codecake.airbnb_clone_back.booking.domain.Booking;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    Booking newBookingToBooking(NewBookingDTO newBookingDTO);

    BookedDateDTO bookingToCheckAvailability(Booking booking);
}
