package fr.codecake.airbnb_clone_back.listing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fr.codecake.airbnb_clone_back.listing.domain.Listing;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Integer> {

}
