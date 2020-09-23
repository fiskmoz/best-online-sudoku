import React, { useState } from "react";
import { GridPosition, GridProps } from "../interfaces";
import Cell from "./cell";
import Selector from "./selector";

export default function Grid(props: GridProps) {
  const [grid, setGrid] = useState<number[][]>(props.rows);
  const [selected, setSelected] = useState<number>(1);
  function handleCellClick(e: GridPosition) {
    setGrid(
      grid.map((r: number[]) => {
        return r.map((n: number, index: number) => {
          if (grid.indexOf(r) === e.x && e.y === index) {
            return selected;
          }
          return n;
        });
      })
    );
  }

  function isCellLocked(e: GridPosition, value: number): boolean {
    let found: boolean = false;
    props.rows.forEach((r: number[]) => {
      r.forEach((n: number, index: number) => {
        if (
          props.rows.indexOf(r) === e.x &&
          e.y === index &&
          !!value &&
          n === value
        ) {
          console.log("LOCK IT DOWN");
          found = true;
        }
      });
    });
    return found;
  }

  const rows = grid.map((r: number[]) => {
    return (
      <div className="d-flex" key={grid.indexOf(r)}>
        {r.map((n: number, index: number) => {
          const position: GridPosition = {
            x: grid.indexOf(r),
            y: index,
          };
          const locked: boolean = isCellLocked(position, n);
          return (
            <Cell
              locked={locked}
              value={n}
              key={position.x.toString() + "" + position.y.toString()}
              position={position}
              onCellClick={(e: GridPosition) => handleCellClick(e)}
            ></Cell>
          );
        })}
      </div>
    );
  });
  return (
    <div>
      {rows}
      <br />
      <Selector
        values={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        selected={selected}
        onSelect={(e: number) => setSelected(e)}
      ></Selector>
    </div>
  );
}
