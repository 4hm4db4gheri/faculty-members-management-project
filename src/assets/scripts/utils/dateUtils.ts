/**
 * Utility functions for converting between Gregorian and Jalali (Solar/Persian) calendars
 */

/**
 * Convert Gregorian date to Jalali (Solar) date
 * @param gregorianDate - Date object or ISO string (e.g., "2025-07-09T16:15:14.157931Z")
 * @returns Jalali date in format "YYYY/MM/DD"
 */
export function gregorianToJalali(gregorianDate: Date | string): string {
    const date = typeof gregorianDate === "string" ? new Date(gregorianDate) : gregorianDate;

    // Extract only date part, ignore time
    const gy = date.getFullYear();
    const gm = date.getMonth() + 1;
    const gd = date.getDate();

    const { jy, jm, jd } = gregorianToJalaliNumbers(gy, gm, gd);

    // Format with leading zeros - Year/Month/Day format
    const jyStr = jy.toString();
    const jmStr = jm.toString().padStart(2, "0");
    const jdStr = jd.toString().padStart(2, "0");

    return `${jyStr}/${jmStr}/${jdStr}`;
}

/**
 * Convert Jalali (Solar) date to Gregorian date
 * @param jalaliDate - Jalali date in format "YYYY/MM/DD"
 * @returns Date object (at midnight UTC)
 */
export function jalaliToGregorian(jalaliDate: string): Date {
    const parts = jalaliDate.split("/");
    if (parts.length !== 3) {
        throw new Error("Invalid Jalali date format. Expected YYYY/MM/DD");
    }

    const jy = parseInt(parts[0]);
    const jm = parseInt(parts[1]);
    const jd = parseInt(parts[2]);

    const { gy, gm, gd } = jalaliToGregorianNumbers(jy, jm, jd);

    // Return date at midnight UTC
    return new Date(Date.UTC(gy, gm - 1, gd, 0, 0, 0, 0));
}

/**
 * Core conversion algorithm from Gregorian to Jalali
 */
function gregorianToJalaliNumbers(gy: number, gm: number, gd: number): { jy: number; jm: number; jd: number } {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

    let jy: number;
    if (gy > 1600) {
        jy = 979;
        gy -= 1600;
    } else {
        jy = 0;
        gy -= 621;
    }

    const gy2 = gm > 2 ? gy + 1 : gy;
    let days =
        365 * gy +
        Math.floor((gy2 + 3) / 4) -
        Math.floor((gy2 + 99) / 100) +
        Math.floor((gy2 + 399) / 400) -
        80 +
        gd +
        g_d_m[gm - 1];

    jy += 33 * Math.floor(days / 12053);
    days %= 12053;

    jy += 4 * Math.floor(days / 1461);
    days %= 1461;

    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }

    let jm: number;
    let jd: number;

    if (days < 186) {
        jm = 1 + Math.floor(days / 31);
        jd = 1 + (days % 31);
    } else {
        jm = 7 + Math.floor((days - 186) / 30);
        jd = 1 + ((days - 186) % 30);
    }

    return { jy, jm, jd };
}

/**
 * Core conversion algorithm from Jalali to Gregorian
 */
function jalaliToGregorianNumbers(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
    let gy: number;
    if (jy > 979) {
        gy = 1600;
        jy -= 979;
    } else {
        gy = 621;
    }

    const days =
        365 * jy +
        Math.floor(jy / 33) * 8 +
        Math.floor(((jy % 33) + 3) / 4) +
        78 +
        jd +
        (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

    gy += 400 * Math.floor(days / 146097);
    let remainingDays = days % 146097;

    if (remainingDays >= 36525) {
        remainingDays--;
        gy += 100 * Math.floor(remainingDays / 36524);
        remainingDays %= 36524;

        if (remainingDays >= 365) {
            remainingDays++;
        }
    }

    gy += 4 * Math.floor(remainingDays / 1461);
    remainingDays %= 1461;

    if (remainingDays >= 366) {
        remainingDays--;
        gy += Math.floor(remainingDays / 365);
        remainingDays = remainingDays % 365;
    }

    let gd = remainingDays + 1;

    const sal_a = [
        0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
        31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
    ];

    let gm: number;
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) {
        gd -= sal_a[gm];
    }

    return { gy, gm, gd };
}

/**
 * Convert English digits to Persian digits
 */
export function toPersianDigits(str: string): string {
    return str
        .replace(/0/g, "۰")
        .replace(/1/g, "۱")
        .replace(/2/g, "۲")
        .replace(/3/g, "۳")
        .replace(/4/g, "۴")
        .replace(/5/g, "۵")
        .replace(/6/g, "۶")
        .replace(/7/g, "۷")
        .replace(/8/g, "۸")
        .replace(/9/g, "۹");
}

/**
 * Extract date-only string (YYYY-MM-DD) from ISO date string
 * Ignores time component
 */
export function extractDateOnly(isoDateString: string): string {
    return isoDateString.split("T")[0];
}

