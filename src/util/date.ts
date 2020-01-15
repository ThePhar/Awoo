import moment from "moment";

export function getNextMorning(): moment.Moment {
    const morning = moment();

    // Set the hour and minutes to a specific time.
    morning.hour(8);
    morning.minute(0);
    morning.second(0);
    morning.millisecond(0);

    // If we are already past the morning time for today, use tomorrow.
    if (moment().isAfter(morning)) {
        morning.add(1, "days");
    }

    return morning;
}
export function getNextNight(): moment.Moment {
    const night = moment();

    // Set the hour and minutes to a specific time.
    night.hour(20);
    night.minute(0);
    night.second(0);
    night.millisecond(0);

    // If we are already past the night time for today, use tomorrow.
    if (moment().isAfter(night)) {
        night.add(1, "days");
    }

    return night;
}
