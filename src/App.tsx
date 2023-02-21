import { type ChangeEvent, useState } from "react";
import "./App.css";
import weightedAverage from "./weightedAverage";
import classNames from "classnames";
import React from "react";

export class Assignment {
  public theoretical;
  constructor(
    public name: string,
    public grade: number,
    public weight: number,
    theoretical?: boolean
  ) {
    this.name = name ?? "";
    this.grade = grade ?? 0;
    this.weight = weight ?? 0;
    this.theoretical = theoretical ?? false;
  }
}

function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    new Assignment("Essay", 94, 0.25),
    new Assignment("Essay", 63, 0.6),
    new Assignment("Essay", 22, 0.6),
    new Assignment("Essay", 100, 0.15),
    new Assignment("Essay", 64, 0.6),
    new Assignment("Essay", 0, 0.25),
  ]);
  const [createAssignment, setCreateAssignment] = useState<Assignment>(
    new Assignment("", 0, 0, false)
  );
  const onAddAssignment = () => {
    setAssignments([...assignments, createAssignment]);
    setCreateAssignment(new Assignment("", 0, 0, false));
  };
  const onModifyCreate = (
    event: ChangeEvent<HTMLInputElement>,
    property: string
  ) => {
    const newAssignment = { ...createAssignment };
    if (Object.prototype.hasOwnProperty.call(newAssignment, property)) {
      if (
        (property === "grade" || property === "weight") &&
        (Number(event.target.value) < 0 ||
          Number.isNaN(Number(event.target.value)))
      ) {
        return;
      }
      if (property === "weight" && Number(event.target.value) > 1) {
        return;
      }
      // @ts-expect-error: hasOwnProperty ensures next line is type-safe.
      newAssignment[property] =
        property === "grade" || property === "weight"
          ? Number(event.target.value)
          : event.target.value;
    }
    setCreateAssignment(newAssignment);
  };
  const onModifyName = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const temporary = [...assignments];
    temporary[index].name = event.target.value;
    setAssignments(temporary);
  };

  const onModifyGrade = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (Number(event.target.value) < 0) {
      return;
    }

    const temporary = [...assignments];
    temporary[index].grade = Number(event.target.value);
    setAssignments(temporary);
  };
  const onModifyWeight = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (Number(event.target.value) > 1 || Number(event.target.value) < 0) {
      return;
    }
    const temporary = [...assignments];
    temporary[index].weight = Number(event.target.value);
    setAssignments(temporary);
  };

  const assignmentList = assignments.map((assignment, index) => (
    <tr key={index}>
      <td>
        <button>Delete</button>
      </td>
      <td>
        <input
          value={assignment.name}
          onChange={(event) => {
            onModifyName(event, index);
          }}
        />
      </td>
      <td>
        <input
          value={assignment.grade.toString()}
          onChange={(event) => {
            onModifyGrade(event, index);
          }}
          type="number"
        />
      </td>
      <td>
        <input
          value={assignment.weight.toString()}
          type="number"
          onChange={(event) => {
            onModifyWeight(event, index);
          }}
        />
      </td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
  ));
  const average = weightedAverage(assignments, [0.6, 0.25, 0.15]);
  const averageClass = classNames("average", {
    "average-failing": average < 70,
  });
  return (
    <div className="App">
      <div>
        Average: <br />
        <span className={averageClass}>{average}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th />
            <th>Assignment</th>
            <th>Grade</th>
            <th>Weight</th>
            <th>Theoretical?</th>
          </tr>
        </thead>{" "}
        <tbody>
          {assignmentList}
          <tr>
            <td style={{ fontWeight: 500, color: "#000" }}>
              <button
                onClick={() => {
                  onAddAssignment();
                }}
                disabled={createAssignment.name === ""}
              >
                Add assignment
              </button>{" "}
            </td>
            <td>
              <input
                value={createAssignment.name.toString()}
                onChange={(event) => {
                  onModifyCreate(event, "name");
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
              />
            </td>
            <td>
              <input
                value={createAssignment.weight.toString()}
                type="number"
                onChange={(event) => {
                  onModifyCreate(event, "weight");
                }}
              />
            </td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
