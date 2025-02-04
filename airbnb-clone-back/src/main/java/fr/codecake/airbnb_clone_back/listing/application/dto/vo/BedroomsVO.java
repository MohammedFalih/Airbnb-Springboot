package fr.codecake.airbnb_clone_back.listing.application.dto.vo;

import jakarta.validation.constraints.NotNull;

public record BedroomsVO(@NotNull(message = "Bathrooms value must be present") int value) {

}
