import { type ChangeEvent, useState, useEffect } from "react";
import "./App.css";
import { Assignment, Class } from "./backend";
import React from "react";
import { decompressFromBase64 } from "lz-string";
import { AssignmentTable } from "./AssignmentTable";
import { Popups } from "./Popups";
import { Averages } from "./Averages";
import { produce } from "immer";
import { Sidebar } from "./Sidebar";

function App() {
  const [exportVisible, setExportVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(false);
  const [deleteAllVisible, setDeleteAllVisible] = useState(false);
  const [classes, setClasses] = useState<Class[]>(
    localStorage.getItem("classes") === null
      ? []
      : JSON.parse(localStorage.getItem("classes")!)
  );
  const [currentClass, setCurrentClass] = useState(0);
  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);
  const unpadded =
    classes.length > 0
      ? classes[currentClass].assignments
          .map((assignment) => assignment.weight)
          .filter((value, index, self) => self.indexOf(value) === index)
          .slice(0, 3)
      : [];
  const padded = Array.from({ ...unpadded, length: 3 }, (value) => value ?? 0);
  const [createAssignment, setCreateAssignment] = useState<Assignment>(
    new Assignment("", 0, 0, false)
  );
  const importFromBase64 = (base64: string) => {
    setClasses(JSON.parse(decompressFromBase64(base64) ?? "[]"));
    setCurrentClass(0);
  };
  const createClass = (name: string) => {
    const nextState = produce(classes, (draft) => {
      draft.push(new Class(name, []));
    });
    setClasses(nextState);
  };
  const onAddAssignment = () => {
    const nextState = produce(classes, (draft) => {
      draft[currentClass].assignments.push(createAssignment);
    });
    setClasses(nextState);
    setCreateAssignment(new Assignment("", 0, 0, false));
  };
  const onModifyCreate = (
    event: ChangeEvent<HTMLInputElement>,
    property: string
  ) => {
    const nextState = produce(createAssignment, (newAssignment) => {
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
      switch (property) {
        case "name": {
          newAssignment[property] = event.target.value;
          break;
        }
        case "grade":
        case "weight": {
          newAssignment[property] = Number(event.target.value);
          break;
        }
        case "theoretical": {
          newAssignment[property] = !newAssignment[property];
          break;
        }
      }
    });
    setCreateAssignment(nextState);
  };
  const onModifyAssignment = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
    property: string
  ) => {
    const nextState = produce(classes, (draft) => {
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
      switch (property) {
        case "name": {
          draft[currentClass].assignments[index][property] = event.target.value;
          break;
        }
        case "grade":
        case "weight": {
          draft[currentClass].assignments[index][property] = Number(
            event.target.value
          );
          break;
        }
        case "theoretical": {
          draft[currentClass].assignments[index][property] =
            !draft[currentClass].assignments[index][property];
          break;
        }
      }
    });
    setClasses(nextState);
  };
  const onDeleteAssignment = (index: number) => {
    const nextState = produce(classes, (draft) => {
      draft[currentClass].assignments.splice(index, 1);
    });
    setClasses(nextState);
  };

  const onDeleteAllAssignments = () => {
    const nextState = produce(classes, (draft) => {
      draft[currentClass].assignments = [];
    });
    setClasses(nextState);
  };

  return (
    <div className="app">
      <Sidebar
        classes={classes}
        setClasses={setClasses}
        currentClass={currentClass}
        createClass={createClass}
        setCurrentClass={setCurrentClass}
        setImportVisible={setImportVisible}
        setExportVisible={setExportVisible}
      />
      <div className="primary">
        <Popups
          exportVisible={exportVisible}
          setExportVisible={setExportVisible}
          importVisible={importVisible}
          setImportVisible={setImportVisible}
          deleteAllVisible={deleteAllVisible}
          setDeleteAllVisible={setDeleteAllVisible}
          classes={classes}
          onDeleteAllAssignments={onDeleteAllAssignments}
          importFromBase64={importFromBase64}
        />
        <Averages
          assignments={
            classes.length > 0 ? classes[currentClass].assignments : []
          }
          weights={padded}
        />
        <AssignmentTable
          setDeleteAllVisible={setDeleteAllVisible}
          assignments={
            classes.length > 0 ? classes[currentClass].assignments : []
          }
          onAddAssignment={onAddAssignment}
          onModifyCreate={onModifyCreate}
          createAssignment={createAssignment}
          onDeleteAssignment={onDeleteAssignment}
          onModifyAssignment={onModifyAssignment}
        />
      </div>
    </div>
  );
}

export default App;
