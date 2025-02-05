package fr.codecake.airbnb_clone_back.listing.application.dto;

import jakarta.validation.constraints.NotNull;

public record CreatedListingDTO(@NotNull String publicId) {

}
