import React, { ReactElement } from 'react';
import { Container, Box, Button, Modal, IconButton } from '@material-ui/core';
import { DataGrid, CellParams } from '@material-ui/data-grid';
import { Add, Edit } from '@material-ui/icons';
import { UnitEdit } from './components/UnitEdit';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/store';
import { UnitDTO } from '../../dto/UnitDTO';
import { getUnits } from './UnitSlice';

export const UnitPage = (): ReactElement => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState<UnitDTO>();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getUnits());
  }, [dispatch]);

  const units = useSelector((state: AppState) => state.units);

  const handleOpenEditModal = (): void => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = (): void => {
    setOpenEditModal(false);
    setSelectedUnit(undefined);
  };

  const handleEditClick = (unitId: number): void => {
    const unit = units.find((i) => i.id === unitId);
    setSelectedUnit(unit);
    setOpenEditModal(true);
  };

  return (
    <Container>
      <h1>Quản lý đơn vị</h1>
      <Box display="flex" justifyContent="flex-end" my="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenEditModal}
        >
          <Add></Add>
          Thêm đơn vị
        </Button>
      </Box>
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={units}
          columns={[
            {
              field: 'seq',
              headerName: 'STT',
              width: 100,
              valueFormatter: (params: CellParams): string => {
                return `${params.rowIndex + 1}`;
              },
            },
            { field: 'name', headerName: 'Tên đơn vị', width: 250 },
            {
              field: 'action',
              headerName: 'Sửa',
              sortable: false,
              disableColumnMenu: true,
              width: 100,
              renderCell: (params: CellParams): ReactElement => {
                return (
                  <IconButton
                    onClick={(): void => {
                      handleEditClick(params.row.id as number);
                    }}
                  >
                    <Edit color="primary" fontSize="small"></Edit>
                  </IconButton>
                );
              },
            },
          ]}
          pageSize={10}
        />
      </div>
      <Modal
        id="add-modal"
        open={openEditModal}
        onClose={handleCloseEditModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableBackdropClick
      >
        <>
          <UnitEdit
            onClose={handleCloseEditModal}
            unit={selectedUnit}
            isEdit={!!selectedUnit}
          ></UnitEdit>
        </>
      </Modal>
    </Container>
  );
};
