import React, { ReactElement } from 'react';
import { Container, Box, Button, Modal, IconButton } from '@material-ui/core';
import { DataGrid, CellParams } from '@material-ui/data-grid';
import { Add, Edit } from '@material-ui/icons';
import { CookTypeEdit } from './components/CookTypeEdit';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/store';
import { CookTypeDTO } from '../../dto/CookTypeDTO';
import { getCookTypes } from './CookTypeSlice';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../constants/AppConst';

export const CookTypePage = (): ReactElement => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [selectedCookType, setSelectedCookType] = React.useState<CookTypeDTO>();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getCookTypes());
  }, [dispatch]);

  const cookTypes = useSelector((state: AppState) => state.cookTypes);

  const handleOpenEditModal = (): void => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = (): void => {
    setOpenEditModal(false);
    setSelectedCookType(undefined);
  };

  const handleEditClick = (cookTypeId: number): void => {
    const cookType = cookTypes.find((i) => i.id === cookTypeId);
    setSelectedCookType(cookType);
    setOpenEditModal(true);
  };

  return (
    <Container>
      <h1>Quản lý cách chế biến</h1>
      <Box display="flex" justifyContent="flex-end" my="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenEditModal}
        >
          <Add></Add>
          Thêm cách chế biến
        </Button>
      </Box>
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          localeText={GRID_DEFAULT_LOCALE_TEXT}
          hideFooterSelectedRowCount
          rows={cookTypes}
          columns={[
            {
              field: 'seq',
              headerName: 'STT',
              width: 100,
              valueFormatter: (params: CellParams): string => {
                return `${params.rowIndex + 1}`;
              },
            },
            { field: 'name', headerName: 'Tên cách chế biến', width: 250 },
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
          <CookTypeEdit
            onClose={handleCloseEditModal}
            cookType={selectedCookType}
            isEdit={!!selectedCookType}
          ></CookTypeEdit>
        </>
      </Modal>
    </Container>
  );
};
