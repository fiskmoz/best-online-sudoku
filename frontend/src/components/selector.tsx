import React from "react";
import { Card } from "react-bootstrap";
import { SelectorProps } from "../interfaces";

export default function Selector(props: SelectorProps) {
  function handleSelectClick(v: number): void {
    props.onSelect(v);
  }
  const selectors = props.values.map((v) => {
    return (
      <Card
        onClick={() => handleSelectClick(v)}
        key={v}
        bg={props.selected === v ? props.type : "light"}
        style={{ width: "5rem" }}
        className="mb-2 mr-2 sudoku-box"
      >
        <Card.Body>
          <Card.Text>{v}</Card.Text>
        </Card.Body>
      </Card>
    );
  });
  return <div className="d-flex">{selectors}</div>;
}
