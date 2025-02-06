package fr.codecake.airbnb_clone_back.listing.application;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import fr.codecake.airbnb_clone_back.listing.application.dto.DisplayCardListingDTO;
import fr.codecake.airbnb_clone_back.listing.application.dto.DisplayListingDTO;
import fr.codecake.airbnb_clone_back.listing.application.dto.sub.LandlordListingDTO;
import fr.codecake.airbnb_clone_back.listing.domain.BookingCategory;
import fr.codecake.airbnb_clone_back.listing.domain.Listing;
import fr.codecake.airbnb_clone_back.listing.mapper.ListingMapper;
import fr.codecake.airbnb_clone_back.listing.repository.ListingRepository;
import fr.codecake.airbnb_clone_back.sharedkernal.service.State;
import fr.codecake.airbnb_clone_back.user.application.UserService;
import fr.codecake.airbnb_clone_back.user.application.dto.ReadUserDTO;

import org.springframework.transaction.annotation.Transactional;

@Service
public class TenantService {

    private final ListingRepository listingRepository;

    private final ListingMapper listingMapper;

    private final UserService userService;
    // private final BookingService bookingService;

    public TenantService(ListingRepository listingRepository, ListingMapper listingMapper, UserService userService
    // BookingService bookingService
    ) {
        this.listingRepository = listingRepository;
        this.listingMapper = listingMapper;
        this.userService = userService;
        // this.bookingService = bookingService;
    }

    public Page<DisplayCardListingDTO> getAllByCategory(Pageable pageable, BookingCategory category) {
        Page<Listing> allOrBookingCategory;
        if (category == BookingCategory.ALL) {
            allOrBookingCategory = listingRepository.findAllWithCoverOnly(pageable);
        } else {
            allOrBookingCategory = listingRepository.findAllByBookingCategoryWithCoverOnly(pageable, category);
        }

        return allOrBookingCategory.map(listingMapper::listingToDisplayCardListingDTO);
    }

    @Transactional(readOnly = true)
    public State<DisplayListingDTO, String> getOne(UUID publicId) {
        Optional<Listing> listingByPublicIdOpt = listingRepository.findByPublicId(publicId);
        if (listingByPublicIdOpt.isEmpty()) {
            return State.<DisplayListingDTO, String>builder()
                    .forError(String.format("Listing doesn't exist for publicId: %s", publicId));
        }

        DisplayListingDTO displayListingDTO = listingMapper.listingToDisplayListingDTO(listingByPublicIdOpt.get());
        ReadUserDTO readUserDTO = userService.getByPublicId(listingByPublicIdOpt.get().getLandlordPublicId())
                .orElseThrow();
        LandlordListingDTO landlordListingDTO = new LandlordListingDTO(readUserDTO.firstName(), readUserDTO.imageUrl());
        displayListingDTO.setLandlord(landlordListingDTO);

        return State.<DisplayListingDTO, String>builder().forSuccess(displayListingDTO);
    }
}
