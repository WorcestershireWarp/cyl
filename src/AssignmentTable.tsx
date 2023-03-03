import React, { type ChangeEvent } from "react";
import { type Assignment } from "./backend";
import { AssignmentTableRow } from "./AssignmentTableRow";

export function AssignmentTable({
  setDeleteAllVisible,
  createAssignment,
  assignments,
  onAddAssignment,
  onModifyCreate,
  onDeleteAssignment,
  onModifyAssignment,
}: {
  setDeleteAllVisible: (visible: boolean) => void;
  createAssignment: Assignment;
  assignments: Assignment[];
  onDeleteAssignment: (index: number) => void;
  onModifyAssignment: (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
    property: string
  ) => void;
  onAddAssignment: () => void;
  onModifyCreate: (
    event: ChangeEvent<HTMLInputElement>,
    property: string
  ) => void;
}) {
  const assignmentList = assignments.map((assignment, index) => (
    <AssignmentTableRow
      key={index}
      assignment={assignment}
      index={index}
      onDeleteAssignment={onDeleteAssignment}
      onModifyAssignment={onModifyAssignment}
    />
  ));
  return (
    <table>
      <thead>
        <tr>
          <th>
            <button
              onClick={() => {
                setDeleteAllVisible(true);
              }}
            >
              Delete All Assignments
            </button>
          </th>
          <th>Assignment</th>
          <th>Grade</th>
          <th>Weight</th>
          <th>Theoretical?</th>
        </tr>
      </thead>
      <tbody>
        {assignmentList}
        <tr>
          <td
            style={{
              fontWeight: 500,
              color: "#000",
            }}
          >
            <button
              onClick={() => {
                onAddAssignment();
              }}
              disabled={createAssignment.name === ""}
            >
              Add assignment
            </button>
          </td>
          <td>
            <input
              value={createAssignment.name.toString()}
              onChange={(event) => {
                onModifyCreate(event, "name");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && createAssignment.name !== "") {
                  onAddAssignment();
                }
              }}
            />
          </td>
          <td>
            <input
              value={createAssignment.grade.toString()}
              type="number"
              onChange={(event) => {
                onModifyCreate(event, "grade");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && createAssignment.name !== "") {
                  onAddAssignment();
                }
              }}
            />
          </td>
          <td>
            <input
              value={createAssignment.weight.toString()}
              type="number"
              onChange={(event) => {
                onModifyCreate(event, "weight");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && createAssignment.name !== "") {
                  onAddAssignment();
                }
              }}
            />
          </td>
          <td>
            <input
              type="checkbox"
              className="theory-checkbox"
              checked={createAssignment.theoretical}
              onChange={(event) => {
                onModifyCreate(event, "theoretical");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && createAssignment.name !== "") {
                  onAddAssignment();
                }
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
