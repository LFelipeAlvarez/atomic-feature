import { useState, useEffect } from "react";

const useTimer = (condition: boolean) => {

    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;
        if (condition) {
            intervalId = setInterval(() => {
                setTimer((timer) => timer + 1);
            }, 1000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [condition]);


    const restart = () => {
        setTimer(0);
    }


    return { timer, restart }

}

export default useTimer