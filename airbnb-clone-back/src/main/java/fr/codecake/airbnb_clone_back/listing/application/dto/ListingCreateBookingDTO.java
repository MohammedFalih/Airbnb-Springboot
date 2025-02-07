package fr.codecake.airbnb_clone_back.listing.application.dto;

import java.util.UUID;

import fr.codecake.airbnb_clone_back.listing.application.dto.vo.PriceVO;

public record ListingCreateBookingDTO(
        UUID listingPublicId, PriceVO price) {
}
