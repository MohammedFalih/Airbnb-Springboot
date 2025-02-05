import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { LandlordListingService } from '../landlord-listing.service';
import { ToastService } from '../../layout/toast.service';
import { CardListing } from '../model/listing.model';
import { CardListingComponent } from '../../shared/card-listing/card-listing.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CardListingComponent, FontAwesomeModule],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent implements OnInit, OnDestroy {
  landlordListingService = inject(LandlordListingService);
  toastService = inject(ToastService);

  listing: Array<CardListing> | undefined = [];

  loadingFetchAll = false;
  loadingDeletiion = false;

  constructor() {
    this.listenFetchAll();
    this.listenDeletion();
  }

  ngOnInit(): void {
    this.fetchListing();
  }

  ngOnDestroy(): void {}

  private listenFetchAll() {
    effect(() => {
      const allListingState = this.landlordListingService.getAllSig();
      if (allListingState.status === 'OK' && allListingState.value) {
        this.loadingFetchAll = false;
        this.listing = allListingState.value;
      } else if (allListingState.status === 'ERROR') {
        this.toastService.send({
          severity: 'error',
          summary: 'Error',
          detail: 'Error when fetching the listing',
        });
      }
    });
  }

  private listenDeletion() {
    effect(() => {
      const deleteState = this.landlordListingService.deleteSig();
      if (deleteState.status === 'OK' && deleteState.value) {
        const listingToDeleteIndex = this.listing?.findIndex(
          (listing) => listing.publicId === deleteState.value
        );
        this.listing?.splice(listingToDeleteIndex!, 1);
        this.toastService.send({
          severity: 'success',
          summary: 'Deleted successfully',
          detail: 'Listing deleted successfully.',
        });
      } else if (deleteState.status === 'ERROR') {
        const listingToDeleteIndex = this.listing?.findIndex(
          (listing) => listing.publicId === deleteState.value
        );
        this.listing![listingToDeleteIndex!].loading = false;
        this.toastService.send({
          severity: 'error',
          summary: 'Error',
          detail: 'Error when deleting the listing',
        });
      }
      this.loadingDeletiion = false;
    });
  }

  fetchListing() {
    this.loadingFetchAll = true;
    this.landlordListingService.getAll();
  }

  onDeleteListing(listing: CardListing) {
    this.loadingDeletiion = true;
    this.landlordListingService.delete(listing.publicId);
  }
}
