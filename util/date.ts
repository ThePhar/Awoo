import * as DateFNS from "date-fns";

/**
 * Returns the next morning time.
 */
export function getNextMorning(): Date {
    const morningToday = DateFNS.set(Date.now(), { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 });

    // If we are already past the morning time for today, use tomorrow.
    if (DateFNS.isAfter(morningToday, Date.now())) {
        return DateFNS.add(morningToday, { days: 1 });
    }

    return morningToday;
}

/**
 * Returns the next evening time.
 */
export function getNextNight(): Date {
    const eveningToday = DateFNS.set(Date.now(), { hours: 20, minutes: 0, seconds: 0, milliseconds: 0 });

    // If we are already past the evening time for today, use tomorrow.
    if (DateFNS.isAfter(eveningToday, Date.now())) {
        return DateFNS.add(eveningToday, { days: 1 });
    }

    return eveningToday;
}
