import { useState, useEffect, useRef } from 'react';
import styles from './ProgressInput.module.css';
import ProgressLabel from '../ProgressLabel/ProgressLabel';

const progressSteps = [25, 50, 75, 100];

export default function ProgressInput({ currency }: { currency: string }) {
    const inputRef = useRef<HTMLDivElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    const [inputValue, setInputValue] = useState("");
    const [progress, setProgress] = useState(0);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const div = e.currentTarget;

        if (div.innerHTML.includes('<br>')) {
            div.innerHTML = div.innerHTML.replace(/<br>/g, "");
        }

        if (inputRef.current) {
            setInputValue(inputRef.current.innerText);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!/^\d$|Backspace|ArrowLeft|ArrowRight|Delete/.test(e.key)) {
            e.preventDefault(); // Block non-numeric input
        }
    };

    useEffect(() => {
        if (spanRef.current && inputRef.current) {
            const inputWidth = Number(inputRef.current.offsetWidth);
            const spanWidth = Number(spanRef.current.offsetWidth);
            const newProgress = Math.round((spanWidth / inputWidth) * 100);

            setProgress(newProgress);
        }

    }, [inputValue]);

    return (
        <div className={styles.container}>
            <div className="relative">
                <span ref={spanRef} className={styles.hiddenSpan}>
                    {inputValue || ""}
                </span>
                <div
                    ref={inputRef}
                    contentEditable={true}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    inputMode="numeric"
                    aria-label="Enter numbers only"
                    className={`w-full focus:outline-none border-gray-300 ${styles.editable}`}
                    style={{ ['--currency']: `"${currency}"` } as React.CSSProperties}
                />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.progress}>
                {progressSteps.map((step, i) => {
                    const prevStep = progressSteps[i - 1] || 0
                    const nextStep = progressSteps[i + 1] || 100
                    let labelProgress = (progress - prevStep) / (step - prevStep) * 100;

                    if (progress > step && progress > nextStep) {
                        labelProgress = 100;
                    }

                    if (progress < step && progress < prevStep) {
                        labelProgress = 0;
                    }

                    return (
                        <ProgressLabel
                            key={i}
                            label={`${step}%`}
                            progress={labelProgress}
                        />
                    )
                })}
            </div>
        </div>
    );
}
