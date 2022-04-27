import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimulationDimension } from 'types/types';
import type { AppState } from '../store';

export type Medium = {
  name: string;
  color: string;

  // Electric permittivity.
  eps: number;

  // Permeability.
  mu: number;

  // Conductivity.
  sigma: number;
};

export const makeMatrixEmpty = (
  countRow: number,
  countCol: number,
  mediums: Medium[]
) => {
  let mediumMatrix: string[][] = [[]];

  for (let i = 0; i < countRow; i++) {
    mediumMatrix[i] = [];
    for (let j = 0; j < countCol; j++) {
      mediumMatrix[i][j] = mediums[0].name;
    }
  }
  return mediumMatrix;
};

export const makeMatrixBorder = (
  countRow: number,
  countCol: number,
  mediums: Medium[]
) => {
  let mediumMatrix: string[][] = [];

  for (let i = 0; i < countRow; i++) {
    mediumMatrix[i] = [];
    for (let j = 0; j < countCol; j++) {
      if (i > j) {
        mediumMatrix[i][j] = mediums[0].name;
      } else {
        mediumMatrix[i][j] = mediums[1].name;
      }
    }
  }
  return mediumMatrix;
};

export const makeMatrixDifraction = (
  countRow: number,
  countCol: number,
  mediums: Medium[]
) => {
  let mediumMatrix: string[][] = [];

  for (let i = 0; i < countRow; i++) {
    mediumMatrix[i] = [];
    for (let j = 0; j < countCol; j++) {
      mediumMatrix[i][j] = mediums[0].name;
    }
  }
  const difractionGridPosition = Math.floor(countRow / 8);

  for (let i = 0; i < countRow; i++) {
    mediumMatrix[i][difractionGridPosition] = mediums[1].name;
  }
  for (let i = 0; i < countRow; i += 3) {
    mediumMatrix[i][difractionGridPosition] = mediums[0].name;
  }
  return mediumMatrix;
};

export const makeZebra = (
  countRow: number,
  countCol: number,
  mediums: Medium[]
) => {
  let mediumMatrix: string[][] = [];

  for (let i = 0; i < countRow; i++) {
    mediumMatrix[i] = [];
    for (let j = 0; j < countCol; j++) {
      if (j % 2 === 0) {
        mediumMatrix[i][j] = mediums[0].name;
      } else {
        mediumMatrix[i][j] = mediums[1].name;
      }
    }
  }
  return mediumMatrix;
};

export type SourcePosition = {
  // 0 < x, y < 1.
  relativeX: number;
  relativeY: number;
};

export type ConfigMedium = {
  name: string;
  mediumMatrix: string[][];
  simulationDimension: SimulationDimension;
  sourcePosition: SourcePosition[];
};

export interface IMediumMatrixState {
  // Medium matrix sizes.
  countRow: number;
  countCol: number;

  mediums: Medium[];

  mediumMatrix: string[][];

  // Set of functions, that fill medium matrix.
  configMediumSet: ConfigMedium[];

  currentMediumMatrixConfigInSet: number;
}

const fillMediumMatrixes2D = (
  countRow: number,
  countCol: number,
  mediums: Medium[]
): ConfigMedium[] => {
  return [
    {
      name: 'Default',
      simulationDimension: SimulationDimension.SIMULATION_2D,
      sourcePosition: [{ relativeX: 0.5, relativeY: 0.2 }],
      mediumMatrix: makeMatrixEmpty(countRow, countCol, mediums),
    },
    {
      name: 'Interference',
      simulationDimension: SimulationDimension.SIMULATION_2D,
      sourcePosition: [
        { relativeX: 0.5, relativeY: 0.2 },
        { relativeX: 0.3, relativeY: 0.5 },
      ],
      mediumMatrix: makeMatrixEmpty(countRow, countCol, mediums),
    },
    {
      name: 'Difraction',
      simulationDimension: SimulationDimension.SIMULATION_2D,
      sourcePosition: [{ relativeX: 0.5, relativeY: 0.2 }],
      mediumMatrix: makeMatrixDifraction(countRow, countCol, mediums),
    },
    {
      name: 'Medium border',
      simulationDimension: SimulationDimension.SIMULATION_2D,
      sourcePosition: [{ relativeX: 0.5, relativeY: 0.2 }],
      mediumMatrix: makeMatrixBorder(countRow, countCol, mediums),
    },
  ];
};

