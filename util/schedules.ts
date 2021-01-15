import {DateTime} from 'luxon';

type Period = {
    name: string,
    start: number,
    end: number,
    current: boolean
}

export class Schedule {
    name: string;
    periods: [Period?];

    constructor(data) {
        Object.assign(this, data);
    }

    currentPeriod(dateTime: DateTime): Period {
        const time = dateTime.startOf("minute").diff(dateTime.startOf("day")).as("seconds")

        for (const period of this.periods) {
            if (time < period.end && time >= period.start) {
                return period
            }
        }

        return null;
    }

    nextPeriod(dateTime: DateTime): Period {
        const time = dateTime.startOf("minute").diff(dateTime.startOf("day")).as("seconds")

        for (const period of this.periods) {
            if (time < period.start) {
                return period
            }
        }

        return null;
    }

    previousPeriod(dateTime: DateTime): Period {
        const time = dateTime.startOf("minute").diff(dateTime.startOf("day")).as("seconds")

        for (const period of this.periods.reverse()) {
            if (time >= period.end) {
                return period
            }
        }

        return null;
    }
}

// @ts-ignore
const schedulesContext = require.context("../schedules", true, /(\w+)\.schedule.json$/);
let schedules: Record<string, Schedule> = {}
schedulesContext.keys().forEach(function (key) {
    schedules[key.replace(/\.\/(\w+)\.schedule.json$/, '$1')] = new Schedule(schedulesContext(key))
});

const dayMappingsContext = require("../schedules/dayMappings.json");
let dayMappings: Record<number, Schedule> = {}
Object.keys(dayMappingsContext).forEach(function(key) {
    dayMappings[key] = schedules[dayMappingsContext[key]]
})

const overridesContext = require("../schedules/overrides.json");
let overrides: Record<number, Schedule> = {}
Object.keys(overridesContext).forEach(function(key) {
    overrides[key] = schedules[overridesContext[key]]
})

export function getTodaySchedule(date: DateTime): Schedule {
    const midnight = date.startOf("day").toSeconds()
    return overrides[midnight] || dayMappings[date.weekday]
}
