import React, { useEffect, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './timer';
import { secondsToTime } from '../utils/seconds-to-time';

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [cyclesQtdManager, setcyclesQtdManager] = useState(
    new Array(props.cycles - 1).fill(true),
  );
  const [completedCycles, setCompletedCycles] = useState(0);
  const [totalWorkingTime, settotalWorkingTime] = useState(0);
  const [PomodorosQtd, setPomodoroQtd] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (isWorking) settotalWorkingTime(totalWorkingTime + 1);
    },
    isTimerRunning ? 1000 : null,
  );

  const startWork = () => {
    setIsTimerRunning(true);
    setIsWorking(true);
    setIsResting(false);
    setMainTime(props.pomodoroTime);
  };

  const startResting = (isLongResting: boolean) => {
    setIsResting(true);
    setIsWorking(false);
    setIsTimerRunning(true);

    if (isLongResting) {
      setMainTime(props.longRestTime);
    } else {
      setMainTime(props.shortRestTime);
    }
  };

  useEffect(() => {
    if (isWorking) document.body.classList.add('working');
    if (isResting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (isWorking && cyclesQtdManager.length > 0) {
      startResting(false);
      cyclesQtdManager.pop();
    } else if (isWorking && cyclesQtdManager.length <= 0) {
      startResting(true);
      setcyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (isWorking) setPomodoroQtd(PomodorosQtd + 1);
    if (isResting) startWork();
  }, [
    isWorking,
    isResting,
    mainTime,
    startResting,
    startWork,
    setcyclesQtdManager,
    props.cycles,
    setCompletedCycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>You are: {isWorking ? 'working' : 'resting'}</h2>
      <Timer mainTime={mainTime}></Timer>
      <div className="controls">
        <Button text="Work" onClick={() => startWork()}></Button>
        <Button text="Rest" onClick={() => startResting(false)}></Button>
        <Button
          className={!isWorking && !isResting ? 'hidden' : ''}
          text={isTimerRunning ? 'Pause' : 'Play'}
          onClick={() => setIsTimerRunning(!isTimerRunning)}
        ></Button>
      </div>

      <div className="details">
        <p>Concluded Cycles: {completedCycles}</p>
        <p>Total Working Time: {secondsToTime(totalWorkingTime)}</p>
        <p>Concluded Pomodoros: {PomodorosQtd}</p>
      </div>
    </div>
  );
}
