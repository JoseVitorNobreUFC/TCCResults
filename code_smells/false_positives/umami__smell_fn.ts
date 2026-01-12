// @ts-nocheck
export function parseDateRange(value: string, locale = 'en-US', timezone?: string): DateRange {
  if (typeof value !== 'string') {
    return null;
  }
  if (value.startsWith('range')) {
    const [, startTime, endTime] = value.split(':');
    const startDate = new Date(+startTime);
    const endDate = new Date(+endTime);
    const unit = getMinimumUnit(startDate, endDate);
    return {
      startDate,
      endDate,
      value,
      ...parseDateValue(value),
      unit,
    };
  }
  const date = new Date();
  const now = timezone ? utcToZonedTime(date, timezone) : date;
  const dateLocale = getDateLocale(locale);
  const { num = 1, unit } = parseDateValue(value);
  switch (unit) {
    case 'hour':
      return {
        startDate: num ? subHours(startOfHour(now), num) : startOfHour(now),
        endDate: endOfHour(now),
        offset: 0,
        num: num || 1,
        unit,
        value,
      };
    case 'day':
      return {
        startDate: num ? subDays(startOfDay(now), num) : startOfDay(now),
        endDate: endOfDay(now),
        unit: num ? 'day' : 'hour',
        offset: 0,
        num: num || 1,
        value,
      };
    case 'week':
      return {
        startDate: num
          ? subWeeks(startOfWeek(now, { locale: dateLocale }), num)
          : startOfWeek(now, { locale: dateLocale }),
        endDate: endOfWeek(now, { locale: dateLocale }),
        unit: 'day',
        offset: 0,
        num: num || 1,
        value,
      };
    case 'month':
      return {
        startDate: num ? subMonths(startOfMonth(now), num) : startOfMonth(now),
        endDate: endOfMonth(now),
        unit: num ? 'month' : 'day',
        offset: 0,
        num: num || 1,
        value,
      };
    case 'year':
      return {
        startDate: num ? subYears(startOfYear(now), num) : startOfYear(now),
        endDate: endOfYear(now),
        unit: 'month',
        offset: 0,
        num: num || 1,
        value,
      };
  }
}