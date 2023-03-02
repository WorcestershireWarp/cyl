import { type Class } from "./backend";
import classNames from "classnames";
import React, { useState } from "react";
import Popup from "react-animated-popup";

export function Sidebar({
  classes,
  setImportVisible,
  setExportVisible,
  currentClass,
  setCurrentClass,
  createClass,
}: {
  classes: Class[];
  setImportVisible: (visible: boolean) => void;
  setExportVisible: (visible: boolean) => void;
  currentClass: number;
  setCurrentClass: (index: number) => void;
  createClass: (name: string) => void;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [className, setClassName] = useState("");
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
        </ul>
      </div>
    </>
  );
}
