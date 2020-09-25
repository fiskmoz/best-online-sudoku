import React, { useState } from "react";
import { GenerateNormalSudokuResponse } from "../../client";
import Grid from "../grid";

export default function Normal() {
  const [grid, setGrid] = useState<GenerateNormalSudokuResponse>();
  const requestProps: RequestInit = {
    method: "GET",
    mode: "no-cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  };
  function generateSudoku(): void {
    fetch("/api/v1/generate/sudoku?difficulty=hard", requestProps)
      .then((r) => r.json())
      .then((r: GenerateNormalSudokuResponse) => {
        setGrid(r);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <div>
      <div className="my-4">
        <button className="btn btn-primary" onClick={() => generateSudoku()}>
          Generate Sudoku
        </button>
      </div>
      <div className="d-inline-flex ml-auto mr-auto">
        {!!grid ? (
          <Grid key={JSON.stringify(grid)} rows={grid.rows}></Grid>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
