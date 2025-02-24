

export type DateTimeUnit = "year" | "quarter" | "month" | "week" | "day" | "hour" | "minute" | "second" | "millisecond";

export interface DateAdapter {
    now(): Date;
    nowUnix(): number;
    format(date: Date, format: string): string;
    addMinutes(date: Date, minutes: number): Date;
    subtractMinutes(date: Date, minutes: number): Date;
    addDays(date: Date, days: number): Date;
    subtractDays(date: Date, days: number): Date;
    addMonths(date: Date, months: number): Date;
    subtractMonths(date: Date, months: number): Date;
    addYears(date: Date, years: number): Date;
    subtractYears(date: Date, years: number): Date;
    parse(dateString: string, format: string): Date;
    differenceInDays(dateLeft: Date, dateRight: Date): number;
    differenceInDaysStartOf(dateLeft: Date, dateRight: Date, startOf: DateTimeUnit): number;
    toISO(date: Date): string | null;
    startOfDay(date: Date): Date;
    endOfDay(date: Date): Date;
    isBefore(date: Date, comparisonDate: Date): boolean;
    isAfter(date: Date, comparisonDate: Date): boolean;
    toUTC(date: Date): Date;
    fromUTC(date: Date): Date;
    fromISO(date: string): Date;
    setTimeZone(date: Date, timeZone: string): Date;
    getTimeZone(date: Date): string | null;
  }
  