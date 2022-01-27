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
    label: "No board Selected",
    value: "",
    status: ""
  });

  useEffect(() => {
    const updatedSelectionFromOptions = options.find(
      (option) => option.value === board.value
    );
    if (updatedSelectionFromOptions != null)
      setBoard(updatedSelectionFromOptions);
  }, [options]);
  
  const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',
  
    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
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
      default: 
        return "#1890ff";
    }
  }
  return (
    <div style={{ padding: "5px" }}>
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
            ...dot(getColor(data.status))
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
    </div>
  );
};
