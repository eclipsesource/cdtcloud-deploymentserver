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
    <div>
      <Select
        value={board}
        options={options}
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
