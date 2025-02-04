package fr.codecake.airbnb_clone_back.listing.application.dto.sub;

import jakarta.validation.constraints.NotNull;

public record LandlordListingDTO(
    @NotNull String fistname, @NotNull String imageUrl
) {

}
