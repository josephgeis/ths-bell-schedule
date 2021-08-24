import styles from "../styles/SchedulesList.module.css";
import Link from "next/link";

export default function SchedulesList({
    availableSchedules,
}: {
    availableSchedules: { key: string; name: string }[];
}) {
    return (
        <ul className={styles.schedulesList}>
            {availableSchedules.length ? (
                <li>
                    <strong>Other schedules</strong>
                </li>
            ) : null}
            {availableSchedules.map(({ key, name }) => (
                <li>
                    <Link href={`/${key}`}>{name}</Link>
                </li>
            ))}
        </ul>
    );
}
