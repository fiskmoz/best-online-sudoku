import React from "react";
import { Dropdown } from "react-bootstrap";
import { DropdownInput, DropdownOutput } from "../../interfaces";

export default function AppDropdown(props: DropdownInput) {
  return (
    <Dropdown>
      <Dropdown.Toggle variant={props.variant} id="dropdown-basic">
        {props.title}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {props.selectables.map((s) => {
          const out: DropdownOutput = {
            value: s,
            index: props.selectables.indexOf(s) + 1,
          };
          return (
            <Dropdown.Item
              key={out.index}
              onSelect={(e) => props.onSelect(out)}
            >
              {s}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
