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
