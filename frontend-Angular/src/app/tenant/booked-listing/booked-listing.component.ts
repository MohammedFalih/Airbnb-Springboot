import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { CardListingComponent } from '../../shared/card-listing/card-listing.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BookingService } from '../service/booking.service';
import { ToastService } from '../../layout/toast.service';
import { BookedListing } from '../model/booking.model';

@Component({
  selector: 'app-booked-listing',
  standalone: true,
  imports: [CardListingComponent, FaIconComponent],
  templateUrl: './booked-listing.component.html',
  styleUrl: './booked-listing.component.scss',
})
export class BookedListingComponent implements OnInit, OnDestroy {
  bookingService = inject(BookingService);
  toastService = inject(ToastService);
  bookedListings = new Array<BookedListing>();

  loading = false;

  constructor() {
    this.listenFetchBooking();
    this.listenCancelBooking();
  }

  ngOnInit(): void {
    this.fetchBooking();
  }

  ngOnDestroy(): void {
    this.bookingService.resetCancel();
  }

  onCancelBooking(bookedListing: BookedListing) {
    bookedListing.loading = true;
    this.bookingService.cancel(
      bookedListing.bookingPublicId,
      bookedListing.listingPublicId,
      false
    );
  }

  fetchBooking() {
    this.loading = true;
    this.bookingService.getBookedListing();
  }

  listenFetchBooking() {
    effect(() => {
      const bookListingState = this.bookingService.getBookedListingSig();
      if (bookListingState.status === 'OK') {
        this.loading = false;
        this.bookedListings = bookListingState.value!;
      } else if (bookListingState.status === 'ERROR') {
        this.loading = false;
        this.toastService.send({
          severity: 'error',
          summary: 'Error when fetching the listing',
        });
      }
    });
  }

  listenCancelBooking() {
    effect(() => {
      const cancelState = this.bookingService.cancelSig();
      if (cancelState.status === 'OK') {
        const listingToDeleteIndex = this.bookedListings.findIndex(
          (listing) => listing.bookingPublicId === cancelState.value
        );
        this.bookedListings.splice(listingToDeleteIndex, 1);
        this.toastService.send({
          severity: 'success',
          summary: 'Successfully cancelled booking',
        });
      } else if (cancelState.status === 'ERROR') {
        const listingToDeleteIndex = this.bookedListings.findIndex(
          (listing) => listing.bookingPublicId === cancelState.value
        );
        this.bookedListings[listingToDeleteIndex].loading = false;
        this.toastService.send({
          severity: 'error',
          summary: 'Error when cancel your booking',
        });
      }
    });
  }
}
