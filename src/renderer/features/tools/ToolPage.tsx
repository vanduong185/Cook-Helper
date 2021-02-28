import React, { ReactElement } from 'react';
import { Container, Box, Button, Modal, IconButton } from '@material-ui/core';
import { DataGrid, CellParams } from '@material-ui/data-grid';
import { Add, Edit, Delete } from '@material-ui/icons';
import { ToolEdit } from './components/ToolEdit';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTool, getTools } from './ToolSlice';
import { AppState } from '../../store/store';
import { UnitDTO } from '../../dto/UnitDTO';
import { ToolDTO } from '../../dto/ToolDTO';

export const ToolPage = (): ReactElement => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [selectedTool, setSelectedTool] = React.useState<ToolDTO>();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getTools());
  }, [dispatch]);

  const tools = useSelector((state: AppState) => state.tools);

  const handleOpenEditModal = (): void => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = (): void => {
    setOpenEditModal(false);
    setSelectedTool(undefined);
  };

  const handleEditClick = (toolId: number): void => {
    const tool = tools.find((i) => i.id === toolId);
    setSelectedTool(tool);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (toolId: number): void => {
    const tool = tools.find((i) => i.id === toolId);
    dispatch(deleteTool(tool));
  };

  return (
    <Container>
      <h1>Quản lý dụng cụ</h1>
      <Box display="flex" justifyContent="flex-end" my="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenEditModal}
        >
          <Add></Add>
          Thêm dụng cụ
        </Button>
      </Box>
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={tools}
          columns={[
            {
              field: 'seq',
              headerName: 'STT',
              width: 100,
              valueFormatter: (params: CellParams): string => {
                return `${params.rowIndex + 1}`;
              },
            },
            { field: 'name', headerName: 'Tên', width: 250 },
            { field: 'size', headerName: 'Kích cỡ', width: 250 },
            {
              field: 'unit',
              headerName: 'Đơn vị',
              width: 100,
              valueFormatter: (params: CellParams): string => {
                const unit = params.value as UnitDTO;
                return unit?.name;
              },
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
        disableBackdropClick
      >
        <>
          <ToolEdit
            onClose={handleCloseEditModal}
            tool={selectedTool}
            isEdit={!!selectedTool}
          ></ToolEdit>
        </>
      </Modal>
    </Container>
  );
};
