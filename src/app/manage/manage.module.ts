import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ManageComponent } from "./manage.component";
import { ManageRentalComponent } from "./manage-rental/manage-rental.component";
import { ManageBookingComponent } from "./manage-booking/manage-booking.component";
import { ManageRentalBookingComponent } from "./manage-rental/manage-rental-booking/manage-rental-booking.component";

import { NgPipesModule } from "ngx-pipes";
import { FormatDatePipe } from "../common/pipes/format-date.pipe";
import { RentalService } from "../rental/shared/rental.service";
import { BookingService } from "../booking/shared/booking.service";

import { AuthGuard } from "../auth/shared/auth.guard";
const routes: Routes = [
  {
    path: "manage",
    component: ManageComponent,
    children: [
      { path: "rentals", component: ManageRentalComponent },
      { path: "bookings", component: ManageBookingComponent }
    ]
  }
];

@NgModule({
  declarations: [
    ManageComponent,
    ManageRentalComponent,
    ManageBookingComponent,
    FormatDatePipe,
    ManageRentalBookingComponent
  ],
  imports: [RouterModule.forChild(routes), CommonModule, NgPipesModule],

  providers: [RentalService, BookingService]
})
export class ManageModule {}
