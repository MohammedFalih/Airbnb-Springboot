package fr.codecake.airbnb_clone_back.listing.application.dto;

import fr.codecake.airbnb_clone_back.booking.application.dto.BookedDateDTO;
import fr.codecake.airbnb_clone_back.listing.application.dto.sub.ListingInfoDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public record SearchDTO(
        @Valid BookedDateDTO dates,
        @Valid ListingInfoDTO infos,
        @NotEmpty String location) {

}
