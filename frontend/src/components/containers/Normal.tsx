import React, { useState } from "react";
import { GenerateNormalSudokuResponse } from "../../client";
import { DropdownOutput } from "../../interfaces";
import Grid from "../grid";
import AppDropdown from "../inputs/dropdown";

export default function Normal() {
  const [grid, setGrid] = useState<GenerateNormalSudokuResponse>();
  const [difficulty, setDifficulty] = useState<string>("easy");
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
    fetch("/api/v1/generate/sudoku?difficulty=" + difficulty, requestProps)
      .then((r) => r.json())
      .then((r: GenerateNormalSudokuResponse) => {
        setGrid(r);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function onComplete(): void {
    return;
  }
  return (
    <div>
      <div className="d-inline-flex my-4">
        <div className="mr-4">
          <AppDropdown
            id="1"
            variant="info"
            title="Difficulty"
            selectables={["easy", "medium", "hard", "extreme"]}
            indexSelected={1}
            onSelect={(e: DropdownOutput) => setDifficulty(e.value)}
          ></AppDropdown>
        </div>
        <button className="btn btn-primary" onClick={() => generateSudoku()}>
          {"Generate " + difficulty + " sudoku"}
        </button>
      </div>
      <div></div>
      <div className="d-inline-flex ml-auto mr-auto">
        {!!grid ? (
          <Grid
            key={JSON.stringify(grid)}
            onComplete={() => onComplete()}
            rows={grid.rows}
          ></Grid>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
