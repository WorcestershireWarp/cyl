import { Class } from "./backend";
import classNames from "classnames";
import React, { useState } from "react";
import Popup from "react-animated-popup";

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
  const [importJsonOpen, setImportJsonOpen] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importJsonName, setImportJsonName] = useState("");
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
          visible={importJsonOpen}
          onClose={() => {
            setImportJsonOpen(false);
          }}
        >
          <p>
            Manually import from raw JSON if you are a programmer who knows what
            that means. <br />
            All objects <i>must</i> contain four keys, `name`, `grade`,
            `weight`, and `theoretical`.
          </p>
          <br />
          <textarea
            style={{ width: "400px", height: "350px" }}
            value={importJson}
            onChange={(event) => {
              setImportJson(event.target.value);
            }}
          />
          <br />
          <p>
            Since encoding the name of the class would make the JSON harder to
            create, please input the name of the class here:
          </p>
          <input
            placeholder="Name"
            onChange={(event) => {
              setImportJsonName(event.target.value);
            }}
            value={importJsonName}
          />
          <button
            onClick={() => {
              setClasses([
                ...classes,
                new Class(importJsonName, JSON.parse(importJson)),
              ]);
              setImportJsonOpen(false);
            }}
          >
            Import
          </button>
          <button
            onClick={() => {
              setImportJsonOpen(false);
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
                setImportJsonOpen(true);
              }}
            >
              Import from JSON
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
