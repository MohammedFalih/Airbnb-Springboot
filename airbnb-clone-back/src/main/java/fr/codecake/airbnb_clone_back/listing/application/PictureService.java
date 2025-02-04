package fr.codecake.airbnb_clone_back.listing.application;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import fr.codecake.airbnb_clone_back.listing.application.dto.sub.PictureDTO;
import fr.codecake.airbnb_clone_back.listing.domain.Listing;
import fr.codecake.airbnb_clone_back.listing.domain.ListingPicture;
import fr.codecake.airbnb_clone_back.listing.mapper.ListingPictureMapper;
import fr.codecake.airbnb_clone_back.listing.repository.ListingPictureRepository;

@Service
public class PictureService {

    private final ListingPictureRepository listingPictureRepository;

    private final ListingPictureMapper listingPictureMapper;

    public PictureService(ListingPictureRepository listingPictureRepository,
            ListingPictureMapper listingPictureMapper) {
        this.listingPictureRepository = listingPictureRepository;
        this.listingPictureMapper = listingPictureMapper;
    }
    
    public List<PictureDTO> saveAll(List<PictureDTO> pictures, Listing listing) {
        Set<ListingPicture> listingPictures = listingPictureMapper.pictureDTOsToListingPictures(pictures);

        boolean isFirst = true;

        for (ListingPicture listingPicture : listingPictures) {
            listingPicture.setIsCover(isFirst);
            listingPicture.setListing(listing);
            isFirst = false;
        }

        listingPictureRepository.saveAll(listingPictures);
        return listingPictureMapper.listingPictureToPictureDTO(listingPictures.stream().toList());
    }
}
