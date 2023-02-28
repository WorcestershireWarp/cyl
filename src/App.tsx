import { type ChangeEvent, useState } from "react";
import "./App.css";
import { weightedAverage, Assignment } from "./backend";
import classNames from "classnames";
import React from "react";
import Popup from "react-animated-popup";
import { compressToBase64, decompressFromBase64 } from "lz-string";

function App() {
  const [exportVisible, setExportVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(false);

  const [assignments, setAssignments] = useState<Assignment[]>([
    new Assignment("Example quiz", 94, 0.25),
    new Assignment("Example test", 74, 0.6),
    new Assignment("Example homework assignment", 0, 0.15),
  ]);
  const [createAssignment, setCreateAssignment] = useState<Assignment>(
    new Assignment("", 0, 0, false)
  );
  const [importText, setImportText] = useState<string>("");
  const importFromBase64 = (base64: string) => {
    setAssignments(JSON.parse(decompressFromBase64(base64) ?? "[]"));
    setImportVisible(false);
  };
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
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(
      compressToBase64(JSON.stringify(assignments))
    );
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
          className="theory-checkbox"
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
  const realAverageClass = classNames("average", {
    theory: showTheoreticalAverage,
    "average-failing": realAverage < 70,
  });
  const arrow =
    realAverage < theoreticalAverage
      ? "⇧"
      : realAverage > theoreticalAverage
      ? "⇩"
      : "⇨";
  const arrowClass = classNames({
    "arrow-up": realAverage < theoreticalAverage,
    "arrow-down": realAverage > theoreticalAverage,
  });
  return (
    <div className="App">
      <Popup
        visible={exportVisible}
        onClose={() => {
          setExportVisible(false);
        }}
      >
        Copy this text and store it somewhere safe.
        <textarea
          style={{ overflowWrap: "anywhere", width: "350px", height: "200px" }}
          onClick={(event) => {
            // @ts-expect-error: Select is a textarea function but typescript insists otherwise for some reason.
            event.target.select();
          }}
          readOnly
          value={compressToBase64(JSON.stringify(assignments))}
        />
        <br />
        Or click this button to copy it to your clipboard:
        <button onClick={copyToClipboard}>Copy</button>
      </Popup>
      <button
        onClick={() => {
          setExportVisible(true);
        }}
      >
        Export
      </button>
      <Popup
        visible={importVisible}
        onClose={() => {
          setImportVisible(false);
        }}
      >
        Paste the text from the export here:
        <textarea
          style={{ overflowWrap: "anywhere", width: "350px", height: "200px" }}
          value={importText}
          onChange={(event) => {
            setImportText(event.target.value);
          }}
        />
        <br />
        <button
          onClick={() => {
            importFromBase64(importText);
          }}
        >
          Import
        </button>
      </Popup>
      <button
        onClick={() => {
          setImportVisible(true);
          setImportText("");
        }}
      >
        Import
      </button>
      <div className="averages">
        <span>
          Current Average:
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
            Including Theoretical Assignments: <br />
            <span className={theoryAverageClass}>
              <span className={arrowClass}>{arrow}</span>
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
                className="theory-checkbox"
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
