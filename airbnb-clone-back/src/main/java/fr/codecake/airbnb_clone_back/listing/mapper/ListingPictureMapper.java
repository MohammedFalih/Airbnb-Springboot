package fr.codecake.airbnb_clone_back.listing.mapper;

import java.util.List;
import java.util.Set;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import fr.codecake.airbnb_clone_back.listing.application.dto.sub.PictureDTO;
import fr.codecake.airbnb_clone_back.listing.domain.ListingPicture;

@Mapper(componentModel = "spring")
public interface ListingPictureMapper {

    Set<ListingPicture> pictureDTOsToListingPictures(List<PictureDTO> pictureDTOs);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "listing", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "isCover", source = "isCover")
    ListingPicture pictureDTOToListingPicture(PictureDTO pictureDTO);
    
    List<PictureDTO> listingPictureToPictureDTO(List<ListingPicture> listingPictures);

    @Mapping(target = "isCover", source = "isCover")
    PictureDTO convertTPictureDTO(ListingPicture listingPicture);

    @Named("extract-cover")
    default PictureDTO extractCover(Set<ListingPicture> pictures){
        return pictures.stream().findFirst().map(this::convertTPictureDTO).orElseThrow();
    }
}

