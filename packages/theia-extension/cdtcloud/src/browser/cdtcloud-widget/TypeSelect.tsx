/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/

import React, { CSSProperties, FunctionComponent, useEffect, useState } from 'react'
import Select, { CSSObjectWithLabel } from 'react-select'

interface Option {
  label: string
  value: string
  status: string
}

export const TypeSelect: FunctionComponent<{
  options: Option[]
  deployOnBoard: Function
}> = ({ options, deployOnBoard }) => {
  const [board, setBoard] = useState<Option>({
    label: 'No Board Selected',
    value: '',
    status: ''
  })

  useEffect(() => {
    const updatedSelectionFromOptions = options.find(
      (option) => option.value === board.value
    )
    if (updatedSelectionFromOptions != null) { setBoard(updatedSelectionFromOptions) }
  }, [options])

  const dot = (color = 'transparent'): CSSObjectWithLabel => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10
    }
  })

  function getColor (status: string): string {
    switch (status) {
      case 'QUEUEABLE':
        return 'var(--theia-terminal-ansiYellow)'
      case 'AVAILABLE':
        return 'var(--theia-terminal-ansiGreen)'
      case 'BUSY':
      case 'UNAVAILABLE':
        return 'var(--theia-terminal-ansiRed)'
      default:
        return 'transparent'
    }
  }

  function getStyle (status: string): CSSProperties {
    return {
      display: 'flex',
      width: '10px',
      height: '10px',
      backgroundColor: getColor(status),
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
  return (
    <div>
      <Select
        value={board}
        options={options}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: 'var(--theia-editor-background)'
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'var(--theia-menu-background)',
            color: 'var(--theia-menu-foreground)'
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor:
              state.isFocused || state.isSelected
                ? 'var(--theia-menu-selectionBackground)'
                : base.backgroundColor,
            color:
              state.isFocused || state.isSelected
                ? 'var(--theia-menu-selectionForeground)'
                : base.color,
            ...dot(getColor(state.data.status))
          }),
          singleValue: (base, { data }) => ({
            ...base,
            color: 'var(--theia-menu-foreground)',
            ...dot(getColor(data.status))
          })
        }}
        onChange={(e: Option) => {
          if (e === undefined) return
          const newBoard = { label: e.label, value: e.value, status: e.status }
          setBoard(newBoard)
        }}
      />

      <button
        style={{
          margin: '10px 5px',
          width: 'calc(100% - 10px)',
          padding: '5px'
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
              <div style={getStyle('AVAILABLE')}></div>
            </td>
            <td>Device is available</td>
          </tr>
          <tr>
            <td>
              <div style={getStyle('QUEUEABLE')}></div>
            </td>
            <td>Device is queueable</td>
          </tr>
          <tr>
            <td>
              <div style={getStyle('UNAVAILABLE')}></div>
            </td>
            <td>Device is unavailable</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
