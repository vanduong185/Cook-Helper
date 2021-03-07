import { Container, Box, Button, Modal } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/store';
import { DishEdit } from './components/DishEdit';
import { deleteDish, getDishes } from './DishSlice';
import { DataGrid, CellParams } from '@material-ui/data-grid';
import { CookTypeDTO } from '../../dto/CookTypeDTO';
import { DishDTO } from '../../dto/DishDTO';
import { ActionButton } from '../../components/commons/ActionButton';
import { ConfirmDeleteDialog } from '../../components/commons/ConfirmDeleteDialog';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../constants/AppConst';
import { SearchInput } from '../../components/commons/SearchInput';

export const DishPage = (): ReactElement => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = React.useState(
    false,
  );
  const [selectedDish, setSelectedDish] = React.useState<DishDTO>();
  const [searchKey, setSearchKey] = React.useState<string>(undefined);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getDishes());
  }, [dispatch]);

  const dishes = useSelector((state: AppState) => state.dishes);

  const showEditModal = (dish: DishDTO): void => {
    setSelectedDish(dish);
    setOpenEditModal(true);
  };

  const closeEditModal = (): void => {
    setOpenEditModal(false);
    setSelectedDish(undefined);
  };

  const showDeleteModal = (dish: DishDTO): void => {
    setSelectedDish(dish);
    setOpenConfirmDeleteDialog(true);
  };

  const closeDeleteModal = (): void => {
    setOpenConfirmDeleteDialog(false);
    setSelectedDish(undefined);
  };

  const handleDeleteItem = (dish: DishDTO): void => {
    dispatch(deleteDish(dish));
  };

  const searchDish = (key: string): void => {
    setSearchKey(key);
  };

  const getFilteredDishes = (key: string): DishDTO[] => {
    if (!key || key.length <= 0) {
      return dishes;
    }

    return dishes.filter((dish): boolean => {
      const dishName = dish.name.toLocaleLowerCase();
      return dishName.includes(key.toLocaleLowerCase());
    });
  };

  return (
    <Container>
      <h1>Quản lý món ăn</h1>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my="20px"
      >
        <SearchInput onFinishChange={searchDish}></SearchInput>
        <Button
          variant="contained"
          color="primary"
          onClick={(): void => {
            showEditModal(undefined);
          }}
        >
          <Add></Add>
          Thêm món ăn
        </Button>
      </Box>

      <div style={{ height: 650, width: '100%', marginBottom: '30px' }}>
        <DataGrid
          localeText={GRID_DEFAULT_LOCALE_TEXT}
          hideFooterSelectedRowCount
          rows={getFilteredDishes(searchKey)}
          columns={[
            {
              field: 'seq',
              headerName: 'STT',
              width: 80,
              valueFormatter: (params: CellParams): string => {
                return `${params.rowIndex + 1}`;
              },
            },
            { field: 'name', headerName: 'Tên món', width: 250 },
            {
              field: 'mainIngredient',
              headerName: 'Nguyên liệu chính',
              width: 180,
            },
            {
              field: 'cookType',
              headerName: 'Cách chế biến',
              width: 150,
              valueGetter: (params: CellParams): string => {
                const type = params.value as CookTypeDTO;
                return type?.name;
              },
            },
            {
              field: 'cost',
              headerName: 'Giá (đ)',
              width: 150,
              valueGetter: (params: CellParams): string => {
                return params.value.toLocaleString();
              },
            },
            {
              field: 'action',
              headerName: ' ',
              sortable: false,
              disableColumnMenu: true,
              width: 80,
              renderCell: (params: CellParams): ReactElement => {
                return (
                  <Box display="flex" flexDirection="row">
                    <ActionButton
                      onEditClick={(): void => {
                        showEditModal(params.row as DishDTO);
                      }}
                      onDeleteClick={(): void => {
                        showDeleteModal(params.row as DishDTO);
                      }}
                    ></ActionButton>
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
        onClose={closeEditModal}
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
          <DishEdit
            onClose={closeEditModal}
            dish={selectedDish}
            isEdit={!!selectedDish}
          ></DishEdit>
        </>
      </Modal>
      <ConfirmDeleteDialog
        title={'Xác nhận xóa món ăn này?'}
        open={openConfirmDeleteDialog}
        onClose={(): void => {
          closeDeleteModal();
        }}
        onConfirm={(): void => {
          handleDeleteItem(selectedDish);
          closeDeleteModal();
        }}
      ></ConfirmDeleteDialog>
    </Container>
  );
};
