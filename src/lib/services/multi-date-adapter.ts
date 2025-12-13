import { Inject, Injectable, Optional } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import dayjs, { Dayjs } from 'dayjs';
import './dayjs-extensions';
import { Subject } from 'rxjs';
import * as jalaali from 'jalaali-js';


export type CalendarType = 'gregorian' | 'jalaali' | 'hijri';
export type StartDayOfWeek = 'saturday' | 'sunday' | 'monday';

@Injectable()
export class MultiDateAdapter extends DateAdapter<Dayjs> {
  private _calendarType: CalendarType = 'jalaali';
  private _customStartDay: number | null = null;
  // @ts-ignore
  override readonly changes = new Subject<void>();

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super();
    this.setLocale(dateLocale || 'fa');
    dayjs.locale(this.locale);
  }

  setCalendarType(type: CalendarType) {
    this._calendarType = type;
    this.changes.next();
  }

  setStartDay(day: StartDayOfWeek) {
    switch (day) {
      case 'saturday': this._customStartDay = 6; break;
      case 'sunday': this._customStartDay = 0; break;
      case 'monday': this._customStartDay = 1; break;
    }
    this.changes.next();
  }

  // Helper to ensure we have a valid dayjs object
  private _ensureDate(date: any): Dayjs | null {
    if (!date) return null;
    const d = dayjs(date);
    return d.isValid() ? d : null;
  }

  getYear(date: Dayjs): number {
    const d = this._ensureDate(date);
    if (!d) return 0;
    if (this._calendarType === 'jalaali') return d.jYear();
    if (this._calendarType === 'hijri') return d.iYear();
    return dayjs(d.valueOf()).year();
  }

  getMonth(date: Dayjs): number {
    const d = this._ensureDate(date);
    if (!d) return 0;
    if (this._calendarType === 'jalaali') return d.jMonth();
    if (this._calendarType === 'hijri') return d.iMonth();
    return dayjs(d.valueOf()).month();
  }

  getDate(date: Dayjs): number {
    const d = this._ensureDate(date);
    if (!d) return 0;
    if (this._calendarType === 'jalaali') return d.jDate();
    if (this._calendarType === 'hijri') return d.iDate();
    return dayjs(d.valueOf()).date();
  }


  getDayOfWeek(date: Dayjs): number {
    return date.day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (this._calendarType === 'jalaali') {
      return ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    }
    if (this._calendarType === 'hijri') {
        return ['محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی', 'جمادی‌الاول', 'جمادی‌الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی‌القعده', 'ذی‌الحجه'];
    }
    // Use dayjs locale data if possible, or fallback
    // dayjs().localeData() needs localeData plugin.
    // For now, let's assume 'fa' locale is loaded and we can get months.
    return dayjs.months();
  }

  getDateNames(): string[] {
    const days = [];
    for (let i = 1; i <= 31; i++) days.push(String(i));
    return days;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (this._calendarType === 'jalaali') {
        return ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    }
    return dayjs.weekdaysMin();
  }

  getYearName(date: Dayjs): string {
    const d = this._ensureDate(date);
    if (!d) return '';
    if (this._calendarType === 'jalaali') return String(d.jYear());
    if (this._calendarType === 'hijri') return String(d.iYear());
    return String(d.year());
  }

  getFirstDayOfWeek(): number {
    if (this._customStartDay !== null) return this._customStartDay;
    return this._calendarType === 'jalaali' ? 6 : 0;
  }

  getNumDaysInMonth(date: Dayjs): number {
    const d = this._ensureDate(date);
    if (!d) return 0;
    if (this._calendarType === 'jalaali') return d.jDaysInMonth();
    if (this._calendarType === 'hijri') return d.iDaysInMonth();
    return d.daysInMonth();
  }

  clone(date: Dayjs): Dayjs {
    return date.clone();
  }

  createDate(year: number, month: number, date: number): Dayjs {
    // month is 0-indexed
    if (this._calendarType === 'jalaali') {
       const { gy, gm, gd } = jalaali.toGregorian(year, month + 1, date);
       return dayjs(new Date(gy, gm - 1, gd)).locale(this.locale);
    }
    if (this._calendarType === 'hijri') {
       // Using dayjs-hijri: create a dummy date then set iYear/iMonth/iDate
       // But wait, setting iYear might change other fields. We should set them in order or use a parser if available.
       // dayjs-hijri probably doesn't have a construct-from-hijri method exposed easily except parsing string?
       // 'iYYYY/iM/iD' format
       const hStr = `${year}/${month + 1}/${date}`;
       // If dayjs parse format works with hijri?
       // Probably not. usage: dayjs('1400/1/1', 'iYYYY/iM/iD')?
       // dayjs-hijri doesn't seem to support custom parse format for Hijri out of the box unless documented.
       // Fallback: Use a known valid date and adjust.
       let d = dayjs().locale(this.locale); // Start with today
       // @ts-ignore
       if (d.calendar) d = d.calendar('hijri');
       // Set Year, Month, Date.
       // Note: month index 0-11
       return d.year(year).month(month).date(date);
    }
    return dayjs(new Date(year, month, date)).locale(this.locale);
  }

  today(): Dayjs {
    let d = dayjs().locale(this.locale);
    if (this._calendarType === 'hijri') {
        // @ts-ignore
        if (d.calendar) d = d.calendar('hijri');
    }
    // For Jalaali we use standard gregorian backing, so no special calendar mode needed on the object itself other than for formatting?
    // Our jYear extension methods compute from gregorian.
    return d;
  }

  parse(value: any, parseFormat: any): Dayjs | null {
    if (value && typeof value === 'string') {
        if (this._calendarType === 'jalaali') {
            // value format 'jYYYY/jM/jD' or similar
            // We can split and use createDate
            const parts = value.split('/');
            if (parts.length === 3) {
                return this.createDate(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            }
        }
        if (this._calendarType === 'hijri') {
             // Try strict parsing if format is known, else split
            const parts = value.split('/');
            if (parts.length === 3) {
                return this.createDate(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            }
        }
        return dayjs(value, parseFormat, this.locale);
    }
    return value ? dayjs(value).locale(this.locale) : null;
  }

  format(date: Dayjs, displayFormat: any): string {
    const d = this._ensureDate(date);
    if (!d || !d.isValid()) {
      throw Error('MultiDateAdapter: Cannot format invalid date.');
    }

    if (this._calendarType === 'jalaali') {
        const jYear = d.jYear();
        const jMonth = d.jMonth() + 1;
        const jDate = d.jDate();
        // Simple format implementation for now
        // if displayFormat contains jMM it should replace.
        // We can just return standard YYYY/MM/DD style
        const pad = (n: number) => n < 10 ? '0' + n : n;
        return `${jYear}/${pad(jMonth)}/${pad(jDate)}`;
    }
    if (this._calendarType === 'hijri') {
        // Use standard format tokens with calendar('hijri') instance
        // @ts-ignore
        if (d.calendar) return d.calendar('hijri').format(displayFormat || 'YYYY/MM/DD');
        return d.format(displayFormat || 'YYYY/MM/DD');
    }


    return d.format(displayFormat || 'YYYY/MM/DD');
  }

  addCalendarYears(date: Dayjs, years: number): Dayjs {
    const d = this._ensureDate(date)!;
    if (this._calendarType === 'jalaali') {
        return d.jYear(d.jYear() + years);
    }
    if (this._calendarType === 'hijri') {
        return d.iYear(d.iYear() + years);
    }
    return d.add(years, 'year');
  }

  addCalendarMonths(date: Dayjs, months: number): Dayjs {
    const d = this._ensureDate(date)!;
     if (this._calendarType === 'jalaali') {
        return d.jMonth(d.jMonth() + months);
    }
    if (this._calendarType === 'hijri') {
        return d.iMonth(d.iMonth() + months);
    }
    return d.add(months, 'month');
  }

  addCalendarDays(date: Dayjs, days: number): Dayjs {
     return this._ensureDate(date)!.add(days, 'day');
  }

  toIso8601(date: Dayjs): string {
    return date.toISOString();
  }

  isDateInstance(obj: any): boolean {
    return dayjs.isDayjs(obj);
  }

  isValid(date: Dayjs): boolean {
    return dayjs.isDayjs(date) && date.isValid();
  }

  invalid(): Dayjs {
    return dayjs(null); // Invalid dayjs
  }
}
