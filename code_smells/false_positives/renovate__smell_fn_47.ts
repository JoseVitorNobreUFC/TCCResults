// @ts-nocheck
export function asTimestamp(input: unknown): Timestamp | null {
  if (input instanceof Date) {
    const date = DateTime.fromJSDate(input, { zone: 'UTC' });
    if (isValid(date)) {
      return date.toISO() as Timestamp;
    }
    return null;
  }
  if (typeof input === 'number') {
    const millisDate = DateTime.fromMillis(input, { zone: 'UTC' });
    if (isValid(millisDate)) {
      return millisDate.toISO() as Timestamp;
    }
    const secondsDate = DateTime.fromSeconds(input, { zone: 'UTC' });
    if (isValid(secondsDate)) {
      return secondsDate.toISO() as Timestamp;
    }
    return null;
  }
  if (typeof input === 'string') {
    const isoDate = DateTime.fromISO(input, { zone: 'UTC' });
    if (isValid(isoDate)) {
      return isoDate.toISO() as Timestamp;
    }
    const httpDate = DateTime.fromHTTP(input, { zone: 'UTC' });
    if (isValid(httpDate)) {
      return httpDate.toISO() as Timestamp;
    }
    const sqlDate = DateTime.fromSQL(input, { zone: 'UTC' });
    if (isValid(sqlDate)) {
      return sqlDate.toISO() as Timestamp;
    }
    const numberLikeDate = DateTime.fromFormat(input, 'yyyyMMddHHmmss', {
      zone: 'UTC',
    });
    if (isValid(numberLikeDate)) {
      return numberLikeDate.toISO() as Timestamp;
    }
    const numberLikeOffsetDate = DateTime.fromFormat(
      input,
      'yyyyMMddHHmmssZZZ',
      { zone: 'UTC' },
    );
    if (isValid(numberLikeOffsetDate)) {
      return numberLikeOffsetDate.toISO() as Timestamp;
    }
    const fallbackDate = DateTime.fromMillis(
      Date.parse(input) - timezoneOffset,
      { zone: 'UTC' },
    );
    if (isValid(fallbackDate)) {
      return fallbackDate.toISO() as Timestamp;
    }
    return null;
  }
  return null;
}