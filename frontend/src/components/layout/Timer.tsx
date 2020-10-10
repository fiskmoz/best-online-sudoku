import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { TimerProps } from "../../interfaces";

export default function AppTimer(props: TimerProps) {
  const [timer, setTimer] = useState(props.startValue);

  useEffect(() => {
    !props.paused && setTimeout(() => setTimer(timer + 1), 1000);
  }, [timer, props.paused]);

  return (
    <Card className="text-center my-auto p-3">
      {new Date(1000 * timer).toISOString().substr(11, 8)}
    </Card>
  );
}
