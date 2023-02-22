import { type ChangeEvent, useState } from "react";
import "./App.css";
import { weightedAverage, Assignment } from "./backend";
import classNames from "classnames";
import React from "react";

function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    new Assignment("Example quiz", 94, 0.25),
    new Assignment("Example test", 74, 0.6),
    new Assignment("Example homework assignment", 0, 0.15),
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
      if (property === "grade" || property === "weight") {
        newAssignment[property] = Number(event.target.value);
      } else if (property === "theoretical") {
        newAssignment[property] = !newAssignment.theoretical;
      } else {
        // @ts-expect-error: hasOwnProperty ensures next line is type-safe.
        newAssignment[property] = event.target.value;
      }
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

  const onDeleteAssignment = (index: number) => {
    const temporary = [...assignments];
    temporary.splice(index, 1);
    setAssignments(temporary);
  };

  const onModifyTheoretical = (index: number) => {
    const temporary = [...assignments];
    temporary[index].theoretical = !temporary[index].theoretical;
    setAssignments(temporary);
  };

  const assignmentList = assignments.map((assignment, index) => (
    <tr key={index}>
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
        <input
          type="checkbox"
          onChange={() => {
            onModifyTheoretical(index);
          }}
          checked={assignment.theoretical}
        />
      </td>
    </tr>
  ));
  const realAverage = weightedAverage(
    assignments.filter((assignment) => !assignment.theoretical),
    [0.6, 0.25, 0.15]
  );
  const theoreticalAverage = weightedAverage(assignments, [0.6, 0.25, 0.15]);
  const showTheoreticalAverage = assignments.some(
    (assignment) => assignment.theoretical
  );
  const theoryAverageClass = classNames("average", {
    "average-failing": theoreticalAverage < 70,
  });
  const realAverageClass = classNames(theoryAverageClass, {
    theory: showTheoreticalAverage,
    "average-failing": realAverage < 70,
  });
  return (
    <div className="App">
      <div className="averages">
        <span>
          Average:
          <br />
          <span className={realAverageClass}>
            {realAverage.toLocaleString("en", {
              useGrouping: false,
              minimumFractionDigits: 2,
            })}
          </span>
        </span>
        {showTheoreticalAverage && (
          <span>
            Theoretical: <br />
            <span className={theoryAverageClass}>
              {theoreticalAverage.toLocaleString("en", {
                useGrouping: false,
                minimumFractionDigits: 2,
              })}
            </span>
          </span>
        )}
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
        </thead>
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
              </button>
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
              <input
                type="checkbox"
                checked={createAssignment.theoretical}
                onChange={(event) => {
                  onModifyCreate(event, "theoretical");
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
