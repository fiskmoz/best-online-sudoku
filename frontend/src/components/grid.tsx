import React, { useState } from "react";
import { BoardModes, GridCell, GridPosition, GridProps } from "../interfaces";
import Cell from "./cell";
import Selector from "./selector";

export default function Grid(props: GridProps) {
  const [grid, setGrid] = useState<GridCell[][]>(parseGrid(props));
  const [selected, setSelected] = useState<number>(1);
  const [mode, setMode] = useState<BoardModes>("place");

  function handleCellClick(e: GridPosition) {
    setGrid(
      grid.map((r: GridCell[]) => {
        return r.map((n: GridCell) => {
          if (n.position === e) {
            if (mode === "note") {
              const newNotes = n.notes;
              !!n.notes.includes(selected)
                ? newNotes.splice(newNotes.indexOf(selected), 1)
                : newNotes.push(selected);
              newNotes.sort();
              const newCell: GridCell = {
                notes: newNotes,
                locked: n.locked,
                value: n.value,
                position: n.position,
              };
              return newCell;
            }
            const newCell: GridCell = {
              notes: [],
              locked: n.locked,
              value: selected,
              position: n.position,
            };
            return newCell;
          }
          return n;
        });
      })
    );
  }

  function parseGrid(e: GridProps): GridCell[][] {
    const gridCellForm: GridCell[][] = e.rows.map((r: number[]) => {
      return r.map((n: number, index: number) => {
        const position: GridPosition = {
          x: props.rows.indexOf(r),
          y: index,
        };
        const cell: GridCell = {
          notes: [],
          locked: !!n ? true : false,
          value: n,
          position: position,
        };
        return cell;
      });
    });
    return gridCellForm;
  }

  const rows = grid.map((r: GridCell[]) => {
    return (
      <div
        className={
          (grid.indexOf(r) + 1) % 3 === 0 && grid.indexOf(r) + 1 !== grid.length
            ? "d-flex border-bottom"
            : grid.indexOf(r) % 3 === 0
            ? "d-flex mt-2"
            : "d-flex"
        }
        key={grid.indexOf(r)}
      >
        {r.map((n: GridCell) => {
          return (
            <Cell
              notes={n.notes}
              locked={n.locked}
              value={n.value}
              key={n.position.x.toString() + "" + n.position.y.toString()}
              position={n.position}
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
        type={mode === "place" ? "success" : "primary"}
        values={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        selected={selected}
        onSelect={(e: number) => setSelected(e)}
      ></Selector>
      <button
        className={mode === "place" ? "btn btn-success" : "btn btn-primary"}
        onClick={() => setMode(mode === "place" ? "note" : "place")}
      >
        {mode}
      </button>
    </div>
  );
}
