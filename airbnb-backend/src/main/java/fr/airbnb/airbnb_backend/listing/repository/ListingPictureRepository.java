package fr.airbnb.airbnb_backend.listing.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.airbnb.airbnb_backend.listing.domain.ListingPicture;

public interface ListingPictureRepository extends JpaRepository<ListingPicture, Long    > {

}
