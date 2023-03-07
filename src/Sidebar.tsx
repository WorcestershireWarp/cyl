import { Class, isAssignmentArray } from "./backend";
import classNames from "classnames";
import React, { useState } from "react";
import Popup from "react-animated-popup";
import Papa from "papaparse";
export function Sidebar({
  classes,
  setClasses,
  setImportVisible,
  setExportVisible,
  currentClass,
  setCurrentClass,
  createClass,
}: {
  classes: Class[];
  setClasses: (classes: Class[]) => void;
  setImportVisible: (visible: boolean) => void;
  setExportVisible: (visible: boolean) => void;
  currentClass: number;
  setCurrentClass: (index: number) => void;
  createClass: (name: string) => void;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [importCsvOpen, setImportCsvOpen] = useState(false);
  const [importCsv, setImportCsv] = useState("");
  const [importCsvName, setImportCsvName] = useState("");
  const classList = classes.map((classObject, index) => {
    const classClass = classNames({ selected: index === currentClass });
    return (
      <li key={index}>
        <button
          onClick={() => {
            setCurrentClass(index);
          }}
          className={classClass}
        >
          {classObject.name}
        </button>
      </li>
    );
  });
  return (
    <>
      <span style={{ textAlign: "center" }}>
        <Popup
          visible={importCsvOpen}
          onClose={() => {
            setImportCsvOpen(false);
          }}
        >
          <p>
            Manually import from CSV (aka copy-paste from Excel) <br />
            The table <i>must</i> have a header row that contains `name`,
            `grade`, `weight`, and `theoretical`, where `grade` and `weight` are
            numbers and `theoretical` is &quot;true&quot; or &quot;false&quot;
          </p>
          <br />
          <textarea
            style={{ width: "400px", height: "350px" }}
            value={importCsv}
            onChange={(event) => {
              setImportCsv(event.target.value);
            }}
          />
          <br />
          <p>
            Since encoding the name of the class would make the CSV harder to
            create, please input the name of the class here:
          </p>
          <input
            placeholder="Name"
            onChange={(event) => {
              setImportCsvName(event.target.value);
            }}
            value={importCsvName}
          />
          <button
            onClick={() => {
              const data = Papa.parse(importCsv, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
              }).data;
              if (isAssignmentArray(data)) {
                setClasses([...classes, new Class(importCsvName, data)]);
                setImportCsvOpen(false);
              }
            }}
          >
            Import
          </button>
          <button
            onClick={() => {
              setImportCsvOpen(false);
            }}
          >
            Cancel
          </button>
        </Popup>
        <Popup
          visible={createOpen}
          onClose={() => {
            setCreateOpen(false);
          }}
        >
          <p>What would you like to call your new class?</p>
          <input
            value={className}
            onChange={(event) => {
              setClassName(event.target.value);
            }}
          ></input>
          <br />
          <button
            onClick={() => {
              createClass(className);
              setCreateOpen(false);
              setCurrentClass(classes.length);
            }}
          >
            Create
          </button>
          <button
            onClick={() => {
              setCreateOpen(false);
              setClassName("");
            }}
          >
            Cancel
          </button>
        </Popup>
      </span>
      <div className="sidebar">
        <ul>
          {classList}
          <li>
            <button
              onClick={() => {
                setCreateOpen(true);
              }}
            >
              New Class
            </button>
          </li>
        </ul>
        <ul>
          <li>
            <button
              onClick={() => {
                setImportVisible(true);
                setExportVisible(false);
              }}
            >
              Import
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setExportVisible(true);
                setImportVisible(false);
              }}
            >
              Export
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setExportVisible(false);
                setImportVisible(false);
                setImportCsvOpen(true);
              }}
            >
              Import from CSV
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
