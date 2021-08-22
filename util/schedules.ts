import { DateTime } from "luxon";

type Period = {
    name: string;
    start: number;
    end: number;
    current: boolean;
};

export class Schedule {
    name: string;
    periods: [Period?];

    constructor(data) {
        Object.assign(this, data);
    }

    currentPeriod(dateTime: DateTime): Period {
        const time = dateTime
            .startOf("minute")
            .diff(dateTime.startOf("day"))
            .as("seconds");

        for (const period of this.periods) {
            if (time < period.end && time >= period.start) {
                return period;
            }
        }

        return null;
    }

    nextPeriod(dateTime: DateTime): Period {
        const time = dateTime
            .startOf("minute")
            .diff(dateTime.startOf("day"))
            .as("seconds");

        for (const period of this.periods) {
            if (time < period.start) {
                return period;
            }
        }

        return null;
    }

    previousPeriod(dateTime: DateTime): Period {
        const time = dateTime
            .startOf("minute")
            .diff(dateTime.startOf("day"))
            .as("seconds");

        for (const period of this.periods.slice().reverse()) {
            if (time >= period.end) {
                return period;
            }
        }

        return null;
    }
}

const config = require("../config");

// @ts-ignore
const schedulesContext = require.context(
    "../config",
    true,
    /(\w+)\.schedule.json$/
);
let schedules: Record<string, Schedule> = {};
schedulesContext.keys().forEach(key => {
    schedules[key.replace(/\.\/(\w+)\.schedule.json$/, "$1")] = new Schedule(
        schedulesContext(key)
    );
});

const dayMappingsContext = config.dayMappings;
let dayMappings: Record<number, Schedule> = {};
Object.keys(dayMappingsContext).forEach(key => {
    dayMappings[key] = schedules[dayMappingsContext[key]];
});

const overridesContext = config.overrides;
let overrides: Record<number, Schedule> = {};
Object.keys(overridesContext).forEach(key => {
    overrides[key] = schedules[overridesContext[key]];
});

export function getTodaySchedule(
    date: DateTime,
    name: string = undefined
): Schedule {
    const midnight = date.startOf("day").toSeconds();
    return schedules[name] || overrides[midnight] || dayMappings[date.weekday];
}

export function getScheduleNames() {
    return Object.keys(schedules).map(key => ({
        key,
        name: schedules[key].name,
    }));
}

export function getSchedulePaths() {
    return Object.keys(schedules).map(name => ({
        params: {
            name,
        },
    }));
}
