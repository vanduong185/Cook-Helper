import { Container, Box, Button, Modal } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/store';
import { DishEdit } from './components/DishEdit';
import { getDishes } from './DishSlice';

export const DishPage = (): ReactElement => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getDishes());
  }, [dispatch]);

  const dishes = useSelector((state: AppState) => state.dishes);
  console.log(dishes);

  const [openEditModal, setOpenEditModal] = React.useState(false);

  const handleOpenEditModal = (): void => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = (): void => {
    setOpenEditModal(false);
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
          <DishEdit onClose={handleCloseEditModal}></DishEdit>
        </>
      </Modal>
    </Container>
  );
};
