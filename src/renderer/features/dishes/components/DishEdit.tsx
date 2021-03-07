import React, { ReactElement } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Paper,
  Divider,
  Box,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  ListItem,
  Button,
} from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { AddCircle, Cancel, Close } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getItems } from '../../items/ItemSlice';
import { AppState } from '../../../store/store';
import { ItemDTO } from '../../../dto/ItemDTO';
import { DishRecipeDTO } from '../../../dto/DishRecipeDTO';
import { DishDTO } from '../../../dto/DishDTO';
import clsx from 'clsx';
import { getTools } from '../../tools/ToolSlice';
import { DishToolDTO } from '../../../dto/DishToolDTO';
import { ToolDTO } from '../../../dto/ToolDTO';
import { getCookTypes } from '../../cook-types/CookTypeSlice';
import { addDish, updateDish } from '../DishSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '80%',
      height: '80%',
      padding: theme.spacing(2, 4, 3),
      overflow: 'auto',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    textBold: {
      fontSize: 18,
      fontWeight: 600,
    },
    titleSpan: {
      width: 300,
      color: theme.palette.info.main,
      textOverflow: 'ellipsis',
    },
  }),
);

interface Props {
  onClose: () => void;
  isEdit?: boolean;
  dish?: DishDTO;
}

export const DishEdit = (props: Props): ReactElement => {
  const classes = useStyles();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getCookTypes());
    dispatch(getItems());
    dispatch(getTools());
  }, [dispatch]);

  const cookTypes = useSelector((state: AppState) => state.cookTypes);
  const items = useSelector((state: AppState) => state.items);
  const tools = useSelector((state: AppState) => state.tools);
  const dishesData = useSelector((state: AppState) => state.dishes);

  const [dish, setDish] = React.useState<DishDTO>(
    props.dish || {
      id: undefined,
      name: undefined,
      mainIngredient: undefined,
      cookType: undefined,
      cost: 0,
      dishRecipes: [],
      dishTools: [],
    },
  );

  const [newRecipe, setNewRecipe] = React.useState<DishRecipeDTO>({
    item: undefined,
    amount: undefined,
  });

  const [newTool, setNewTool] = React.useState<DishToolDTO>({
    tool: undefined,
    amount: undefined,
  });

  const [errorTexts, setErrorTexts] = React.useState<ValidationErrorText>({
    nameField: undefined,
    mainItemField: undefined,
    cookTypeField: undefined,
    costField: undefined,
  });

  const itemNameFieldRef = React.useRef<HTMLElement>();
  const itemAmountFieldRef = React.useRef<HTMLInputElement>();
  const toolNameFieldRef = React.useRef<HTMLElement>();
  const toolAmountFieldRef = React.useRef<HTMLInputElement>();

  const handleAddItem = (): void => {
    if (!newRecipe.item || !newRecipe.amount) {
      return;
    }

    const tmpDish: DishDTO = { ...dish };
    tmpDish.dishRecipes = tmpDish.dishRecipes.concat([newRecipe]);
    setDish(tmpDish);

    // clear item name combo-box
    (itemNameFieldRef.current.getElementsByClassName(
      'MuiAutocomplete-clearIndicator',
    )[0] as HTMLButtonElement).click();

    itemAmountFieldRef.current.value = '';
  };

  const handleRemoveItem = (index: number): void => {
    const tmpDish: DishDTO = { ...dish };
    tmpDish.dishRecipes = tmpDish.dishRecipes.filter((re, i) => i !== index);
    setDish(tmpDish);
  };

  const handleAddTool = (): void => {
    if (!newTool.tool || !newTool.amount) {
      return;
    }

    const tmpDish: DishDTO = { ...dish };
    tmpDish.dishTools = tmpDish.dishTools.concat([newTool]);
    setDish(tmpDish);

    // clear item name combo-box
    (toolNameFieldRef.current.getElementsByClassName(
      'MuiAutocomplete-clearIndicator',
    )[0] as HTMLButtonElement).click();

    toolAmountFieldRef.current.value = '';
  };

  const handleRemoveTool = (index: number): void => {
    const tmpDish: DishDTO = { ...dish };
    tmpDish.dishTools = tmpDish.dishTools.filter((tool, i) => i !== index);
    setDish(tmpDish);
  };

  const handleCreateDish = (): void => {
    const isValid = validateDishData();
    if (!isValid) {
      return;
    }

    dispatch(addDish(dish));
    props.onClose();
  };

  const handleUpdateDish = (): void => {
    const isValid = validateDishData();
    if (!isValid) {
      return;
    }

    dispatch(updateDish(dish));
    props.onClose();
  };

  const validateDishData = (): boolean => {
    const errorsTmp = { ...errorTexts };
    let isValid = true;

    if (!dish.name || dish.name.length <= 0) {
      errorsTmp.nameField = 'Không được để trống';
      isValid = false;
    }

    if (!dish.mainIngredient || dish.mainIngredient.length <= 0) {
      errorsTmp.mainItemField = 'Không được để trống';
      isValid = false;
    }

    if (!dish.cookType) {
      errorsTmp.cookTypeField = 'Không được để trống';
      isValid = false;
    }

    if ((!dish.cost && dish.cost !== 0) || dish.cost < 0) {
      errorsTmp.costField = 'Giá trị không hợp lệ';
      isValid = false;
    }

    if (!isValid) {
      setErrorTexts(errorsTmp);
    }

    return isValid;
  };

  const updateDishName = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ): void => {
    const name = value;
    const tmpDish: DishDTO = {
      ...dish,
      name,
    };
    setDish(tmpDish);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      nameField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  const updateMainIngredient = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const mainIngredient = event.target.value;
    const tmpDish: DishDTO = {
      ...dish,
      mainIngredient,
    };
    setDish(tmpDish);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      mainItemField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  const updateCookType = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const typeId = +event.target.value;
    const cookType = cookTypes.find((t) => t.id === typeId);
    const tmpDish: DishDTO = {
      ...dish,
      cookType,
    };
    setDish(tmpDish);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      cookTypeField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  const updateCost = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const cost = +event.target.value;
    const tmpDish: DishDTO = {
      ...dish,
      cost,
    };
    setDish(tmpDish);

    const tmpErrorTexts: ValidationErrorText = {
      ...errorTexts,
      costField: undefined,
    };
    setErrorTexts(tmpErrorTexts);
  };

  return (
    <Paper className={classes.paper}>
      <IconButton className={classes.closeButton} onClick={props.onClose}>
        <Close />
      </IconButton>
      <h1>{props.isEdit ? 'Sửa món ăn' : 'Thêm món ăn mới'}</h1>
      <Divider></Divider>
      <Box display="flex" flexDirection="row">
        <Box my="30px" mr="30px">
          <Autocomplete
            freeSolo
            disableClearable
            options={dishesData.map((dishData): string => dishData.name)}
            defaultValue={props.dish?.name || ''}
            inputValue={dish.name || ''}
            onInputChange={updateDishName}
            renderInput={(params): ReactElement => (
              <TextField
                {...params}
                required
                label="Tên món ăn"
                placeholder="Nhập tên món ăn"
                error={!!errorTexts.nameField}
                helperText={errorTexts.nameField}
                variant="outlined"
              />
            )}
            style={{
              width: 300,
            }}
          />
        </Box>

        <Box my="30px" mr="30px">
          <TextField
            required
            label="Nguyên liệu chính"
            placeholder="Nhập tên nguyên liệu"
            variant="outlined"
            defaultValue={dish.mainIngredient}
            error={!!errorTexts.mainItemField}
            helperText={errorTexts.mainItemField}
            onChange={updateMainIngredient}
            style={{
              width: 200,
            }}
          />
        </Box>

        <Box my="30px" mr="30px">
          <TextField
            required
            select
            label="Cách chế biến"
            value={dish.cookType?.id || ''}
            variant="outlined"
            error={!!errorTexts.cookTypeField}
            helperText={errorTexts.cookTypeField}
            onChange={updateCookType}
            style={{
              width: 200,
            }}
          >
            {cookTypes.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box my="30px" mr="30px">
          <TextField
            label="Giá"
            placeholder="Nhập giá"
            variant="outlined"
            error={!!errorTexts.costField}
            helperText={errorTexts.costField}
            defaultValue={dish.cost}
            onChange={updateCost}
            style={{
              width: 200,
            }}
          />
        </Box>
      </Box>

      <Box>
        <h2>Nguyên liệu</h2>
        <Divider></Divider>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box my="30px" mr="30px">
            <Autocomplete
              ref={itemNameFieldRef}
              options={items}
              getOptionLabel={(option): string => option.name}
              style={{ width: 300 }}
              renderInput={(
                params: AutocompleteRenderInputParams,
              ): ReactElement => (
                <TextField
                  {...params}
                  label="Tên nguyên liệu"
                  variant="outlined"
                />
              )}
              noOptionsText={'Không có'}
              onChange={(event, item): void => {
                const tmpRecipe: DishRecipeDTO = {
                  ...newRecipe,
                  item: item as ItemDTO,
                };
                setNewRecipe(tmpRecipe);
              }}
            />
          </Box>

          <Box my="30px" mr="30px">
            <TextField
              inputRef={itemAmountFieldRef}
              required
              label="Số lượng"
              placeholder="Nhập số lượng"
              variant="outlined"
              style={{
                width: 200,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {newRecipe.item?.unit.name || ''}
                  </InputAdornment>
                ),
              }}
              onChange={(event): void => {
                const amount = +event.target.value;
                const tmpRecipe: DishRecipeDTO = {
                  ...newRecipe,
                  amount,
                };
                setNewRecipe(tmpRecipe);
              }}
            />
          </Box>

          <IconButton
            color="primary"
            style={{
              width: 60,
              height: 60,
            }}
            onClick={handleAddItem}
          >
            <AddCircle fontSize="large"></AddCircle>
          </IconButton>
        </Box>

        <Box>
          {dish.dishRecipes.map((recipe, index) => (
            <ListItem key={index} button>
              <Box display="flex" flexDirection="row" alignItems="center">
                <span className={clsx(classes.textBold, classes.titleSpan)}>
                  {recipe.item.name}
                </span>
                <Box
                  className={clsx(classes.textBold)}
                  mx="30px"
                  width="170px"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <span>{recipe.amount}</span>
                  <span>{recipe.item.unit.name}</span>
                </Box>
                <IconButton
                  color="secondary"
                  size="small"
                  style={{
                    marginLeft: 30,
                  }}
                  onClick={(): void => {
                    handleRemoveItem(index);
                  }}
                >
                  <Cancel></Cancel>
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </Box>
      </Box>

      {/* Add Tools */}
      <Box>
        <h2>Dụng cụ</h2>
        <Divider></Divider>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box my="30px" mr="30px">
            <Autocomplete
              ref={toolNameFieldRef}
              options={tools}
              getOptionLabel={(option): string => option.name}
              style={{ width: 300 }}
              renderInput={(
                params: AutocompleteRenderInputParams,
              ): ReactElement => (
                <TextField {...params} label="Tên dụng cụ" variant="outlined" />
              )}
              noOptionsText={'Không có'}
              onChange={(event, tool): void => {
                const tmpTool: DishToolDTO = {
                  ...newTool,
                  tool: tool as ToolDTO,
                };
                setNewTool(tmpTool);
              }}
            />
          </Box>

          <Box my="30px" mr="30px">
            <TextField
              inputRef={toolAmountFieldRef}
              required
              label="Số lượng"
              placeholder="Nhập số lượng"
              variant="outlined"
              style={{
                width: 200,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {newTool.tool?.unit.name || ''}
                  </InputAdornment>
                ),
              }}
              onChange={(event): void => {
                const amount = +event.target.value;
                const tmpTool: DishToolDTO = {
                  ...newTool,
                  amount,
                };
                setNewTool(tmpTool);
              }}
            />
          </Box>

          <IconButton
            color="primary"
            style={{
              width: 60,
              height: 60,
            }}
            onClick={handleAddTool}
          >
            <AddCircle fontSize="large"></AddCircle>
          </IconButton>
        </Box>

        <Box>
          {dish.dishTools.map((dishTool, index) => (
            <ListItem key={index} button>
              <Box display="flex" flexDirection="row" alignItems="center">
                <span className={clsx(classes.textBold, classes.titleSpan)}>
                  {dishTool.tool.name}
                </span>
                <Box
                  className={clsx(classes.textBold)}
                  mx="30px"
                  width="170px"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <span>{dishTool.amount}</span>
                  <span>{dishTool.tool.unit.name}</span>
                </Box>
                <IconButton
                  color="secondary"
                  size="small"
                  style={{
                    marginLeft: 30,
                  }}
                  onClick={(): void => {
                    handleRemoveTool(index);
                  }}
                >
                  <Cancel></Cancel>
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        my="30px"
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={props.isEdit ? handleUpdateDish : handleCreateDish}
        >
          {props.isEdit ? 'Lưu' : 'Thêm món'}
        </Button>
      </Box>
    </Paper>
  );
};

interface ValidationErrorText {
  nameField: string;
  mainItemField: string;
  cookTypeField: string;
  costField: string;
}
