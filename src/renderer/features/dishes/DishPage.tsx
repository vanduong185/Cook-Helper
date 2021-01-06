import { Container, Box, Button, Modal, IconButton } from '@material-ui/core';
import { Add, Edit, Delete } from '@material-ui/icons';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/store';
import { DishEdit } from './components/DishEdit';
import { deleteDish, getDishes } from './DishSlice';
import { DataGrid, CellParams } from '@material-ui/data-grid';
import { CookTypeDTO } from '../../dto/CookTypeDTO';
import { DishDTO } from '../../dto/DishDTO';

export const DishPage = (): ReactElement => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [selectedDish, setSelectedDish] = React.useState<DishDTO>();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getDishes());
  }, [dispatch]);

  const dishes = useSelector((state: AppState) => state.dishes);
  console.log(dishes);

  const handleOpenEditModal = (): void => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = (): void => {
    setOpenEditModal(false);
    setSelectedDish(undefined);
  };

  const handleEditClick = (dishId: number): void => {
    const dish = dishes.find((d) => d.id === dishId);
    setSelectedDish(dish);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (dishId: number): void => {
    const dish = dishes.find((d) => d.id === dishId);
    dispatch(deleteDish(dish));
  };

  return (
    <Container>
      <h1>Quản lý món ăn</h1>
      <Box display="flex" justifyContent="flex-end" my="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenEditModal}
        >
          <Add></Add>
          Thêm món ăn
        </Button>
      </Box>

      <div style={{ height: 650, width: '100%', marginBottom: '30px' }}>
        <DataGrid
          rows={dishes}
          columns={[
            {
              field: 'seq',
              headerName: 'STT',
              width: 100,
              valueFormatter: (params: CellParams): string => {
                return `${params.rowIndex + 1}`;
              },
            },
            { field: 'name', headerName: 'Tên món', width: 250 },
            {
              field: 'mainIngredient',
              headerName: 'Nguyên liệu chính',
              width: 200,
            },
            {
              field: 'cookType',
              headerName: 'Cách chế biến',
              width: 200,
              valueGetter: (params: CellParams): string => {
                const type = params.value as CookTypeDTO;
                return type?.name;
              },
            },
            {
              field: 'cost',
              headerName: 'Giá',
              width: 200,
            },
            {
              field: 'action',
              headerName: ' ',
              sortable: false,
              disableColumnMenu: true,
              width: 150,
              renderCell: (params: CellParams): ReactElement => {
                return (
                  <Box display="flex" flexDirection="row">
                    <IconButton
                      onClick={(): void => {
                        handleEditClick(params.row.id as number);
                      }}
                    >
                      <Edit color="primary" fontSize="small"></Edit>
                    </IconButton>
                    <IconButton
                      onClick={(): void => {
                        handleDeleteClick(params.row.id as number);
                      }}
                    >
                      <Delete color="secondary" fontSize="small"></Delete>
                    </IconButton>
                  </Box>
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
      >
        <>
          <DishEdit
            onClose={handleCloseEditModal}
            dish={selectedDish}
            isEdit={!!selectedDish}
          ></DishEdit>
        </>
      </Modal>
    </Container>
  );
};
