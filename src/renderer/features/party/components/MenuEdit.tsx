import React, { ReactElement } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  Paper,
  Divider,
  Box,
  TextField,
  IconButton,
  Button,
} from '@material-ui/core';
import { DishDTO } from '../../../dto/DishDTO';
import { CellParams, DataGrid } from '@material-ui/data-grid';
import { AddCircle } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { CookTypeDTO } from '../../../dto/CookTypeDTO';
import { AppState } from '../../../store/store';
import { getDishes } from '../../dishes/DishSlice';
import { DishItem } from './DishItem';
import { MenuDTO } from '../../../dto/MenuDTO';

import './MenuEdit.css';
import { addMenuToParty, updateMenuFromParty } from '../PartySlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '80%',
      height: '80%',
      padding: theme.spacing(2, 4, 3),
      overflow: 'auto',
    },
  }),
);

interface Props {
  onClose: () => void;
  isEdit?: boolean;
  menu?: MenuDTO;
  indexMenu?: number;
}

export const MenuEdit = (props: Props): ReactElement => {
  const classes = useStyles();
  const [menu, setMenu] = React.useState<MenuDTO>(
    props.menu || {
      name: '',
      setAmount: undefined,
      dishes: [],
    },
  );

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getDishes());
  }, [dispatch]);

  const dishes = useSelector((state: AppState) => state.dishes);

  const getMenuPrice = (): number => {
    let totalPrice = 0;
    menu.dishes.forEach((dish) => {
      totalPrice += dish.cost;
    });

    return totalPrice;
  };

  const handleAddDish = (dish: DishDTO): void => {
    const tmpMenu = { ...menu };
    tmpMenu.dishes.push(dish);
    setMenu(tmpMenu);
  };

  const handleRemoveDish = (index: number): void => {
    const tmpMenu = { ...menu };
    tmpMenu.dishes.splice(index, 1);
    setMenu(tmpMenu);
  };

  const handleCreateMenu = (): void => {
    dispatch(addMenuToParty(menu));
    props.onClose();
  };

  const handleUpdateMenu = (): void => {
    dispatch(
      updateMenuFromParty({
        menu,
        index: props.indexMenu,
      }),
    );
    props.onClose();
  };

  return (
    <Paper className={classes.paper}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h1>{props.isEdit ? 'Sửa thực đơn' : 'Thêm thực đơn mới'}</h1>
        <Button
          variant="contained"
          color="primary"
          style={{
            height: 40,
          }}
          onClick={props.isEdit ? handleUpdateMenu : handleCreateMenu}
        >
          {props.isEdit ? 'Lưu' : 'Thêm'}
        </Button>
      </Box>
      <Divider></Divider>
      <Box display="flex" flexDirection="row">
        <Box my="30px" mr="30px">
          <TextField
            required
            id="outlined-required"
            label="Tên thực đơn"
            placeholder="Nhập tên thực đơn"
            variant="outlined"
            style={{
              width: 300,
            }}
            defaultValue={menu.name}
            onChange={(event): void => {
              const tmpMenu = { ...menu };
              tmpMenu.name = event.target.value;
              setMenu(tmpMenu);
            }}
          />
        </Box>
        <Box my="30px" mr="30px">
          <TextField
            required
            id="outlined-required"
            label="Số mâm"
            placeholder="Nhập số mâm"
            variant="outlined"
            style={{
              width: 300,
            }}
            defaultValue={menu.setAmount || ''}
            onChange={(event): void => {
              const tmpMenu = { ...menu };
              tmpMenu.setAmount = +event.target.value;
              setMenu(tmpMenu);
            }}
          />
        </Box>
      </Box>

      <Box display="flex" flexDirection="row">
        <Box mr="60px">
          <span>{`Số lượng món: ${menu.dishes.length}`}</span>
        </Box>
        <Box mr="30px">
          <span>{`Giá thực đơn: ${getMenuPrice()}`}</span>
        </Box>
      </Box>

      <Box
        maxHeight="240px"
        display="flex"
        flexDirection="column"
        flexWrap="wrap"
        alignContent="flex-start"
        mt="15px"
        border={1}
        borderColor="grey.200"
        borderRadius="5px"
        p="10px"
        overflow="auto"
      >
        {menu.dishes.length <= 0 ? (
          <span>Chua co mon an nao trong thuc don</span>
        ) : (
          <></>
        )}
        {menu.dishes.map((dish, index) => (
          <DishItem
            key={index}
            dish={dish}
            onRemove={(): void => {
              handleRemoveDish(index);
            }}
          ></DishItem>
        ))}
      </Box>

      <Box style={{ height: 500, width: '100%', margin: '30px 0px' }}>
        <h2>Tất cả các món ăn</h2>
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
                      color="primary"
                      size="small"
                      onClick={(): void => {
                        handleAddDish(params.row as DishDTO);
                      }}
                    >
                      <AddCircle></AddCircle>
                    </IconButton>
                  </Box>
                );
              },
            },
          ]}
          pageSize={10}
        />
      </Box>
    </Paper>
  );
};
