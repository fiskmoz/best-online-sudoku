import React from "react";
import { Card } from "react-bootstrap";
import { CellProps } from "../interfaces";

export default function Cell(props: CellProps) {
  function handleCellClick(): void {
    if (!props.locked) {
      props.onCellClick(props.position);
    }
  }
  return (
    <div
      className={
        (props.position.y - 2) % 3 === 0 && props.position.y % 8 !== 0
          ? "mr-2 border-right"
          : ""
      }
    >
      <Card
        onClick={() => handleCellClick()}
        bg={!!props.locked ? "secondary" : "light"}
        className="mb-2 mr-2 sudoku-box"
      >
        <Card.Body>
          <Card.Text className={!!props.notes.length ? "note-text" : ""}>
            {!!props.notes.length
              ? props.notes.join(" ")
              : props.value === 0
              ? " "
              : props.value}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
