import ClockScreen from "./index";
import { getSchedulePaths } from "../util/schedules";

export default function ManualClockScreen(
    { scheduleName }: { scheduleName: string } = { scheduleName: null }
) {
    return <ClockScreen scheduleName={scheduleName} />;
}

export async function getStaticProps(context) {
    const { name } = context.params;
    return {
        props: {
            scheduleName: name,
        },
    };
}

export async function getStaticPaths() {
    return {
        paths: getSchedulePaths(),
        fallback: false,
    };
}
