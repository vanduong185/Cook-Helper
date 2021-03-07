import React, { ReactElement } from 'react';
import { Container, Box, Button, Modal } from '@material-ui/core';
import { DataGrid, CellParams } from '@material-ui/data-grid';
import { Add } from '@material-ui/icons';
import { ToolEdit } from './components/ToolEdit';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTool, getTools } from './ToolSlice';
import { AppState } from '../../store/store';
import { UnitDTO } from '../../dto/UnitDTO';
import { ToolDTO } from '../../dto/ToolDTO';
import { ActionButton } from '../../components/commons/ActionButton';
import { ConfirmDeleteDialog } from '../../components/commons/ConfirmDeleteDialog';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../constants/AppConst';

export const ToolPage = (): ReactElement => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = React.useState(
    false,
  );
  const [selectedTool, setSelectedTool] = React.useState<ToolDTO>();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getTools());
  }, [dispatch]);

  const tools = useSelector((state: AppState) => state.tools);

  const showEditModal = (tool: ToolDTO): void => {
    setSelectedTool(tool);
    setOpenEditModal(true);
  };

  const closeEditModal = (): void => {
    setOpenEditModal(false);
    setSelectedTool(undefined);
  };

  const showDeleteModal = (tool: ToolDTO): void => {
    setSelectedTool(tool);
    setOpenConfirmDeleteDialog(true);
  };

  const closeDeleteModal = (): void => {
    setOpenConfirmDeleteDialog(false);
    setSelectedTool(undefined);
  };

  const handleDeleteTool = (tool: ToolDTO): void => {
    dispatch(deleteTool(tool));
  };

  return (
    <Container>
      <h1>Quản lý dụng cụ</h1>
      <Box display="flex" justifyContent="flex-end" my="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={(): void => {
            showEditModal(undefined);
          }}
        >
          <Add></Add>
          Thêm dụng cụ
        </Button>
      </Box>
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          localeText={GRID_DEFAULT_LOCALE_TEXT}
          hideFooterSelectedRowCount
          rows={tools}
          columns={[
            {
              field: 'seq',
              headerName: 'STT',
              width: 80,
              valueFormatter: (params: CellParams): string => {
                return `${params.rowIndex + 1}`;
              },
            },
            { field: 'name', headerName: 'Tên', width: 250 },
            { field: 'size', headerName: 'Kích cỡ', width: 150 },
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
              width: 80,
              renderCell: (params: CellParams): ReactElement => {
                return (
                  <Box display="flex" flexDirection="row">
                    <ActionButton
                      onEditClick={(): void => {
                        showEditModal(params.row as ToolDTO);
                      }}
                      onDeleteClick={(): void => {
                        showDeleteModal(params.row as ToolDTO);
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
          <ToolEdit
            onClose={closeEditModal}
            tool={selectedTool}
            isEdit={!!selectedTool}
          ></ToolEdit>
        </>
      </Modal>
      <ConfirmDeleteDialog
        title={'Xác nhận xóa dụng cụ này?'}
        open={openConfirmDeleteDialog}
        onClose={(): void => {
          closeDeleteModal();
        }}
        onConfirm={(): void => {
          handleDeleteTool(selectedTool);
          closeDeleteModal();
        }}
      ></ConfirmDeleteDialog>
    </Container>
  );
};
