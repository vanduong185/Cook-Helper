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
import { AddCircle, Cancel } from '@material-ui/icons';
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
import { addDish } from '../DishSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '80%',
      height: '80%',
      padding: theme.spacing(2, 4, 3),
      overflow: 'auto',
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

  const [dish, setDish] = React.useState<DishDTO>({
    id: undefined,
    name: '',
    mainIngredient: '',
    cookType: {
      id: undefined,
      name: undefined,
    },
    cost: undefined,
    dishRecipes: [],
    dishTools: [],
  });

  const [newRecipe, setNewRecipe] = React.useState<DishRecipeDTO>({
    item: undefined,
    amount: undefined,
  });

  const [newTool, setNewTool] = React.useState<DishToolDTO>({
    tool: undefined,
    amount: undefined,
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
    tmpDish.dishRecipes.push(newRecipe);
    setDish(tmpDish);

    // clear item name combo-box
    (itemNameFieldRef.current.getElementsByClassName(
      'MuiAutocomplete-clearIndicator',
    )[0] as HTMLButtonElement).click();

    itemAmountFieldRef.current.value = '';
  };

  const handleRemoveItem = (index: number): void => {
    const tmpDish: DishDTO = { ...dish };
    tmpDish.dishRecipes.splice(index, 1);
    setDish(tmpDish);
  };

  const handleAddTool = (): void => {
    if (!newTool.tool || !newTool.amount) {
      return;
    }

    const tmpDish: DishDTO = { ...dish };
    tmpDish.dishTools.push(newTool);
    setDish(tmpDish);

    // clear item name combo-box
    (toolNameFieldRef.current.getElementsByClassName(
      'MuiAutocomplete-clearIndicator',
    )[0] as HTMLButtonElement).click();

    toolAmountFieldRef.current.value = '';
  };

  const handleRemoveTool = (index: number): void => {
    const tmpDish: DishDTO = { ...dish };
    tmpDish.dishTools.splice(index, 1);
    setDish(tmpDish);
  };

  const handleCreateDish = (): void => {
    dispatch(addDish(dish));
    props.onClose();
  };

  return (
    <Paper className={classes.paper}>
      <h1>Thêm món ăn mới</h1>
      <Divider></Divider>
      <Box display="flex" flexDirection="row">
        <Box my="30px" mr="30px">
          <TextField
            required
            id="outlined-required"
            label="Tên món ăn"
            placeholder="Nhập tên món ăn"
            variant="outlined"
            style={{
              width: 250,
            }}
            defaultValue={dish.name}
            onChange={(event): void => {
              const name = event.target.value;
              const tmpDish: DishDTO = {
                ...dish,
                name,
              };
              setDish(tmpDish);
            }}
          />
        </Box>

        <Box my="30px" mr="30px">
          <TextField
            required
            id="outlined-required"
            label="Nguyên liệu chính"
            placeholder="Nhập tên nguyên liệu"
            variant="outlined"
            style={{
              width: 200,
            }}
            defaultValue={dish.mainIngredient}
            onChange={(event): void => {
              const mainIngredient = event.target.value;
              const tmpDish: DishDTO = {
                ...dish,
                mainIngredient,
              };
              setDish(tmpDish);
            }}
          />
        </Box>

        <Box my="30px" mr="30px">
          <TextField
            required
            select
            id="outlined-required"
            label="Cách chế biến"
            value={dish.cookType.id || ''}
            variant="outlined"
            style={{
              width: 200,
            }}
            onChange={(event): void => {
              const typeId = +event.target.value;
              const cookType = cookTypes.find((t) => t.id === typeId);
              const tmpDish: DishDTO = {
                ...dish,
                cookType,
              };
              setDish(tmpDish);
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
            required
            id="outlined-required"
            label="Giá"
            placeholder="Nhập giá"
            variant="outlined"
            style={{
              width: 200,
            }}
            defaultValue={dish.cost || ''}
            onChange={(event): void => {
              const cost = +event.target.value;
              const tmpDish: DishDTO = {
                ...dish,
                cost,
              };
              setDish(tmpDish);
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
              id="combo-box-items"
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
              id="item-outlined-required"
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
              id="combo-box-tools"
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
              id="tool-outlined-required"
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
          {dish.dishTools.map((tool, index) => (
            <ListItem key={index} button>
              <Box display="flex" flexDirection="row" alignItems="center">
                <span className={clsx(classes.textBold, classes.titleSpan)}>
                  {tool.tool.name}
                </span>
                <Box
                  className={clsx(classes.textBold)}
                  mx="30px"
                  width="170px"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <span>{tool.amount}</span>
                  <span>{tool.tool.unit.name}</span>
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
          onClick={handleCreateDish}
        >
          Thêm món
        </Button>
      </Box>
    </Paper>
  );
};
