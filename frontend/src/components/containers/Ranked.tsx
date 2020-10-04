import React, { useContext, useState } from "react";
import {
  RankedBase,
  RankedSudokuCallEnd,
  RankedSudokuResponseStart,
} from "../../client";
import { AppContext, DropdownOutput } from "../../interfaces";
import Grid from "../grid";
import Context from "../../context/state";

export default function Ranked() {
  const [grid, setGrid] = useState<RankedSudokuResponseStart>();
  const context: AppContext = useContext(Context);
  const baseRequestData: RankedBase = {
    jwt: !!context.jwt ? context.jwt : "",
    email: !!context.email ? context.email : "",
  };

  function generateSudoku(): void {
    const requestProps: RequestInit = {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(baseRequestData),
    };
    fetch("/api/v1/generate/ranked/start", requestProps)
      .then((r) => r.json())
      .then((r: RankedSudokuResponseStart) => {
        setGrid(r);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function sudokuComplete(): void {
    const requestEndData: RankedSudokuCallEnd = {
      jwt: baseRequestData.jwt,
      email: baseRequestData.email,
      token: !!grid ? grid.token : "",
      id: !!grid ? grid.id : "",
      rows: !!grid ? grid.rows : [],
    };
    const requestProps: RequestInit = {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestEndData),
    };
    fetch("/api/v1/generate/ranked/end", requestProps)
      .then((r) => r.json())
      .then((r: RankedSudokuResponseStart) => {
        setGrid(r);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <div>
      <div className="d-inline-flex my-4">
        <button className="btn btn-primary" onClick={() => generateSudoku()}>
          {"Start"}
        </button>
      </div>
      <div></div>
      <div className="d-inline-flex ml-auto mr-auto">
        {!!grid ? (
          <Grid
            key={JSON.stringify(grid)}
            onComplete={() => sudokuComplete()}
            rows={grid.rows}
          ></Grid>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
