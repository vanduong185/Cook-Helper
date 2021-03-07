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
import { addMenuToParty, updateMenuFromParty } from '../PartySlice';
import { Utils } from '../../../utils/Utils';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../../constants/AppConst';

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
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getDishes());
  }, [dispatch]);

  const dishes = useSelector((state: AppState) => state.dishes);

  const [menu, setMenu] = React.useState<MenuDTO>(
    props.menu || {
      name: undefined,
      setAmount: 0,
      dishes: [],
    },
  );

  const [errorTexts, setErrorTexts] = React.useState<ValidationErrorText>({
    nameField: undefined,
    amountField: undefined,
  });

  const getMenuPrice = (): number => {
    return Utils.getMenuPrice(menu);
  };

  const handleAddDish = (dish: DishDTO): void => {
    const tmpMenu = { ...menu };
    tmpMenu.dishes = tmpMenu.dishes.concat([dish]);
    setMenu(tmpMenu);
  };

  const handleRemoveDish = (index: number): void => {
    const tmpMenu = { ...menu };
    tmpMenu.dishes = tmpMenu.dishes.filter((dish, i) => i !== index);
    setMenu(tmpMenu);
  };

  const handleCreateMenu = (): void => {
    const isValid = validateMenuData();
    if (!isValid) {
      return;
    }

    dispatch(addMenuToParty(menu));
    props.onClose();
  };

  const handleUpdateMenu = (): void => {
    const isValid = validateMenuData();
    if (!isValid) {
      return;
    }

    dispatch(
      updateMenuFromParty({
        menu,
        index: props.indexMenu,
      }),
    );
    props.onClose();
  };

  const validateMenuData = (): boolean => {
    const errorsTmp = { ...errorTexts };
    let isValid = true;

    if (!menu.name || menu.name.length <= 0) {
      errorsTmp.nameField = 'Không được để trống';
      isValid = false;
    }

    if ((!menu.setAmount && menu.setAmount !== 0) || menu.setAmount < 0) {
      errorsTmp.amountField = 'Giá trị không hợp lệ';
      isValid = false;
    }

    if (!isValid) {
      setErrorTexts(errorsTmp);
    }

    return isValid;
  };

  const updateName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const tmpMenu = { ...menu };
    tmpMenu.name = event.target.value;
    setMenu(tmpMenu);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      nameField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  const updateAmount = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const tmpMenu = { ...menu };
    tmpMenu.setAmount = +event.target.value;
    setMenu(tmpMenu);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      amountField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  return (
    <Paper className={classes.paper}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h1>{props.isEdit ? 'Sửa thực đơn' : 'Thêm thực đơn mới'}</h1>
        <Box display="flex" flexDirection="row">
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
          <Button
            variant="outlined"
            onClick={props.onClose}
            style={{
              height: 40,
              marginLeft: 20,
            }}
          >
            {'Đóng'}
          </Button>
        </Box>
      </Box>
      <Divider></Divider>
      <Box display="flex" flexDirection="row">
        <Box my="30px" mr="30px">
          <TextField
            required
            label="Tên thực đơn"
            placeholder="Nhập tên thực đơn"
            variant="outlined"
            defaultValue={menu.name}
            error={!!errorTexts.nameField}
            helperText={errorTexts.nameField}
            onChange={updateName}
            style={{
              width: 300,
            }}
          />
        </Box>
        <Box my="30px" mr="30px">
          <TextField
            required
            label="Số mâm"
            placeholder="Nhập số mâm"
            variant="outlined"
            defaultValue={menu.setAmount}
            error={!!errorTexts.amountField}
            helperText={errorTexts.amountField}
            onChange={updateAmount}
            style={{
              width: 300,
            }}
          />
        </Box>
      </Box>

      <Box display="flex" flexDirection="row">
        <Box mr="60px">
          <span
            style={{ fontWeight: 600 }}
          >{`Số lượng món: ${menu.dishes.length}`}</span>
        </Box>
        <Box mr="30px">
          <span
            style={{ fontWeight: 600 }}
          >{`Giá thực đơn: ${getMenuPrice().toLocaleString()}đ`}</span>
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
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <i>Chưa có món ăn nào trong thực đơn. Thêm món từ bảng bên dưới.</i>
          </Box>
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
          localeText={GRID_DEFAULT_LOCALE_TEXT}
          hideFooterSelectedRowCount
          rows={dishes}
          columns={[
            {
              field: 'action',
              headerName: ' ',
              sortable: false,
              disableColumnMenu: true,
              width: 50,
              renderCell: (params: CellParams): ReactElement => {
                return (
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={(): void => {
                      handleAddDish(params.row as DishDTO);
                    }}
                  >
                    <AddCircle></AddCircle>
                  </IconButton>
                );
              },
            },
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
              headerName: 'Giá',
              width: 150,
              valueGetter: (params: CellParams): string => {
                return params.value.toLocaleString();
              },
            },
          ]}
          pageSize={10}
        />
      </Box>
    </Paper>
  );
};

interface ValidationErrorText {
  nameField: string;
  amountField: string;
}
