import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { Booking } from "../../../booking/shared/booking.model";
import { Rental } from "../../../rental/shared/rental.model";
import { HelperService } from "../../../common/service/helper.service";
import { BookingService } from "../../../booking/shared/booking.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { DaterangePickerComponent } from "ng2-daterangepicker";
import { AuthService } from "../../../auth/shared/auth.service";
import * as moment from "moment";
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "bnb-rental-detail-booking",
  templateUrl: "./rental-detail-booking.component.html",
  styleUrls: ["./rental-detail-booking.component.scss"]
})
export class RentalDetailBookingComponent implements OnInit {
  @Input() rental: Rental;
  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;

  newBooking: Booking;
  modalRef: any;

  daterange: any = {};
  BookedOutDates: any[] = [];
  errors: any[] = [];

  options: any = {
    locale: { format: Booking.DATE_FORMAT },
    alwaysShowCalendars: false,
    opens: "left",
    autoUpdateInput: false,
    isInvalidDate: this.checkforInvalidDates.bind(this)
  };

  constructor(
    private helper: HelperService,
    private modalService: NgbModal,
    private bookingService: BookingService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    public auth: AuthService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.newBooking = new Booking();
    this.getBookedOutDates();
  }

  private checkforInvalidDates(date) {
    return (
      this.BookedOutDates.includes(this.helper.formatBookingDate(date)) ||
      date.diff(moment(), "days") < 0
    );
  }
  private getBookedOutDates() {
    const bookings: Booking[] = this.rental.bookings;

    if (bookings && bookings.length > 0) {
      bookings.forEach((booking: Booking) => {
        const dateRange = this.helper.getBookingRangeOfDates(
          booking.startAt,
          booking.endAt
        );
        this.BookedOutDates.push(...dateRange);
      });
    }
  }

  private addNewBookedOutDates(bookingData: any) {
    const dateRange = this.helper.getBookingRangeOfDates(
      bookingData.startAt,
      bookingData.endAt
    );
    this.BookedOutDates.push(...dateRange);
  }

  private resetDatePicker() {
    this.picker.datePicker.setStartDate(moment());
    this.picker.datePicker.setEndDate(moment());
    this.picker.datePicker.element.val("");
  }

  openConfirmModal(content) {
    this.errors = [];
    this.modalRef = this.modalService.open(content);
  }

  createBooking() {
    this.newBooking.rental = this.rental;
    this.bookingService.createBooking(this.newBooking).subscribe(
      (bookingData: any) => {
        this.addNewBookedOutDates(bookingData);
        this.newBooking = new Booking();
        this.modalRef.close();
        this.resetDatePicker();
        this.toastr.success(
          "Booking has been succesfully created, check your booking detail in manage section!",
          "Success!"
        );
      },
      (errorResponse: any) => {
        this.errors = errorResponse.error.errors;
      }
    );
  }
  public selectedDate(value: any, datepicker?: any) {
    this.options.autoUpdateInput = true;
    this.newBooking.startAt = this.helper.formatBookingDate(value.start);
    this.newBooking.endAt = this.helper.formatBookingDate(value.end);
    this.newBooking.days = -value.start.diff(value.end, "days");
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
  }
}
