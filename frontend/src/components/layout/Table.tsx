import React from "react";
import Table from "react-bootstrap/Table";
import { TableProps } from "../../interfaces";

export default function AppTable(props: TableProps) {
  const headers = (
    <tr>
      {props.headers.map((h, i) => {
        return <th key={i}>{h}</th>;
      })}
    </tr>
  );
  const rows = (
    <tbody>
      {props.rows.map((r, i) => {
        return (
          <tr key={i}>
            <td>{r.username}</td>
            <td>{r.country}</td>
            <td>
              {new Date(
                Date.parse(r.endtime) - Date.parse(r.starttime)
              ).getTime() / 1000}{" "}
              seconds
            </td>
          </tr>
        );
      })}
    </tbody>
  );
  return (
    <Table striped bordered hover variant="dark">
      <thead>{headers}</thead>
      {rows}
    </Table>
  );
}
