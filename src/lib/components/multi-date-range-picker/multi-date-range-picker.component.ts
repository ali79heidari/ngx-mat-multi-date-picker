import { Component, Input, Output, EventEmitter, Inject, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule, MatCalendarCellClassFunction, MatDateRangeInput } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, ThemePalette } from '@angular/material/core';
import { MultiDateAdapter, CalendarType, StartDayOfWeek } from '../../services/multi-date-adapter';
import dayjs, { Dayjs } from 'dayjs';
import '../../services/dayjs-extensions';
import { MULTI_DATE_FORMATS, CustomHolidayRule } from '../multi-datepicker/multi-datepicker.component';

@Component({
  selector: 'ngx-multi-date-range-picker',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MultiDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MULTI_DATE_FORMATS }
  ],
  template: `
    <mat-form-field [appearance]="appearance" [color]="color" [floatLabel]="floatLabel">
      <mat-label>{{ label }}</mat-label>
      <mat-date-range-input [rangePicker]="picker" [min]="min" [max]="max" [dateFilter]="dateFilter" [disabled]="disabled">
        <input matStartDate placeholder="Start date" [value]="start" (dateChange)="onStartChange($event.value)">
        <input matEndDate placeholder="End date" [value]="end" (dateChange)="onEndChange($event.value)">
      </mat-date-range-input>
      <mat-datepicker-toggle matIconSuffix [for]="picker" [disabled]="disabled"></mat-datepicker-toggle>
      <mat-date-range-picker #picker
        [dateClass]="internalDateClass"
        [touchUi]="touchUi"
        [startView]="startView"
        [panelClass]="panelClass"
        [disabled]="disabled"
        (opened)="opened.emit()"
        (closed)="closed.emit()">
      </mat-date-range-picker>
    </mat-form-field>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
    }
    .holiday-date .mat-calendar-body-cell-content {
      color: red !important;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class MultiDateRangePickerComponent implements OnChanges {
  // Basic Inputs
  @Input() calendarType: CalendarType = 'jalali';
  @Input() label: string = 'Enter a date range';
  @Input() start: Dayjs | null = null;
  @Input() end: Dayjs | null = null;
  @Input() startDay: StartDayOfWeek | null = null;

  // Form Field Inputs
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() floatLabel: 'auto' | 'always' = 'auto';
  @Input() color: ThemePalette = 'primary';

  // Datepicker Inputs
  @Input() min: Dayjs | null = null;
  @Input() max: Dayjs | null = null;
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';
  @Input() touchUi: boolean = false;
  @Input() disabled: boolean = false;
  @Input() panelClass: string | string[] = '';
  @Input() dateFilter: (date: Dayjs | null) => boolean = () => true;
  @Input() dateClass: MatCalendarCellClassFunction<Dayjs> | null = null;

  // Holiday Configuration
  @Input() weekendDays: number[] = [];
  @Input() customGregorianHolidays: CustomHolidayRule[] = [];
  @Input() showGregorianHolidays: boolean = false;
  @Input() showJalaliHolidays: boolean = false;
  @Input() showHijriHolidays: boolean = false;

  // Outputs
  @Output() startChange = new EventEmitter<Dayjs | null>();
  @Output() endChange = new EventEmitter<Dayjs | null>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  constructor(private _adapter: DateAdapter<Dayjs>) {}

  ngOnChanges(changes: SimpleChanges): void {
     if (changes['calendarType']) {
      if (this._adapter instanceof MultiDateAdapter) {
        this._adapter.setCalendarType(this.calendarType);
      }
    }

    if (changes['startDay']) {
      if (this._adapter instanceof MultiDateAdapter && this.startDay) {
        this._adapter.setStartDay(this.startDay);
      }
    }
  }

  onStartChange(date: Dayjs | null) {
      this.start = date;
      this.startChange.emit(date);
  }

  onEndChange(date: Dayjs | null) {
      this.end = date;
      this.endChange.emit(date);
  }

  // Reuse logic from MultiDatepickerComponent - duplicate for now to keep standalone
  internalDateClass: MatCalendarCellClassFunction<Dayjs> = (cellDate, view) => {
    const holidayClass = this._checkDate(cellDate, view);
    let userResult: any = null;

    if (this.dateClass) {
      userResult = this.dateClass(cellDate, view);
    }

    if (!userResult) {
      return holidayClass;
    }

    if (!holidayClass) {
      return userResult;
    }

    if (typeof userResult === 'string') {
      return `${holidayClass} ${userResult}`;
    }

    if (Array.isArray(userResult)) {
      return [holidayClass, ...userResult];
    }

    if (userResult instanceof Set) {
      const newSet = new Set(userResult);
      newSet.add(holidayClass);
      return newSet;
    }

    if (typeof userResult === 'object') {
      return { ...userResult, [holidayClass]: true };
    }

    return holidayClass;
  };

  private _checkDate(cellDate: Dayjs, view: 'month' | 'year' | 'multi-year'): string {
    if (view !== 'month') {
      return '';
    }

    const date = cellDate.clone();
    let isHoliday = false;

    if (this.weekendDays.includes(date.day())) {
      isHoliday = true;
    }

    if (!isHoliday && this.customGregorianHolidays.length > 0) {
      const gYear = date.year();
      const gMonth = date.month() + 1;
      const gDate = date.date();

      for (const rule of this.customGregorianHolidays) {
        if (rule.year === gYear && rule.month === gMonth) {
          if (rule.days.includes(gDate)) {
            isHoliday = true;
            break;
          }
        }
      }
    }

    if (this.showGregorianHolidays && !isHoliday) {
      const m = date.month();
      const d = date.date();
      if (m === 0 && d === 1) isHoliday = true;
      if (m === 11 && d === 25) isHoliday = true;
    }

    if (this.showJalaliHolidays && !isHoliday) {
       const jMonth = date.jMonth();
       const jDate = date.jDate();
       if (jMonth === 0 && jDate >= 1 && jDate <= 4) isHoliday = true;
       if (jMonth === 0 && jDate === 12) isHoliday = true;
       if (jMonth === 0 && jDate === 13) isHoliday = true;
       if (jMonth === 2 && jDate === 14) isHoliday = true;
       if (jMonth === 2 && jDate === 15) isHoliday = true;
       if (jMonth === 10 && jDate === 22) isHoliday = true;
       if (jMonth === 11 && jDate === 29) isHoliday = true;
       if (jMonth === 11 && jDate === 30) isHoliday = true;
    }

    if (this.showHijriHolidays && !isHoliday) {
       const hMonth = date.iMonth();
       const hDate = date.iDate();

       if (hMonth === 0 && hDate === 9) isHoliday = true;
       if (hMonth === 0 && hDate === 10) isHoliday = true;
       if (hMonth === 1 && hDate === 20) isHoliday = true;
       if (hMonth === 1 && hDate === 28) isHoliday = true;
       const nextDay = date.add(1, 'day');
       if (hMonth === 1 && nextDay.iMonth() === 2) isHoliday = true;

       if (hMonth === 2 && hDate === 8) isHoliday = true;
       if (hMonth === 2 && hDate === 17) isHoliday = true;
       if (hMonth === 5 && hDate === 3) isHoliday = true;
       if (hMonth === 6 && hDate === 13) isHoliday = true;
       if (hMonth === 6 && hDate === 27) isHoliday = true;
       if (hMonth === 7 && hDate === 15) isHoliday = true;
       if (hMonth === 8 && hDate === 21) isHoliday = true;
       if (hMonth === 9 && (hDate === 1 || hDate === 2)) isHoliday = true;
       if (hMonth === 9 && hDate === 25) isHoliday = true;
       if (hMonth === 11 && hDate === 10) isHoliday = true;
       if (hMonth === 11 && hDate === 18) isHoliday = true;
    }

    if (isHoliday) {
      return 'holiday-date';
    }
    return '';
  }
}
