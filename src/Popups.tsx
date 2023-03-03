import { type Class } from "./backend";
import React, { useState } from "react";
import Popup from "react-animated-popup";
import { compressToBase64 } from "lz-string";

export function Popups({
  exportVisible,
  setExportVisible,
  classes,
  importVisible,
  setImportVisible,
  importFromBase64,
  deleteAllVisible,
  setDeleteAllVisible,
  onDeleteAllAssignments,
}: {
  exportVisible: boolean;
  setExportVisible: (visible: boolean) => void;
  classes: Class[];
  importVisible: boolean;
  setImportVisible: (visible: boolean) => void;
  importFromBase64: (text: string) => void;
  deleteAllVisible: boolean;
  setDeleteAllVisible: (visible: boolean) => void;
  onDeleteAllAssignments: () => void;
}) {
  const [importText, setImportText] = useState("");
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(
      compressToBase64(JSON.stringify(classes))
    );
  };
  return (
    <>
      <Popup
        visible={exportVisible}
        onClose={() => {
          setExportVisible(false);
        }}
      >
        Copy this text and store it somewhere safe.
        <textarea
          style={{
            overflowWrap: "anywhere",
            width: "350px",
            height: "200px",
          }}
          onClick={(event) => {
            // @ts-expect-error: Select is a textarea function but typescript insists otherwise for some reason.
            event.target.select();
          }}
          readOnly
          value={compressToBase64(JSON.stringify(classes))}
        />
        <br />
        Or click this button to copy it to your clipboard:
        <button onClick={copyToClipboard}>Copy</button>
      </Popup>
      <Popup
        visible={importVisible}
        onClose={() => {
          setImportVisible(false);
        }}
      >
        Paste the text from the export here:
        <textarea
          style={{
            overflowWrap: "anywhere",
            width: "350px",
            height: "200px",
          }}
          value={importText}
          onChange={(event) => {
            setImportText(event.target.value);
          }}
        />
        <br />
        <button
          onClick={() => {
            importFromBase64(importText);
            setImportText("");
            setImportVisible(false);
          }}
        >
          Import
        </button>
      </Popup>
      <Popup
        visible={deleteAllVisible}
        onClose={() => {
          setDeleteAllVisible(false);
        }}
      >
        Are you sure you want to delete all assignments?
        <br />
        <br />
        <button
          onClick={() => {
            setDeleteAllVisible(false);
            onDeleteAllAssignments();
          }}
        >
          Yes
        </button>
        <button
          onClick={() => {
            setDeleteAllVisible(false);
          }}
        >
          No
        </button>
      </Popup>
    </>
  );
}
