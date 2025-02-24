import type { DateAdapter, DateTimeUnit } from '@interfaces/index';
import { DateTime } from 'luxon';

export class LuxonDateAdapter implements DateAdapter {
  now(): Date {
    return DateTime.now().setZone('America/El_Salvador').toJSDate();
  }

  nowUnix(): number {
    return DateTime.now().toUnixInteger();
  }

  format(date: Date, format: string): string {
    return DateTime.fromJSDate(date).toFormat(format, { locale: 'es' });
  }

  addMinutes(date: Date, minutes: number): Date {
    return DateTime.fromJSDate(date).plus({ minutes }).toJSDate();
  }

  subtractMinutes(date: Date, minutes: number): Date {
    return DateTime.fromJSDate(date).minus({ minutes }).toJSDate();
  }

  addDays(date: Date, days: number): Date {
    return DateTime.fromJSDate(date).plus({ days }).toJSDate();
  }

  subtractDays(date: Date, days: number): Date {
    return DateTime.fromJSDate(date).minus({ days }).toJSDate();
  }

  addMonths(date: Date, months: number): Date {
    return DateTime.fromJSDate(date).plus({ months }).toJSDate();
  }

  subtractMonths(date: Date, months: number): Date {
    return DateTime.fromJSDate(date).minus({ months }).toJSDate();
  }

  addYears(date: Date, years: number): Date {
    return DateTime.fromJSDate(date).plus({ years }).toJSDate();
  }

  subtractYears(date: Date, years: number): Date {
    return DateTime.fromJSDate(date).minus({ years }).toJSDate();
  }

  parse(dateString: string, format: string): Date {
    return DateTime.fromFormat(dateString, format).toJSDate();
  }

  differenceInDays(dateLeft: Date, dateRight: Date): number {
    const left = DateTime.fromJSDate(dateLeft);
    const right = DateTime.fromJSDate(dateRight);
    return left.diff(right, 'days').days;
  }

  differenceInDaysStartOf(dateLeft: Date, dateRight: Date, startOf: DateTimeUnit): number {
    const left = DateTime.fromJSDate(dateLeft).startOf(startOf);
    const right = DateTime.fromJSDate(dateRight).startOf(startOf);
    return left.diff(right, 'days').days;
  }

  toISO(date: Date): string | null {
    return DateTime.fromJSDate(date).toISO();
  }

  startOfDay(date: Date): Date {
    return DateTime.fromJSDate(date).startOf('day').toJSDate();
  }

  endOfDay(date: Date): Date {
    return DateTime.fromJSDate(date).endOf('day').toJSDate();
  }

  isBefore(date: Date, comparisonDate: Date): boolean {
    return (
      DateTime.fromJSDate(date).toMillis() <
      DateTime.fromJSDate(comparisonDate).toMillis()
    );
  }

  isAfter(date: Date, comparisonDate: Date): boolean {
    return (
      DateTime.fromJSDate(date).toMillis() >
      DateTime.fromJSDate(comparisonDate).toMillis()
    );
  }

  toUTC(date: Date): Date {
    return DateTime.fromJSDate(date).toUTC().toJSDate();
  }

  fromUTC(date: Date): Date {
    return DateTime.fromJSDate(date).toLocal().toJSDate();
  }

  fromISO(date: string): Date {
    return DateTime.fromISO(date).toJSDate();
  }

  setTimeZone(date: Date, timeZone: string): Date {
    return DateTime.fromJSDate(date).setZone(timeZone).toJSDate();
  }

  getTimeZone(date: Date): string | null {
    return DateTime.fromJSDate(date).zoneName;
  }
}
