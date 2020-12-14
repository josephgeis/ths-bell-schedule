import {Table} from "react-bootstrap";
import {DateTime} from 'luxon';
import {Schedule} from '../util/schedules'
import {toBase64} from "next/dist/next-server/lib/to-base-64";

export function TimeTableBlock({block, dateTime, ...props}) {
    return (
        <tr {...props}>
            <td>{block.name}</td>
            <td>{dateTime.startOf('day').plus({seconds: block.start}).toLocaleString(DateTime.TIME_SIMPLE)}</td>
            <td>{dateTime.startOf('day').plus({seconds: block.end}).toLocaleString(DateTime.TIME_SIMPLE)}</td>
        </tr>
    )
}

export function TimeTable({schedule, dateTime, ...props}: {schedule: Schedule, dateTime: DateTime}) {
    return (
        <Table bordered {...props}>
            <thead>
                <tr>
                    <th>Period</th>
                    <th>Start</th>
                    <th>End</th>
                </tr>
            </thead>
            <tbody>
                {schedule.periods.map((block) => (
                    <TimeTableBlock block={block} dateTime={dateTime} key={toBase64(`${block.name}.${block.start}.${block.end}`)}/>
                ))}
            </tbody>
        </Table>
    )
}
