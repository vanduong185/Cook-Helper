import React, { ReactElement } from 'react';
import { Container, Box, Button, Modal } from '@material-ui/core';
import { DataGrid, ColDef, CellParams } from '@material-ui/data-grid';
import { Add } from '@material-ui/icons';
import { ItemEdit } from './components/ItemEdit';
import { useDispatch, useSelector } from 'react-redux';
import { getItems } from './ItemSlice';
import { AppState } from '../../store/store';
import { UnitDTO } from '../../dto/UnitDTO';

const columns: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Ten nguyen lieu', width: 250 },
  { field: 'provider', headerName: 'Noi cung cap', width: 250 },
  {
    field: 'unit',
    headerName: 'Don vi',
    width: 200,
    valueFormatter: (params: CellParams): string => {
      const unit = params.value as UnitDTO;

      return unit.name;
    },
  },
];

export const ItemPage = (): ReactElement => {
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getItems());
  }, [dispatch]);

  const items = useSelector((state: AppState) => state.items);
  console.log(items);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <Container>
      <h1>Quản lý nguyên liệu</h1>
      <Box display="flex" justifyContent="flex-end" my="20px">
        <Button variant="contained" color="primary" onClick={handleOpen}>
          <Add></Add>
          Thêm nguyên liệu
        </Button>
      </Box>
      <div style={{ height: 550, width: '100%' }}>
        <DataGrid rows={items} columns={columns} pageSize={10} />
      </div>
      <Modal
        id="add-modal"
        open={open}
        onClose={handleClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <>
          <ItemEdit></ItemEdit>
        </>
      </Modal>
    </Container>
  );
};
