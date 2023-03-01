import { type ChangeEvent, useState, useEffect, useMemo } from "react";
import "./App.css";
import { Assignment } from "./backend";
import React from "react";
import { decompressFromBase64 } from "lz-string";
import { AssignmentTable } from "./AssignmentTable";
import { Popups } from "./Popups";
import { Averages } from "./Averages";

function App() {
  const [exportVisible, setExportVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(false);
  const [deleteAllVisible, setDeleteAllVisible] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>(
    localStorage.getItem("assignments") === null
      ? [
          new Assignment("Example quiz", 94, 0.25),
          new Assignment("Example test", 74, 0.6),
          new Assignment("Example homework assignment", 0, 0.15),
        ]
      : JSON.parse(localStorage.getItem("assignments")!)
  );
  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);
  const [weights, setWeights] = useState<number[]>([0.15, 0.25, 0.6]);
  useMemo(() => {
    const unpadded = assignments
      .map((assignment) => assignment.weight)
      .filter((value, index, self) => self.indexOf(value) === index)
      .slice(0, 3);
    const padded = Array.from(
      { ...unpadded, length: 3 },
      (value) => value ?? 0
    );
    setWeights(padded);
  }, [assignments]);
  const [createAssignment, setCreateAssignment] = useState<Assignment>(
    new Assignment("", 0, 0, false)
  );
  const importFromBase64 = (base64: string) => {
    setAssignments(JSON.parse(decompressFromBase64(base64) ?? "[]"));
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
  const onModifyAssignment = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
    property: string
  ) => {
    const newAssignments = [...assignments];
    if (Object.prototype.hasOwnProperty.call(newAssignments[index], property)) {
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
        newAssignments[index][property] = Number(event.target.value);
      } else if (property === "theoretical") {
        newAssignments[index][property] = !newAssignments[index].theoretical;
      } else {
        // @ts-expect-error: hasOwnProperty ensures next line is type-safe.
        newAssignments[index][property] = event.target.value;
      }
    }
    setAssignments(newAssignments);
  };
  const onDeleteAssignment = (index: number) => {
    const temporary = [...assignments];
    temporary.splice(index, 1);
    setAssignments(temporary);
  };

  return (
    <div className="App">
      <Popups
        exportVisible={exportVisible}
        setExportVisible={setExportVisible}
        importVisible={importVisible}
        setImportVisible={setImportVisible}
        deleteAllVisible={deleteAllVisible}
        setDeleteAllVisible={setDeleteAllVisible}
        assignments={assignments}
        setAssignments={setAssignments}
        importFromBase64={importFromBase64}
      />
      <button
        onClick={() => {
          setImportVisible(true);
        }}
      >
        Import
      </button>
      <button
        onClick={() => {
          setExportVisible(true);
        }}
      >
        Export
      </button>
      <Averages assignments={assignments} weights={weights} />
      <AssignmentTable
        setDeleteAllVisible={setDeleteAllVisible}
        assignments={assignments}
        onAddAssignment={onAddAssignment}
        onModifyCreate={onModifyCreate}
        createAssignment={createAssignment}
        onDeleteAssignment={onDeleteAssignment}
        onModifyAssignment={onModifyAssignment}
      />
    </div>
  );
}

export default App;
