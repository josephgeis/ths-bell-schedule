import {Container} from "react-bootstrap"
import {useEffect, useState} from "react";
import {getTodaySchedule} from "../schedules";

import {DateTime} from "luxon";
import {TimeTable} from "../components/TimeTable";

export default function ClockScreen() {
    let [currentTimestamp, updateTimestamp] = useState(Date.now())
    let currentDateTime: DateTime = DateTime.fromMillis(currentTimestamp)

    let schedule = getTodaySchedule(currentDateTime)
    const currentPeriod = schedule.currentPeriod(currentDateTime)
    const nextPeriod = schedule.nextPeriod(currentDateTime)

    useEffect(() => {
        // update time every second
        let interval = setInterval(() => {
            updateTimestamp(Date.now());
        }, 500);
        //
        return () => clearInterval(interval)
    }, [])

    return (
        <Container>
            <h1>{currentDateTime.toLocaleString(DateTime.TIME_SIMPLE)}</h1>
            <div className="row">
                {currentPeriod ?
                    <h2 className="col">{currentPeriod.name} <small
                        className="text-muted">Ends {currentDateTime.startOf('day').plus({
                        seconds: currentPeriod.end
                    }).toLocaleString(DateTime.TIME_SIMPLE)}</small></h2>
                    : null}
                {nextPeriod ?
                    <h2 className="col">{nextPeriod?.name} <small
                        className="text-muted">Starts {currentDateTime.startOf('day').plus({
                        seconds: nextPeriod.start
                    }).toLocaleString(DateTime.TIME_SIMPLE)}</small></h2>
                    : null}
            </div>

            <TimeTable schedule={schedule} dateTime={currentDateTime}/>
        </Container>
    )
}
