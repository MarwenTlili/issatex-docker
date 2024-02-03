/**
 * convert timestamp to Locale ISO String
 * @param timestamp number
 * @returns string
 */
export function toLocaleIso(timestamp: number, tz: string = 'Africa/Tunis') {
    const dateLocale = new Date(timestamp).toLocaleString("en-US", { timeZone: tz })
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

/**
 * check if the given string 'str' is Uppercase and have no spaces
 * @param str string
 * @returns boolean
 */
export function isUppercase(str: string | undefined) {
    if (str == str?.toUpperCase()) {
        return true;
    }
    return false;
}

export function hasSpaces(str: string | undefined) {
    if (str?.indexOf(' ') === -1) {
        return false;
    }
    return true;
}

export function isDateTimeString(str: string | undefined) {
    if (!str) return false

    // Try to create a Date object from the string
    const date = new Date(str);

    // Check if the Date object is valid (datetime) and the input string is not "Invalid Date"
    return !isNaN(date.getTime()) && date.toString() !== "Invalid Date" && /\d{2}:\d{2}/.test(str);
}

/**
 * 
 * @param date
 * @returns string
 * @example 2023-07-26T00:00:00+00:00 => 2023-07-26T00:00
 */
export const formatDateForInput = (date: string | undefined) => {
    if (!date) return undefined;
    const formattedDate = new Date(date).toISOString().slice(0, 16);

    return formattedDate;
}
