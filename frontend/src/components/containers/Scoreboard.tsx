import React, { useEffect, useState } from "react";
import { ScoreboardCall } from "../../client";
import AppTable from "../layout/Table";

export default function Scoreboard() {
  const [scores, setScores] = useState<ScoreboardCall>({
    scores: [],
  });
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    getScores();
    setHeaders(["Username", "Country", "Completetion"]);
  }, []);

  function getScores(): void {
    const requestProps: RequestInit = {
      method: "GET",
      mode: "no-cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("/api/v1/scoreboard/scores", requestProps)
      .then((r) => r.json())
      .then((r: ScoreboardCall) => {
        setScores(r);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div>
      <div className="d-inline-flex my-4">
        <AppTable
          headers={headers}
          rows={scores.scores.sort(
            (a, b) =>
              Date.parse(a.endtime) -
              Date.parse(a.starttime) -
              (Date.parse(b.endtime) - Date.parse(b.starttime))
          )}
        ></AppTable>
      </div>
    </div>
  );
}