const fillMediumMatrixes1D = (
  countRow: number,
  countCol: number,
  mediums: Medium[]
): ConfigMedium[] => {
  return [
    {
      name: 'Default',
      simulationDimension: SimulationDimension.SIMULATION_1D,
      sourcePosition: [{ relativeX: 0.5, relativeY: 0 }],
      mediumMatrix: makeMatrixEmpty(1, countCol, mediums),
    },
    {
      name: 'Zebra',
      simulationDimension: SimulationDimension.SIMULATION_1D,
      sourcePosition: [{ relativeX: 0.1, relativeY: 0.2 }],
      mediumMatrix: makeZebra(countRow, countCol, mediums),
    },
  ];
};

const initialMatrixSize = 10;

const mediums = [
  {
    name: 'Free space',
    eps: 1,
    mu: 1,
    sigma: 0,
    color: '#fafafa',
  },
  {
    name: 'Medium 2',
    eps: 1.3,
    mu: 1.2,
    sigma: 0.001,
    color: 'tomato',
  },
  {
    name: 'Medium 3',
    eps: 1.6,
    mu: 1,
    sigma: 0.02,
    color: '#1a52aa',
  },
];

const configMediumSet = fillMediumMatrixes2D(
  initialMatrixSize,
  initialMatrixSize,
  mediums
);

const currentMediumMatrixConfigInSet = 0;
const initialState: IMediumMatrixState = {
  countRow: initialMatrixSize,
  countCol: initialMatrixSize,
  mediums,
  mediumMatrix: configMediumSet[currentMediumMatrixConfigInSet].mediumMatrix,
  configMediumSet,
  currentMediumMatrixConfigInSet,
};

interface IUpdateEpslonMatrix {
  // Row index.
  i: number;
  // Column index.
  j: number;

  newMediumName: string;
}

export const mediumMatrixSlice = createSlice({
  name: 'mediumMatrix',
  initialState,
  reducers: {
    setMediumMatrixSize: (
      state,
      action: PayloadAction<{
        newCountRow: number;
        newCountCol: number;
      }>
    ) => {
      state.countCol = action.payload.newCountCol;
      state.countRow = action.payload.newCountRow;

      // Check 1D case.
      if (state.countRow == 1) {
        state.configMediumSet = fillMediumMatrixes1D(
          action.payload.newCountRow,
          action.payload.newCountCol,
          state.mediums
        );
      }
      // Check 2D case.
      else {
        state.configMediumSet = fillMediumMatrixes2D(
          action.payload.newCountRow,
          action.payload.newCountCol,
          state.mediums
        );
      }
    },

    setCurrentMediumMatrix: (
      state,
      action: PayloadAction<{
        currentMediumMatrixConfigInSet: number;
      }>
    ) => {
      state.currentMediumMatrixConfigInSet = action.payload.currentMediumMatrixConfigInSet
      state.mediumMatrix =
        state.configMediumSet[
          action.payload.currentMediumMatrixConfigInSet
        ].mediumMatrix;
    },

    updateMediumMatrix: (state, action: PayloadAction<IUpdateEpslonMatrix>) => {
      if (state.mediumMatrix[action.payload.i]) {
        state.mediumMatrix[action.payload.i][action.payload.j] =
          action.payload.newMediumName;
      }
    },
  },
});

export const {
  updateMediumMatrix,
  setCurrentMediumMatrix,
  setMediumMatrixSize,
} = mediumMatrixSlice.actions;

export const selectMediumMatrix = (state: AppState) =>
  state.mediumMatrix.mediumMatrix;

export const selectConfigMediumSet = (state: AppState) =>
  state.mediumMatrix.configMediumSet;

export const selectMediumMatrixCountRow = (state: AppState) =>
  state.mediumMatrix.countRow;

  export const selectCurrentMediumMatrixConfigInSet = (state: AppState) =>
  state.mediumMatrix.currentMediumMatrixConfigInSet;

export const selectMediumMatrixCountCol = (state: AppState) =>
  state.mediumMatrix.countCol;

export const selectMediums = (state: AppState) => state.mediumMatrix.mediums;

export default mediumMatrixSlice.reducer;
