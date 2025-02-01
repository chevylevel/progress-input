import { FC, useEffect, useRef, useState } from 'react';
import styles from './ProgressLabel.module.css';

interface ProgressLabelProps {
    label: string;
    progress: number;
}

const ProgressLabel: FC<ProgressLabelProps> = ({
    label,
    progress,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const [labelProgress, setLabelProgress] = useState<number>(0);

    useEffect(() => {
        if (containerRef.current && labelRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const labelRect = labelRef.current.getBoundingClientRect();

            const progressMeetsLabelPercent = (labelRect.left - containerRect.left)
                / containerRect.width * 100;
            const labelFullPercent = (labelRect.left - containerRect.left + labelRect.width)
                / containerRect.width * 100;

            const ratio = labelRect.width / containerRect.width * 100;

            if (progress < progressMeetsLabelPercent) {
                setLabelProgress(0);

            }
            if (progress > labelFullPercent) {
                setLabelProgress(100);
            }
            if (progress > progressMeetsLabelPercent && progress < labelFullPercent) {
                setLabelProgress(50 + ((progress - 50) * 100 / ratio));
            }
        }
    }, [progress]);


    return (
        <div
            ref={containerRef}
            className={styles.container}
            style={{
                ['--border-color']: progress >= 100 ? '#168ACD' : '#7A7A7A',
                background: `linear-gradient(to right, #168ACD ${progress}%, transparent ${progress}%)`,
            } as React.CSSProperties}
        >
            <div
                ref={labelRef}
                className={styles.label}
                style={{ ['--progress']: `${labelProgress}%` } as React.CSSProperties}
            >
                {label}
            </div>
        </div>
    );
}

export default ProgressLabel;
