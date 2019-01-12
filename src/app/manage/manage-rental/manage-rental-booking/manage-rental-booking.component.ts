import { Component, OnInit, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RentalService } from "../../../rental/shared/rental.service";
import { Booking } from "../../../booking/shared/booking.model";

@Component({
  selector: "bnb-manage-rental-booking",
  templateUrl: "./manage-rental-booking.component.html",
  styleUrls: ["./manage-rental-booking.component.scss"]
})
export class ManageRentalBookingComponent implements OnInit {
  @Input() bookings: Booking[];

  constructor(public modalService: NgbModal) {}

  ngOnInit() {}
}
