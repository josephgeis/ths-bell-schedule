import {Container} from "react-bootstrap"
import {useEffect, useState} from "react";
import {getTodaySchedule} from "../util/schedules";

import {DateTime} from "luxon";
import {TimeTable} from "../components/TimeTable";
import Head from "next/head";

export default function ClockScreen() {

    let [currentTimestamp, updateTimestamp] = useState(Date.now())
    const currentDateTime: DateTime = DateTime.fromMillis(currentTimestamp).setZone("America/Los_Angeles")
    const currentMinuteSeconds = currentDateTime.startOf("minute").diff(currentDateTime.startOf("day")).as("seconds")

    const schedule = getTodaySchedule(currentDateTime)
    const currentPeriod = schedule?.currentPeriod(currentDateTime)
    const nextPeriod = schedule?.nextPeriod(currentDateTime)
    const previousPeriod = schedule?.previousPeriod(currentDateTime)

    const timeString = currentDateTime.toLocaleString(DateTime.TIME_SIMPLE)

    const onPeriodBoundary = ((currentPeriod?.start == currentMinuteSeconds)
        || (previousPeriod?.end == currentMinuteSeconds))

    useEffect(() => {
        // update time every second
        const interval = setInterval(() => {
            updateTimestamp(Date.now());
        }, 500);
        //
        return () => clearInterval(interval)
    }, [])

    return (
        <Container>
            <Head>
                <title>{timeString}{currentPeriod ? ` - ${currentPeriod.name}` : null} {onPeriodBoundary ? "🔔" : null}</title>
                <meta property="og:title" content="THS Bell Schedule" key="title"/>
            </Head>
            <h1>{timeString} {onPeriodBoundary ? "🔔" : null}</h1>
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
            {schedule ? <h3>{schedule.name}</h3> : null}

            {schedule ?
                <TimeTable schedule={schedule} dateTime={currentDateTime}/>
                : null}
        </Container>
    )
}
