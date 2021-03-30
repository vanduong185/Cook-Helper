import React, { ReactElement } from 'react';
import {
  Box,
  Button,
  Container,
  createStyles,
  Divider,
  makeStyles,
  MenuItem,
  TextField,
  Modal,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/store';
import { ItemTable } from './components/ItemTable';
import { ItemStatsDTO } from '../../dto/ItemStatsDTO';
import { MenuDTO } from '../../dto/MenuDTO';
import { ToolTable } from './components/ToolTable';
import { ToolStatsDTO } from '../../dto/ToolStatsDTO';
import { DishDTO } from '../../dto/DishDTO';
import { Utils } from '../../utils/Utils';
import { ExportModal } from './components/ExportModal';

const useStyles = makeStyles(() =>
  createStyles({
    labelBig: {
      fontSize: 18,
      fontWeight: 600,
      marginRight: '30px',
    },
  }),
);

export const PartyStatsPage = (): ReactElement => {
  const classes = useStyles();
  const history = useHistory();
  const [selectedMenuIndex, setSelectedMenuIndex] = React.useState<number>(-1);
  const [selectedDishId, setSelectedDishId] = React.useState<number>(undefined);
  const [openExportModal, setOpenExportModal] = React.useState(false);

  const partyMenus = useSelector((state: AppState) => state.partyMenus);

  const handleGoBack = (): void => {
    history.goBack();
  };

  const handleOpenExportModal = (): void => {
    setOpenExportModal(true);
  };

  const handleCloseExportModal = (): void => {
    setOpenExportModal(false);
  };

  const getItemStats = (menus: MenuDTO[]): ItemStatsDTO[] => {
    return Utils.getItemStats(menus);
  };

  const getToolStats = (menus: MenuDTO[]): ToolStatsDTO[] => {
    return Utils.getToolStats(menus);
  };

  const getDishesInMenu = (menus: MenuDTO[]): DishDTO[] => {
    return Utils.getDishesInMenu(menus);
  };

  const renderDishOptions = (): ReactElement[] => {
    const dishes = getDishesInMenu(
      selectedMenuIndex === -1 ? partyMenus : [partyMenus[selectedMenuIndex]],
    );

    return dishes.map((dish) => (
      <MenuItem key={dish.id} value={dish.id}>
        {dish.name}
      </MenuItem>
    ));
  };

  const getItemStatsByDishId = (dishId: number): ItemStatsDTO[] => {
    const listItemStats: ItemStatsDTO[] = [];
    if (!dishId) {
      return listItemStats;
    }

    const menus =
      selectedMenuIndex === -1 ? partyMenus : [partyMenus[selectedMenuIndex]];

    return Utils.getItemStatsByDishId(dishId, menus);
  };

  const getToolStatsByDishId = (dishId: number): ToolStatsDTO[] => {
    const listToolStats: ToolStatsDTO[] = [];
    if (!dishId) {
      return listToolStats;
    }

    const menus =
      selectedMenuIndex === -1 ? partyMenus : [partyMenus[selectedMenuIndex]];

    return Utils.getToolStatsByDishId(dishId, menus);
  };

  const getMenuPrice = (menu: MenuDTO): number => {
    return Utils.getMenuPrice(menu);
  };

  const renderMenuInfo = (): ReactElement => {
    if (selectedMenuIndex === -1) {
      return <></>;
    }

    const menu = partyMenus[selectedMenuIndex];
    return (
      <Box display="flex">
        <Box display="flex" alignItems="center" mr="30px">
          <span style={{ margin: '5px 10px 5px 0px' }}>Số lượng món:</span>
          <span className={classes.labelBig}>{menu.dishes.length}</span>
        </Box>

        <Box display="flex" alignItems="center" mr="30px">
          <span style={{ margin: '5px 10px 5px 0px' }}>Giá thực đơn:</span>
          <span className={classes.labelBig}>
            {`${getMenuPrice(menu).toLocaleString()}đ`}
          </span>
        </Box>

        <Box display="flex" alignItems="center" mr="30px">
          <span style={{ margin: '5px 10px 5px 0px' }}>Số mâm:</span>
          <span className={classes.labelBig}>{menu.setAmount}</span>
        </Box>
      </Box>
    );
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Button
            variant="text"
            color="primary"
            style={{
              height: 40,
              marginRight: 15,
            }}
            onClick={handleGoBack}
          >
            <ArrowBack></ArrowBack>
            Quay lại
          </Button>
          <h1>Thống kê nguyên liệu</h1>
        </Box>
        <Button
          variant="contained"
          color="primary"
          style={{
            height: 40,
          }}
          onClick={handleOpenExportModal}
        >
          Xuất Excel
        </Button>
      </Box>
      <Divider></Divider>

      <Box display="flex" alignItems="center" my="30px">
        <span className={classes.labelBig}>Thống kê theo</span>
        <TextField
          select
          id="menu-select"
          label="Chọn thực đơn"
          variant="outlined"
          defaultValue={-1}
          style={{
            width: 300,
          }}
          onChange={(event): void => {
            setSelectedMenuIndex(+event.target.value);
            setSelectedDishId(undefined);
          }}
        >
          <MenuItem key={-1} value={-1}>
            Tất cả thực đơn
          </MenuItem>
          {partyMenus.map((menu, index) => (
            <MenuItem key={index} value={index}>
              {menu.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {renderMenuInfo()}

      <Box my="30px" id="test-table">
        <h4>Tổng nguyên liệu cần</h4>
        <ItemTable
          itemStats={getItemStats(
            selectedMenuIndex === -1
              ? partyMenus
              : [partyMenus[selectedMenuIndex]],
          )}
        ></ItemTable>
      </Box>

      <Box my="30px">
        <h4>Tổng dụng cụ cần</h4>
        <ToolTable
          toolStats={getToolStats(
            selectedMenuIndex === -1
              ? partyMenus
              : [partyMenus[selectedMenuIndex]],
          )}
        ></ToolTable>
      </Box>

      <Box display="flex" alignItems="center" mt="60px">
        <span className={classes.labelBig}>Xem theo món</span>
        <TextField
          select
          id="dish-select"
          label="Chọn món"
          variant="outlined"
          style={{
            width: 300,
          }}
          value={selectedDishId || ''}
          onChange={(event): void => {
            setSelectedDishId(+event.target.value);
          }}
        >
          {renderDishOptions()}
        </TextField>
      </Box>

      <Box my="30px">
        <h4>Tổng nguyên liệu cho món này</h4>
        <ItemTable itemStats={getItemStatsByDishId(selectedDishId)}></ItemTable>
      </Box>

      <Box my="30px">
        <h4>Tổng dụng cụ cho món này</h4>
        <ToolTable toolStats={getToolStatsByDishId(selectedDishId)}></ToolTable>
      </Box>

      <Modal
        id="export-modal"
        open={openExportModal}
        onClose={handleOpenExportModal}
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
          <ExportModal
            onClose={handleCloseExportModal}
            menus={partyMenus}
          ></ExportModal>
        </>
      </Modal>
    </Container>
  );
};
