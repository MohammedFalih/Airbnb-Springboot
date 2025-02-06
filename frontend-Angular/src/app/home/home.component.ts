import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { TenantListingService } from '../tenant/tenant-listing.service';
import { ToastService } from '../layout/toast.service';
import { CategoryService } from '../layout/navbar/category/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardListing } from '../landlord/model/listing.model';
import { Subscription } from 'rxjs';
import { Pagination } from '../core/model/request.model';
import { Category } from '../layout/navbar/category/category.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardListingComponent } from '../shared/card-listing/card-listing.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FontAwesomeModule, CardListingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  tenantListingService = inject(TenantListingService);
  toastService = inject(ToastService);
  categoryService = inject(CategoryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  loading: boolean = false;
  searchIsLoading = false;
  emptySearch = false;
  listing: Array<CardListing> | undefined;
  pageRequest: Pagination = { size: 20, page: 0, sort: [] };
  categoryServiceSubscription: Subscription | undefined;
  searchSubscription: Subscription | undefined;

  constructor() {
    this.listenToGetAllCategory();
  }

  ngOnInit(): void {
    this.listenToChangeCategory();
  }

  ngOnDestroy(): void {
    this.tenantListingService.resetGetAllCategory();
    if (this.categoryServiceSubscription) {
      this.categoryServiceSubscription.unsubscribe();
    }
  }

  private listenToChangeCategory() {
    this.categoryServiceSubscription =
      this.categoryService.changeCategoryObs.subscribe({
        next: (category: Category) => {
          this.loading = true;
          if (!this.searchIsLoading) {
            this.tenantListingService.getAllByCategory(
              this.pageRequest,
              category.technicalName
            );
          }
        },
      });
  }

  private listenToGetAllCategory() {
    effect(() => {
      const categoryListingState =
        this.tenantListingService.getAllByCategorySig();
      if (categoryListingState.status === 'OK') {
        this.listing = categoryListingState.value?.content;
        this.loading = false;
        this.emptySearch = false;
      } else if (categoryListingState.status === 'ERROR') {
        this.toastService.send({
          severity: 'error',
          detail: 'Error when fetching the listing',
          summary: 'Error',
        });
        this.loading = false;
        this.emptySearch = false;
      }
    });
  }
}
