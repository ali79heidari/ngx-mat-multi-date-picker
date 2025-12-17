import { NgModule } from '@angular/core';
import { MultiDatepickerComponent } from './components/multi-datepicker/multi-datepicker.component';
import { MultiCalendarComponent } from './components/multi-calendar/multi-calendar.component';
import { MultiDateRangePickerComponent } from './components/multi-date-range-picker/multi-date-range-picker.component';
import { MultiDateAdapter } from './services/multi-date-adapter';

@NgModule({
  imports: [
    MultiDatepickerComponent,
    MultiCalendarComponent,
    MultiDateRangePickerComponent
  ],
  exports: [
    MultiDatepickerComponent,
    MultiCalendarComponent,
    MultiDateRangePickerComponent
  ],
  providers: [
    // We don't provide the adapter globally here to strictly enforce
    // component-level encapsulation as per design, but users can import it.
    MultiDateAdapter
  ]
})
export class NgxMultiDatePickerModule { }
