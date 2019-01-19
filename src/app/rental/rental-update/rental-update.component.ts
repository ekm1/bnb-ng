import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';
import { Subject } from 'rxjs';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { UcWordsPipe } from 'ngx-pipes';

@Component({
  selector: 'bnb-rental-update',
  templateUrl: './rental-update.component.html',
  styleUrls: ['./rental-update.component.scss']
})
export class RentalUpdateComponent implements OnInit {
  rental: Rental;

  rentalCategories: string[] = Rental.CATEGORIES;

  locationSubject: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private rentalService: RentalService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private upperCase: UcWordsPipe
  ) {
    this.transformLocation = this.transformLocation.bind(this);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getRental(params['rentalId']);
    });
  }

  transformLocation(location: string): string {
    return this.upperCase.transform(location);
  }
  getRental(rentalId: string) {
    this.rentalService.getRentalById(rentalId).subscribe((rental: Rental) => {
      this.rental = rental;
    });
  }

  updateRental(rentalId: string, rentalData: any) {
    this.rentalService.updateRental(rentalId, rentalData).subscribe(
      (updatedRental: Rental) => {
        this.rental = updatedRental;
        this.toastr.success('Updated Successfully', 'Success!');
        if (rentalData.city || rentalData.street) {
          this.locationSubject.next(
            this.rental.city + ', ' + this.rental.street
          );
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.getRental(rentalId);
        this.toastr.error(errorResponse.error.errors[0].detail, 'Alert!');
      }
    );
  }

  countBedroomAssets(assetsNum: number) {
    return parseInt(<any>this.rental.bedrooms || 0, 10) + assetsNum;
  }
}
