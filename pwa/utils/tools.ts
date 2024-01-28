/**
 * convert timestamp to Locale ISO String
 * @param timestamp number
 * @returns string
 */
export function toLocaleIso(timestamp: number, tz: string = 'Africa/Tunis') {
    const dateLocale = new Date(timestamp).toLocaleString("en-US", {timeZone: tz})
    const dateLocaleIso = new Date(dateLocale).toISOString()
    return dateLocale
}

/**
 * add a week to originalDate and return it
 * @param originalDate: Date
 * @returns Date
 * @example
 * const currentDate = new Date('2023-12-27T17:52:15+00:00')
 * const nextWeek = addWeek(currentDate)
 */
export function addWeek(originalDate: Date): Date {
    // Make a copy of the original date to avoid modifying it directly
    let newDate = new Date(originalDate);

    // Add 7 days to the new date
    newDate.setDate(originalDate.getDate() + 7);

    // Return the new date
    return newDate;
}
