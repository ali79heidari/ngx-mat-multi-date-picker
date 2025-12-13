import { Component, Input, Output, EventEmitter, Inject, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MultiDateAdapter, CalendarType, StartDayOfWeek } from '../../services/multi-date-adapter';
import dayjs, { Dayjs } from 'dayjs';
import '../../services/dayjs-extensions';


export const MULTI_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface CustomHolidayRule {
  year: number;
  month: number;
  days: number[];
}

@Component({
  selector: 'ngx-multi-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MultiDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MULTI_DATE_FORMATS }
  ],
  template: `
    <mat-form-field appearance="fill">
      <mat-label>{{ label }}</mat-label>
      <input matInput [matDatepicker]="picker" [(ngModel)]="value" (dateChange)="onDateChange($event)">
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker [dateClass]="dateClass"></mat-datepicker>
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
export class MultiDatepickerComponent implements OnChanges {
  @Input() calendarType: CalendarType = 'jalaali';
  @Input() label: string = 'Choose a date';
  @Input() value: Dayjs | null = null;
  @Input() startDay: StartDayOfWeek | null = null;
  @Input() weekendDays: number[] = [];
  @Input() customGregorianHolidays: CustomHolidayRule[] = [];
  
  @Input() showGregorianHolidays: boolean = false;
  @Input() showJalaaliHolidays: boolean = false;
  @Input() showHijriHolidays: boolean = false;

  @Output() valueChange = new EventEmitter<Dayjs | null>();

  constructor(private _adapter: DateAdapter<Dayjs>) {}

  ngOnChanges(changes: SimpleChanges): void {
    const shouldRefreshHolidays = 
      changes['showGregorianHolidays'] || 
      changes['showJalaaliHolidays'] || 
      changes['showHijriHolidays'] ||
      changes['weekendDays'] ||
      changes['customGregorianHolidays'];

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

    if (shouldRefreshHolidays || changes['calendarType']) {
       // Re-assign dateClass to force the datepicker to re-render cells
       this.dateClass = (cellDate, view) => this._checkDate(cellDate, view);
    }
  }

  onDateChange(event: any) {
    this.valueChange.emit(this.value);
  }

  // Initial definition
  dateClass: MatCalendarCellClassFunction<Dayjs> = (cellDate, view) => {
    return this._checkDate(cellDate, view);
  };

  private _checkDate(cellDate: Dayjs, view: 'month' | 'year' | 'multi-year'): string {
    // Only highlight dates in month view
    if (view !== 'month') {
      return '';
    }
    
    const date = cellDate.clone(); // Clone to avoid mutation issues
    let isHoliday = false;

    // 0. Weekend Days (Weekly Holidays)
    if (this.weekendDays.includes(date.day())) {
      isHoliday = true;
    }

    // 0.1 Custom Gregorian Holidays
    if (!isHoliday && this.customGregorianHolidays.length > 0) {
      const gYear = date.year();
      const gMonth = date.month() + 1; // 1-12
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

    // 1. Gregorian Holidays
    if (this.showGregorianHolidays && !isHoliday) {
      const m = date.month(); // 0-11
      const d = date.date();  // 1-31
      // New Year: Jan 1
      if (m === 0 && d === 1) isHoliday = true;
      // Christmas: Dec 25
      if (m === 11 && d === 25) isHoliday = true;
    }

    // 2. Jalaali Holidays (Solar Hijri)
    if (this.showJalaaliHolidays && !isHoliday) {
        // Use our extension methods
       const jMonth = date.jMonth(); // 0-11
       const jDate = date.jDate();   // 1-31
       
       // Nowruz: Farvardin 1-4 (Month 0)
       if (jMonth === 0 && jDate >= 1 && jDate <= 4) isHoliday = true;
       // Islamic Republic Day: Farvardin 12 (Month 0)
       if (jMonth === 0 && jDate === 12) isHoliday = true;
       // Nature Day (Sizdah Bedar): Farvardin 13 (Month 0)
       if (jMonth === 0 && jDate === 13) isHoliday = true;
       // Demise of Khomeini: Khordad 14 (Month 2)
       if (jMonth === 2 && jDate === 14) isHoliday = true;
       // 15 Khordad Uprising: Khordad 15 (Month 2)
       if (jMonth === 2 && jDate === 15) isHoliday = true;
       // Victory of Revolution: Bahman 22 (Month 10)
       if (jMonth === 10 && jDate === 22) isHoliday = true;
       // Nationalization of Oil: Esfand 29 (Month 11)
       if (jMonth === 11 && jDate === 29) isHoliday = true;
       // Esfand 30 (User specified: 29 Esfand to 4 Farvardin holiday range implies 30 is included)
       if (jMonth === 11 && jDate === 30) isHoliday = true;
    }

    // 3. Hijri Holidays (Lunar Hijri)
    if (this.showHijriHolidays && !isHoliday) {
       // Use our extension methods
       const hMonth = date.iMonth(); // 0-11
       const hDate = date.iDate();   // 1-30
       
       // Tasua: Muharram 9
       if (hMonth === 0 && hDate === 9) isHoliday = true;
       // Ashura: Muharram 10
       if (hMonth === 0 && hDate === 10) isHoliday = true;
       // Arbaeen: Safar 20
       if (hMonth === 1 && hDate === 20) isHoliday = true;
       // Demise of Prophet & Imam Hassan: Safar 28
       if (hMonth === 1 && hDate === 28) isHoliday = true;
       // Martyrdom of Imam Reza: End of Safar (29 or 30)
       // Check if tomorrow is month 2 (Rabi al-Awwal)
       const nextDay = date.add(1, 'day');
       if (hMonth === 1 && nextDay.iMonth() === 2) isHoliday = true;

       // Martyrdom of Imam Hassan Askari: Rabi al-Awwal 8
       if (hMonth === 2 && hDate === 8) isHoliday = true;
       // Birthday of Prophet & Imam Sadiq: Rabi al-Awwal 17
       if (hMonth === 2 && hDate === 17) isHoliday = true;
       // Martyrdom of Fatima: Jumada al-Thani 3 (Month 5)
       if (hMonth === 5 && hDate === 3) isHoliday = true;
       // Birthday of Imam Ali: Rajab 13
       if (hMonth === 6 && hDate === 13) isHoliday = true;
       // Mab'ath: Rajab 27
       if (hMonth === 6 && hDate === 27) isHoliday = true;
       // Birthday of Imam Mahdi: Sha'ban 15
       if (hMonth === 7 && hDate === 15) isHoliday = true;
       // Martyrdom of Imam Ali: Ramadan 21
       if (hMonth === 8 && hDate === 21) isHoliday = true;
       // Eid al-Fitr: Shawwal 1-2
       if (hMonth === 9 && (hDate === 1 || hDate === 2)) isHoliday = true;
       // Martyrdom of Imam Sadiq: Shawwal 25
       if (hMonth === 9 && hDate === 25) isHoliday = true;
       // Eid al-Adha: Dhu al-Hijjah 10
       if (hMonth === 11 && hDate === 10) isHoliday = true;
       // Eid al-Ghadir: Dhu al-Hijjah 18
       if (hMonth === 11 && hDate === 18) isHoliday = true;
    }

    if (isHoliday) {
      // console.log('Holiday found:', date.format('YYYY-MM-DD'), 'Class: holiday-date');
      return 'holiday-date';
    }
    return '';
  }
}
