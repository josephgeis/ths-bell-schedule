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
            <h2>{currentPeriod?.name} <small className="text-muted">{currentPeriod ? "Ends " + currentDateTime.startOf('day').plus({
                seconds: currentPeriod.end
            }).toLocaleString(DateTime.TIME_SIMPLE) : null}</small></h2>
            <TimeTable schedule={schedule} dateTime={currentDateTime}/>
        </Container>
    )
}
