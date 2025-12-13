import { NgModule } from '@angular/core';
import { MultiDatepickerComponent } from './components/multi-datepicker/multi-datepicker.component';
import { MultiDateAdapter } from './services/multi-date-adapter';

@NgModule({
  imports: [
    MultiDatepickerComponent
  ],
  exports: [
    MultiDatepickerComponent
  ],
  providers: [
    // We don't provide the adapter globally here to strictly enforce
    // component-level encapsulation as per design, but users can import it.
    MultiDateAdapter
  ]
})
export class NgxMultiDatePickerModule { }
