import React from "react";
import { type Assignment } from "./backend";

export function AssignmentTableRow({
  assignment,
  index,
  onDeleteAssignment,
  onModifyAssignment,
}: {
  assignment: Assignment;
  index: number;
  onDeleteAssignment: (index: number) => void;
  onModifyAssignment: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    property: string
  ) => void;
}) {
  return (
    <tr>
      <td>
        <button
          onClick={() => {
            onDeleteAssignment(index);
          }}
        >
          Delete
        </button>
      </td>
      <td>
        <input
          value={assignment.name}
          onChange={(event) => {
            onModifyAssignment(event, index, "name");
          }}
        />
      </td>
      <td>
        <input
          value={assignment.grade.toString()}
          onChange={(event) => {
            onModifyAssignment(event, index, "grade");
          }}
          type="number"
        />
      </td>
      <td>
        <input
          value={assignment.weight.toString()}
          type="number"
          onChange={(event) => {
            onModifyAssignment(event, index, "weight");
          }}
        />
      </td>
      <td>
        <input
          type="checkbox"
          className="theory-checkbox"
          onChange={(event) => {
            onModifyAssignment(event, index, "theoretical");
          }}
          checked={assignment.theoretical}
        />
      </td>
    </tr>
  );
}
