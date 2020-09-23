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
    <Card
      bg={!!props.locked ? "secondary" : "light"}
      style={{ width: "5rem" }}
      className="mb-2 mr-2"
    >
      <summary>
        <Card.Body onClick={() => handleCellClick()}>
          <Card.Text>{props.value === 0 ? "_" : props.value}</Card.Text>
        </Card.Body>
      </summary>
    </Card>
  );
}
