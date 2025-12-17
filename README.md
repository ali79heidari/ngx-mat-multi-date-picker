# NgxMatMultiDatePicker

A comprehensive, standalone Angular component that provides **Gregorian**, **Jalali (Persian)**, and **Hijri (Islamic)** calendars with built-in holiday highlighting and broad customization options. Built on top of Angular Material and Day.js.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.1-green.svg)

[demo](https://stackblitz.com/~/github.com/ali79heidari/demo-ngx-mat-multi-date-picker)

## Features

- 📅 **Multi-Calendar Support**: Seamlessly switch between Gregorian, Jalali, and Hijri calendars.
- 🎨 **Material Design**: Fully integrated with Angular Material's look and feel.
- ⚡ **Standalone Component**: Easy to integrate without complex module setups.
- 🏖️ **Holiday Highlighting**: Built-in support for official holidays in all three calendar systems.
- 🛠️ **Customizable**: extensive configuration for start of week, weekend highlighting, and custom holidays.
- 🌍 **Day.js Powered**: Uses the robust Day.js library for reliable date manipulation.

## Installation

Install the package and its dependencies:

```bash
npm install ngx-mat-multi-date-picker
```

_Ensure you have `@angular/material` and `@angular/cdk` installed as well._

## Usage

### 1. Import Component

Since `NgxMultiDatePicker` is a standalone component, you can import it directly into your component or module:

```typescript
import { Component } from "@angular/core";
import { MultiDatepickerComponent } from "ngx-mat-multi-date-picker";
import dayjs, { Dayjs } from "dayjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [MultiDatepickerComponent],
  template: ` <ngx-multi-datepicker [(value)]="selectedDate" calendarType="jalali" [showJalaliHolidays]="true" label="Select Date"></ngx-multi-datepicker> `,
})
export class AppComponent {
  selectedDate: Dayjs | null = dayjs();
}
```

### 2. Configuration Options

The `<ngx-multi-datepicker>` component supports various inputs for customization:

#### Basic Inputs

| Input            | Type                                 | Default           | Description                                          |
| ---------------- | ------------------------------------ | ----------------- | ---------------------------------------------------- |
| `[value]`        | `Dayjs`                              | `null`            | The selected date value (two-way binding supported). |
| `[label]`        | `string`                             | `'Choose a date'` | The floating label for the input field.              |
| `[calendarType]` | `'gregorian' \| 'jalali' \| 'hijri'` | `'jalali'`        | The type of calendar to display.                     |

#### Holiday & Weekend Settings

| Input                     | Type                                 | Default | Description                                                           |
| ------------------------- | ------------------------------------ | ------- | --------------------------------------------------------------------- |
| `[showGregorianHolidays]` | `boolean`                            | `false` | Highlight official Gregorian holidays.                                |
| `[showJalaliHolidays]`    | `boolean`                            | `false` | Highlight official Jalali (Persian) holidays.                         |
| `[showHijriHolidays]`     | `boolean`                            | `false` | Highlight official Hijri (Islamic) holidays.                          |
| `[weekendDays]`           | `number[]`                           | `[]`    | Array of day numbers to highlight as weekends (0=Sunday, 6=Saturday). |
| `[startDay]`              | `'saturday' \| 'sunday' \| 'monday'` | `null`  | Sets the starting day of the week.                                    |

#### Custom Holidays

You can pass custom holiday rules for the Gregorian calendar:

```typescript
// Example: Mark January 15th of 2025 as a holiday
customHolidays = [{ year: 2025, month: 1, days: [15] }];
```

```html
<ngx-multi-datepicker [customGregorianHolidays]="customHolidays" ...></ngx-multi-datepicker>
```

### 3. Year & Month Picker

To emulate a Year and Month picker (hiding days), use the `pickerMode` input:

```html
<ngx-multi-datepicker pickerMode="month-year" label="Select Month & Year"></ngx-multi-datepicker>
```

Supported modes: `'date'` (default), `'month-year'`, `'year'`.

### 4. Inline Calendar

For an always-visible inline calendar, use the `<ngx-multi-calendar>` component:

```typescript
import { MultiCalendarComponent } from "ngx-mat-multi-date-picker";

@Component({
  imports: [MultiCalendarComponent],
  template: ` <ngx-multi-calendar [(selected)]="selectedDate"></ngx-multi-calendar> `,
})
```

Supported inputs are similar to the datepicker (min, max, holidays, etc.).

### 5. Date Range Picker

For selecting a start and end date, use the `<ngx-multi-date-range-picker>` component:

```typescript
import { MultiDateRangePickerComponent } from "ngx-mat-multi-date-picker";

@Component({
  imports: [MultiDateRangePickerComponent],
  template: `
    <ngx-multi-date-range-picker
      [(start)]="startDate"
      [(end)]="endDate"
      label="Choose a range">
    </ngx-multi-date-range-picker>
  `,
})
```

## Supported Holidays

The component includes built-in support for official holidays. These can be enabled or disabled via the `showGregorianHolidays`, `showJalaliHolidays`, and `showHijriHolidays` inputs.

### 📅 Gregorian Holidays

| Date       | Holiday   |
| ---------- | --------- |
| **Jan 1**  | New Year  |
| **Dec 25** | Christmas |

### 📅 Jalali (Persian) Holidays

| Date                    | Holiday                         |
| ----------------------- | ------------------------------- |
| **1st - 4th Farvardin** | Nowruz (Persian New Year)       |
| **12th Farvardin**      | Islamic Republic Day            |
| **13th Farvardin**      | Nature Day (Sizdah Bedar)       |
| **14th Khordad**        | Demise of Imam Khomeini         |
| **15th Khordad**        | 15 Khordad Uprising             |
| **22nd Bahman**         | Victory of Islamic Revolution   |
| **29th Esfand**         | Nationalization of Oil Industry |
| **30th Esfand**         | Public Holiday                  |

### 📅 Hijri (Islamic) Holidays

| Date                    | Holiday                          |
| ----------------------- | -------------------------------- |
| **9th Muharram**        | Tasua                            |
| **10th Muharram**       | Ashura                           |
| **20th Safar**          | Arbaeen                          |
| **28th Safar**          | Demise of Prophet & Imam Hassan  |
| **End of Safar**        | Martyrdom of Imam Reza           |
| **8th Rabi al-Awwal**   | Martyrdom of Imam Hassan Askari  |
| **17th Rabi al-Awwal**  | Birthday of Prophet & Imam Sadiq |
| **3rd Jumada al-Thani** | Martyrdom of Hazrat Fatima       |
| **13th Rajab**          | Birthday of Imam Ali             |
| **27th Rajab**          | Mab'ath                          |
| **15th Sha'ban**        | Birthday of Imam Mahdi           |
| **21st Ramadan**        | Martyrdom of Imam Ali            |
| **1st - 2nd Shawwal**   | Eid al-Fitr                      |
| **25th Shawwal**        | Martyrdom of Imam Sadiq          |
| **10th Dhu al-Hijjah**  | Eid al-Adha                      |
| **18th Dhu al-Hijjah**  | Eid al-Ghadir                    |

## Styling

The component uses Angular Material's theming. Holidays are highlighted using the `.holiday-date` class, which applies a red color by default. You can override this in your global styles if needed.

## Dependencies

This library relies on the following peer dependencies:

- Angular >= 20.0.0
- Angular Material >= 20.0.0
- Day.js >= 1.11.0

## License

MIT
