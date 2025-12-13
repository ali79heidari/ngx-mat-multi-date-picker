import dayjs from 'dayjs';
import * as jalaali from 'jalaali-js';
import hijri from 'dayjs-hijri';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/fa';
import 'dayjs/locale/ar';

dayjs.extend(hijri);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);

declare module 'dayjs' {
  interface Dayjs {
    jYear(): number;
    jYear(v: number): this;
    jMonth(): number;
    jMonth(v: number): this;
    jDate(): number;
    jDate(v: number): this;
    jDaysInMonth(): number;
    
    // Hijri
    iYear(): number;
    iYear(v: number): this;
    iMonth(): number;
    iMonth(v: number): this;
    iDate(): number;
    iDate(v: number): this;
    iDaysInMonth(): number;
  }
}

// Extract Jalaali logic
const proto = dayjs.prototype as any;

function getJalaali(d: any) {
  // Ensure we use a standard Gregorian dayjs object
  const g = dayjs(d.valueOf());
  // @ts-ignore
  return jalaali.toJalaali(g.year(), g.month() + 1, g.date());
}


proto.jYear = function(v?: number) {
  const jd = getJalaali(this);
  if (v === undefined) return jd.jy;
  // @ts-ignore
  const { gy, gm, gd } = jalaali.toGregorian(v, jd.jm, jd.jd);
  return this.year(gy).month(gm - 1).date(gd);
};

proto.jMonth = function(v?: number) {
  const jd = getJalaali(this);
  if (v === undefined) return jd.jm - 1; 
  const targetMonth = v + 1;
  // @ts-ignore
  const { gy, gm, gd } = jalaali.toGregorian(jd.jy, targetMonth, jd.jd);
  return this.year(gy).month(gm - 1).date(gd);
};

proto.jDate = function(v?: number) {
  const jd = getJalaali(this);
  if (v === undefined) return jd.jd;
  // @ts-ignore
  const { gy, gm, gd } = jalaali.toGregorian(jd.jy, jd.jm, v);
  return this.year(gy).month(gm - 1).date(gd);
};

proto.jDaysInMonth = function() {
    const jd = getJalaali(this);
    // @ts-ignore
    return jalaali.jalaaliMonthLength(jd.jy, jd.jm);
}

// Hijri
proto.iYear = function(v?: number) {
  // @ts-ignore
  const h = this.calendar('hijri');
  if (v === undefined) return h.year();
  return h.year(v); 
};

proto.iMonth = function(v?: number) {
  // @ts-ignore
  const h = this.calendar('hijri');
  if (v === undefined) return h.month(); 
  return h.month(v);
};

proto.iDate = function(v?: number) {
  // @ts-ignore
  const h = this.calendar('hijri');
  if (v === undefined) return h.date();
  return h.date(v);
};

proto.iDaysInMonth = function() {
    // @ts-ignore
    return this.calendar('hijri').daysInMonth();
}
