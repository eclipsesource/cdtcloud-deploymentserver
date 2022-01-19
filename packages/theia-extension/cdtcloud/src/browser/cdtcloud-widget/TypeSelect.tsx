import * as React from "react";
import { FunctionComponent, useState } from "react";
import Select from "react-select";

interface Option {
  label: string;
  value: string;
}

export const TypeSelect: FunctionComponent<{
  options: Array<Option>;
  deployOnBoard: Function;
}> = ({ options, deployOnBoard }) => {
  let [board, setBoard] = useState<Option>({
    label: "No board Selected",
    value: "",
  });

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
          }),
          singleValue: (base) => ({
            ...base,
            color: "var(--theia-menu-foreground)",
          }),
        }}
        onChange={(e: Option) => {
          if (!e) return;
          const newBoard = { label: e.label, value: e.value };
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
