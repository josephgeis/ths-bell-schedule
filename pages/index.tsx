import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getTodaySchedule } from "../util/schedules";

import { DateTime } from "luxon";
import { TimeTable } from "../components/TimeTable";
import Head from "next/head";

import Sound from "react-sound";

// @ts-ignore
import { name as appName } from "../config";

export default function ClockScreen(
    { scheduleName }: { scheduleName: string } = { scheduleName: null }
) {
    let [showContent, updateVisibility] = useState(false);

    let [currentTimestamp, updateTimestamp] = useState(Date.now());
    const currentDateTime: DateTime = DateTime.fromMillis(
        currentTimestamp
    ).setZone("America/Los_Angeles");
    const currentMinuteSeconds = currentDateTime
        .startOf("minute")
        .diff(currentDateTime.startOf("day"))
        .as("seconds");

    const schedule = getTodaySchedule(currentDateTime, scheduleName);
    const currentPeriod = schedule?.currentPeriod(currentDateTime);
    const nextPeriod = schedule?.nextPeriod(currentDateTime);
    const previousPeriod = schedule?.previousPeriod(currentDateTime);

    const timeString = currentDateTime.toLocaleString(DateTime.TIME_SIMPLE);

    const onPeriodBoundary =
        currentPeriod?.start == currentMinuteSeconds ||
        previousPeriod?.end == currentMinuteSeconds;
    let [lastSoundTime, updateLastSoundTime] = useState(-1);

    useEffect(() => {
        // update time every second
        updateVisibility(true);
        const interval = setInterval(() => {
            updateTimestamp(Date.now());
        }, 500);
        //
        return () => clearInterval(interval);
    }, []);

    return showContent ? (
        <Container>
            <Head>
                <title>
                    {onPeriodBoundary ? "🔔" : null}{" "}
                    {currentPeriod ? `${currentPeriod.name} -` : null}{" "}
                    {timeString}
                </title>
                <meta property="og:title" content={appName} key="title" />
                <link rel="preload" href="ding.wav" type="audio/x-wav" />
            </Head>
            <h1>
                {timeString} {onPeriodBoundary ? "🔔" : null}
            </h1>
            <div className="row">
                {currentPeriod ? (
                    <h2 className="col">
                        {currentPeriod.name}{" "}
                        <small className="text-muted">
                            Ends{" "}
                            {currentDateTime
                                .startOf("day")
                                .plus({
                                    seconds: currentPeriod.end,
                                })
                                .toLocaleString(DateTime.TIME_SIMPLE)}
                        </small>
                    </h2>
                ) : null}
                {nextPeriod ? (
                    <h2 className="col">
                        {nextPeriod?.name}{" "}
                        <small className="text-muted">
                            Starts{" "}
                            {currentDateTime
                                .startOf("day")
                                .plus({
                                    seconds: nextPeriod.start,
                                })
                                .toLocaleString(DateTime.TIME_SIMPLE)}
                        </small>
                    </h2>
                ) : null}
            </div>
            {schedule ? <h3>{schedule.name}</h3> : null}

            {schedule ? (
                <TimeTable schedule={schedule} dateTime={currentDateTime} />
            ) : null}

            {onPeriodBoundary && lastSoundTime != currentMinuteSeconds ? (
                <Sound
                    url="ding.wav"
                    onFinishedPlaying={() => {
                        updateLastSoundTime(currentMinuteSeconds);
                    }}
                    playStatus={Sound.status.PLAYING}
                    autoLoad={true}
                />
            ) : null}
            <footer>
                <strong>{appName}</strong>{" "}
                <span className="text-muted">
                    Made by <a href="https://josephgeis.dev">Joseph Geis</a>,
                    Open Source on{" "}
                    <a href="https://github.com/juniorRubyist/ths-bell-schedule">
                        GitHub
                    </a>
                </span>
            </footer>
        </Container>
    ) : (
        <Head>
            <meta property="og:title" content={appName} key="title" />
            <title>{appName}</title>
            <link rel="preload" href="ding.wav" type="audio/x-wav" />
        </Head>
    );
}
