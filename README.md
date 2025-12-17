# NgxMatMultiDatePicker

A comprehensive, standalone Angular library providing high-quality **Gregorian**, **Jalali (Persian)**, and **Hijri (Islamic)** date pickers. It is built on top of Angular Material and Day.js, offering seamless integration, built-in holiday highlighting, and extensive customization options.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Angular](https://img.shields.io/badge/Angular-20%2B-red)

[**Live Demo**](https://stackblitz.com/~/github.com/ali79heidari/demo-ngx-mat-multi-date-picker)

## Key Features

- **Multiple Calendar Systems**: Fully functional Gregorian, Jalali (Solar Hijri), and Hijri (Lunar) calendars.
- **Three Standalone Components**:
  - `MultiDatepickerComponent`: Standard input-based date picker.
  - `MultiDateRangePickerComponent`: Select start and end dates.
  - `MultiCalendarComponent`: Inline calendar view.
- **Holiday Highlighting**: Built-in official holidays for all three calendar systems.
- **Customization**: Configure start day of week, weekend days, custom holidays, and theming.
- **Picker Modes**: Support for standard date picking, month & year only, or year only.
- **Angular Material Native**: Built directly on `MatDatepicker`, ensuring complete compatibility with Material Design.
- **Day.js Powered**: Uses the lightweight and immutable Day.js library for all date manipulations.

## Installation

Install the package via npm:

```bash
npm install ngx-mat-multi-date-picker
```

## Getting Started

### 1. Import Components

The library provides standalone components. Import the ones you need directly into your component imports:

```typescript
import { Component } from "@angular/core";
import { MultiDatepickerComponent, MultiDateRangePickerComponent } from "ngx-mat-multi-date-picker";
import dayjs, { Dayjs } from "dayjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [MultiDatepickerComponent, MultiDateRangePickerComponent],
  template: `
    <!-- Simple Datepicker -->
    <ngx-multi-datepicker [(value)]="date" calendarType="jalali"></ngx-multi-datepicker>

    <!-- Range Picker -->
    <ngx-multi-date-range-picker [(start)]="start" [(end)]="end" calendarType="gregorian"></ngx-multi-date-range-picker>
  `,
})
export class AppComponent {
  date: Dayjs | null = dayjs();
  start: Dayjs | null = dayjs();
  end: Dayjs | null = dayjs().add(7, "day");
}
```

## detailed API Documentation

### 1. `<ngx-multi-datepicker>`

The primary component for selecting a single date.

#### Inputs

| Input Name                | Type                                 | Default           | Description                                                |
| ------------------------- | ------------------------------------ | ----------------- | ---------------------------------------------------------- |
| `[value]`                 | `Dayjs`                              | `null`            | The selected date (supports two-way binding).              |
| `[calendarType]`          | `'gregorian' \| 'jalali' \| 'hijri'` | `'jalali'`        | The calendar system to use.                                |
| `[label]`                 | `string`                             | `'Choose a date'` | Floating label for the input.                              |
| `[pickerMode]`            | `'date' \| 'month-year' \| 'year'`   | `'date'`          | View mode: standard date, month & year only, or year only. |
| `[showJalaliHolidays]`    | `boolean`                            | `false`           | Highlight official Jalali holidays (red).                  |
| `[showGregorianHolidays]` | `boolean`                            | `false`           | Highlight official Gregorian holidays.                     |
| `[showHijriHolidays]`     | `boolean`                            | `false`           | Highlight official Hijri holidays.                         |
| `[startDay]`              | `'saturday' \| 'sunday' \| 'monday'` | `null`            | First day of the week.                                     |
| `[weekendDays]`           | `number[]`                           | `[]`              | Days to mark as weekend (0=Sun, 6=Sat).                    |
| `[min]`                   | `Dayjs`                              | `null`            | Minimum selectable date.                                   |
| `[max]`                   | `Dayjs`                              | `null`            | Maximum selectable date.                                   |
| `[disabled]`              | `boolean`                            | `false`           | Disables the input and picker.                             |
| `[touchUi]`               | `boolean`                            | `false`           | Enables touch-friendly dialog mode.                        |
| `[dateFilter]`            | `(d: Dayjs) => boolean`              | `() => true`      | Function to disable specific dates.                        |
| `[dateClass]`             | `(d: Dayjs) => any`                  | `null`            | Custom CSS class function for calendar cells.              |

#### Outputs

| Output Event      | Type    | Description                                          |
| ----------------- | ------- | ---------------------------------------------------- |
| `(valueChange)`   | `Dayjs` | Emitted when value is updated.                       |
| `(opened)`        | `void`  | Emitted when picker opens.                           |
| `(closed)`        | `void`  | Emitted when picker closes.                          |
| `(monthSelected)` | `Dayjs` | Emitted when a month is selected in Multi-Year view. |
| `(yearSelected)`  | `Dayjs` | Emitted when a year is selected in Multi-Year view.  |

---

### 2. `<ngx-multi-date-range-picker>`

Allows selection of a start and end date range.

#### Inputs

| Input Name                | Type                                 | Default                | Description                   |
| ------------------------- | ------------------------------------ | ---------------------- | ----------------------------- |
| `[start]`                 | `Dayjs`                              | `null`                 | Start date (two-way binding). |
| `[end]`                   | `Dayjs`                              | `null`                 | End date (two-way binding).   |
| `[calendarType]`          | `'gregorian' \| 'jalali' \| 'hijri'` | `'jalali'`             | Calendar system.              |
| `[label]`                 | `string`                             | `'Enter a date range'` | Input label.                  |
| `[min]`, `[max]`          | `Dayjs`                              | `null`                 | Date constraints.             |
| `[showJalaliHolidays]`    | `boolean`                            | `false`                | Highlight Jalali holidays.    |
| `[showGregorianHolidays]` | `boolean`                            | `false`                | Highlight Gregorian holidays. |
| `[showHijriHolidays]`     | `boolean`                            | `false`                | Highlight Hijri holidays.     |

_(Supports strictly the same holiday and configuration inputs as the single datepicker)_

---

### 3. `<ngx-multi-calendar>`

An inline calendar component that is always visible.

#### Inputs

| Input Name       | Type                                 | Description                                |
| ---------------- | ------------------------------------ | ------------------------------------------ |
| `[selected]`     | `Dayjs`                              | Currently selected date (two-way binding). |
| `[calendarType]` | `'gregorian' \| 'jalali' \| 'hijri'` | Calendar system type.                      |
| `[startView]`    | `'month' \| 'year' \| 'multi-year'`  | Initial view mode.                         |

_(Supports all standard holiday and min/max inputs)_

---

## Advanced Usage

### Custom Holidays

You can define your own rules for highlighting dates (currently supported for Gregorian custom rules via input).

```typescript
// Define custom holidays (e.g. Company Retreat on Jan 15th and 20th)
myCustomHolidays: CustomHolidayRule[] = [
  { year: 2025, month: 1, days: [15, 20] }
];
```

```html
<ngx-multi-datepicker [customGregorianHolidays]="myCustomHolidays"></ngx-multi-datepicker>
```

### Date Formatting

The library uses a custom `MultiDateAdapter`. Display formats are handled automatically based on the selected `calendarType`.

- **Gregorian**: `YYYY/MM/DD`
- **Jalali**: `YYYY/MM/DD` (Solar Hijri year/month)
- **Hijri**: `YYYY/MM/DD` (Lunar Hijri year/month)

### Theming

The component uses Angular Material's standard theming system.

- **Holidays**: Marked with the `.holiday-date` CSS class (default: `color: red`).
- **Weekends**: You can style them if you pass `weekendDays` and add custom CSS to matching cells if needed, or rely on dateClass.

To override holiday colors globally:

```css
.holiday-date .mat-calendar-body-cell-content {
  color: #ff4081 !important; /* Your custom color */
  font-weight: bold;
}
```

## Built-in Holiday Data

The library includes comprehensive lists of official holidays.

**Jalali (Persian)**: Nowruz (1-4 Farvardin), Islamic Republic Day (12 Farvardin), Sizdah Bedar, 14 & 15 Khordad, 22 Bahman, 29 Esfand, etc.

**Hijri (Islamic)**: Tasua, Ashura, Arbaeen, Prophet's Demise, Eid al-Fitr, Eid al-Adha, Eid al-Ghadir, and more.

**Gregorian**: New Year (Jan 1), Christmas (Dec 25).

## Tech Stack & Compatibility

| Package          | Version |
| ---------------- | ------- |
| Angular          | ^20.0.0 |
| Angular Material | ^20.0.0 |
| Day.js           | ^1.11.0 |
| jalaali-js       | ^1.2.0  |
| dayjs-hijri      | ^1.0.1  |

## License

MIT License.
