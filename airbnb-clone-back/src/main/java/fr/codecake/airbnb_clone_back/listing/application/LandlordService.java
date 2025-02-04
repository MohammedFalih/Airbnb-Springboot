package fr.codecake.airbnb_clone_back.listing.application;

import org.springframework.stereotype.Service;

import fr.codecake.airbnb_clone_back.listing.application.dto.CreatedListingDTO;
import fr.codecake.airbnb_clone_back.listing.application.dto.SaveListingDTO;
import fr.codecake.airbnb_clone_back.listing.domain.Listing;
import fr.codecake.airbnb_clone_back.listing.mapper.ListingMapper;
import fr.codecake.airbnb_clone_back.listing.repository.ListingRepository;
import fr.codecake.airbnb_clone_back.user.application.Auth0Service;
import fr.codecake.airbnb_clone_back.user.application.UserService;
import fr.codecake.airbnb_clone_back.user.application.dto.ReadUserDTO;

@Service
public class LandlordService {

    private final ListingRepository listingRepository;

    private final UserService userService;

    private final Auth0Service auth0Service;

    private final ListingMapper listingMapper;

    private final PictureService pictureService;

    

    public LandlordService(ListingRepository listingRepository, UserService userService, Auth0Service auth0Service,
            ListingMapper listingMapper, PictureService pictureService) {
        this.listingRepository = listingRepository;
        this.userService = userService;
        this.auth0Service = auth0Service;
        this.listingMapper = listingMapper;
        this.pictureService = pictureService;
    }



    public CreatedListingDTO create(SaveListingDTO saveListingDTO) {
        Listing listing = listingMapper.saveListingDTOToListing(saveListingDTO);
        ReadUserDTO userConnected = userService.getAuthenticatedUserFromSecurityContext();
        listing.setLandlordPublicId(userConnected.publicId());
        Listing savedListing = listingRepository.saveAndFlush(listing);
        pictureService.saveAll(saveListingDTO.getPictures(), savedListing);
        auth0Service.addLandlordRoleToUser(userConnected);
        return listingMapper.listingToCreatedListingDTO(savedListing);
    }

}
