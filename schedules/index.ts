import {DateTime} from 'luxon';

type Period = {
    name: string,
    start: number,
    end: number,
    current: boolean
}

type PeriodList = [Period?]

export class Schedule {
    name: string;
    periods: [Period?];

    constructor(data) {
        Object.assign(this, data);
    }

    currentPeriod(dateTime: DateTime): Period {
        const time = (dateTime - dateTime.startOf('day')) / 1000

        for (const period of this.periods) {
            if (time < period.end && time >= period.start) {
                return period
            }
        }

        return null;
    }
}

const schedules: Record<string, Schedule> = {
    evenBlock: new Schedule(require("./evenBlock.json")),
    oddBlock: new Schedule(require("./oddBlock.json")),
    traditional: new Schedule(require('./traditional.json')),
    empty: new Schedule({name: "No Schedule", periods: []})
}


const dayMappings: Record<number, Schedule> = {
    0: schedules.empty,
    1: schedules.empty,
    2: schedules.evenBlock,
    3: schedules.oddBlock,
    4: schedules.evenBlock,
    5: schedules.oddBlock,
    6: schedules.empty
}

export function getTodaySchedule(date): Schedule {
    return dayMappings[date.weekday]
}
