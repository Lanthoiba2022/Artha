import { format, addMonths, addYears, differenceInMonths } from 'date-fns';

export function formatDate(date: Date | number): string {
  return format(new Date(date), 'dd MMM yyyy');
}

export function formatMonthYear(date: Date | number): string {
  return format(new Date(date), 'MMM yyyy');
}

export function monthsFromNow(months: number): Date {
  return addMonths(new Date(), months);
}

export function yearsFromNow(years: number): Date {
  return addYears(new Date(), years);
}

export function getMonthsDifference(from: Date, to: Date): number {
  return differenceInMonths(to, from);
}
