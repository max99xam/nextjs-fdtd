import { useAppDispatch, useAppSelector } from 'app/hooks';
import styles from './MatrixEditor.module.scss';
import {
  selectMediumMatrix,
  setCurrentMediumMatrix,
  setMediumMatrixSize,
} from 'app/reducers/medium-matrix.reducer';
import React from 'react';
import { Button } from 'react-bootstrap';
import MatrixEditor from './MatrixEditor';
import PreviewMatrix from './PreviewMatrixEditor';
import { selectCurrentSimulationDimension } from 'app/reducers/app-config.reducer';
import { SimulationDimension } from 'types/types';

type PreviewMatrixSidebarProps = {
  width: number;
  height: number;
};

const PreviewMatrixSidebar: React.FC<PreviewMatrixSidebarProps> = ({
  width,
  height,
}) => {
  const dispatch = useAppDispatch();

  const currentSimulationDimension = useAppSelector(selectCurrentSimulationDimension);

  const mediumMatrix = useAppSelector(selectMediumMatrix);

  React.useEffect(() => {
    if (currentSimulationDimension == SimulationDimension.SIMULATION_1D) {
      dispatch(setMediumMatrixSize({ newCountRow: 1, newCountCol: 40 }));
    } else {
      dispatch(setMediumMatrixSize({ newCountRow: 50, newCountCol: 50 }));
    }
    dispatch(
      setCurrentMediumMatrix({ currentMediumMatrixConfigInSet: 0 })
    );
  }, [currentSimulationDimension]);

  const [isOpened, setIsOpend] = React.useState<boolean>(false);

  return (
    <>
      <PreviewMatrix
        width={width}
        height={height}
        simulationDimension={currentSimulationDimension}
        mediumMatrix={mediumMatrix}
      />
      <Button
        className={styles.triggerMatrixBtn}
        onClick={() => setIsOpend(true)}
      >
        Edit material
      </Button>

      {isOpened && <MatrixEditor setIsOpened={setIsOpend} />}
    </>
  );
};

export default PreviewMatrixSidebar;
