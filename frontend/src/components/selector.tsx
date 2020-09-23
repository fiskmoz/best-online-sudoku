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
        bg={props.selected === v ? "success " : "light"}
        style={{ width: "5rem" }}
        className="mb-2 mr-2"
      >
        <summary>
          <Card.Body onClick={() => handleSelectClick(v)}>
            <Card.Text>{v}</Card.Text>
          </Card.Body>
        </summary>
      </Card>
    );
  });
  return <div className="d-flex">{selectors}</div>;
}
