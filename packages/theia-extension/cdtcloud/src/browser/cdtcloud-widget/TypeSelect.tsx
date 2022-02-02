import * as React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import Select from "react-select";

interface Option {
  label: string;
  value: string;
  status: string;
}

export const TypeSelect: FunctionComponent<{
  options: Array<Option>;
  deployOnBoard: Function;
}> = ({ options, deployOnBoard }) => {
  let [board, setBoard] = useState<Option>({
    label: "No Board Selected",
    value: "",
    status: "",
  });

  useEffect(() => {
    const updatedSelectionFromOptions = options.find(
      (option) => option.value === board.value
    );
    if (updatedSelectionFromOptions != null)
      setBoard(updatedSelectionFromOptions);
  }, [options]);

  const dot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",

    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

  function getColor(status: string) {
    switch (status) {
      case "QUEUEABLE":
        return "#faad14";
      case "AVAILABLE":
        return "#52c41a";
      case "BUSY":
      case "UNAVAILABLE":
        return "#cf1322";
    }
  }

  function getStyle(status: string) {
    return {
      display: "flex",
      width: "10px",
      height: "10px",
      backgroundColor: getColor(status),
      borderRadius: "50%",
      justifyContent: "center",
      alignItems: "center",
    };
  }
  return (
    <div>
      <Select
        value={board}
        options={options}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "var(--theia-editor-background)",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "var(--theia-menu-background)",
            color: "var(--theia-menu-foreground)",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor:
              state.isFocused || state.isSelected
                ? "var(--theia-menu-selectionBackground)"
                : base.backgroundColor,
            color:
              state.isFocused || state.isSelected
                ? "var(--theia-menu-selectionForeground)"
                : base.color,
            ...dot(getColor(state.data.status)),
          }),
          singleValue: (base, { data }) => ({
            ...base,
            color: "var(--theia-menu-foreground)",
            ...dot(getColor(data.status)),
          }),
        }}
        onChange={(e: Option) => {
          if (!e) return;
          const newBoard = { label: e.label, value: e.value, status: e.status };
          setBoard(newBoard);
        }}
      />

      <button
        style={{
          margin: "10px 5px",
          width: "calc(100% - 10px)",
          padding: "5px",
        }}
        className="theia-button secondary"
        title="Deploy"
        onClick={(_a) => deployOnBoard(board)}
      >
        Deploy on Board
      </button>

      <table>
        <tbody>
          <tr>
            <td>
              <div style={getStyle("AVAILABLE")}></div>
            </td>
            <td>Device is available</td>
          </tr>
          <tr>
            <td>
              <div style={getStyle("QUEUEABLE")}></div>
            </td>
            <td>Device is queueable</td>
          </tr>
          <tr>
            <td>
              <div style={getStyle("UNAVAILABLE")}></div>
            </td>
            <td>Device is unavailable</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
