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

  const partyMenus = useSelector((state: AppState) => state.partyMenus);

  const handleGoBack = (): void => {
    history.goBack();
  };

  const getItemStats = (menus: MenuDTO[]): ItemStatsDTO[] => {
    const totalItems: ItemStatsDTO[] = [];

    menus.forEach((menu) => {
      menu.dishes.forEach((dish) => {
        dish.dishRecipes.forEach((recipe) => {
          const itemStats: ItemStatsDTO = {
            id: recipe.item.id,
            item: recipe.item,
            amount: recipe.amount * menu.setAmount,
          };

          const existItemStats = totalItems.find((i) => i.id === itemStats.id);
          if (existItemStats) {
            existItemStats.amount += itemStats.amount;
            return;
          }

          totalItems.push(itemStats);
        });
      });
    });

    return totalItems;
  };

  const getToolStats = (menus: MenuDTO[]): ToolStatsDTO[] => {
    const totalTools: ToolStatsDTO[] = [];

    menus.forEach((menu) => {
      menu.dishes.forEach((dish) => {
        dish.dishTools.forEach((dishTool) => {
          const toolStats: ToolStatsDTO = {
            id: dishTool.tool.id,
            tool: dishTool.tool,
            amount: dishTool.amount * menu.setAmount,
          };

          const existToolStats = totalTools.find((t) => t.id === toolStats.id);
          if (existToolStats) {
            existToolStats.amount += toolStats.amount;
            return;
          }

          totalTools.push(toolStats);
        });
      });
    });

    return totalTools;
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
          variant="outlined"
          defaultValue={-1}
          style={{
            width: 300,
          }}
          onChange={(event): void => {
            setSelectedMenuIndex(+event.target.value);
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

      <Box my="30px">
        <ItemTable
          itemStats={getItemStats(
            selectedMenuIndex === -1
              ? partyMenus
              : [partyMenus[selectedMenuIndex]],
          )}
        ></ItemTable>
      </Box>

      <Box my="30px">
        <ToolTable
          toolStats={getToolStats(
            selectedMenuIndex === -1
              ? partyMenus
              : [partyMenus[selectedMenuIndex]],
          )}
        ></ToolTable>
      </Box>
    </Container>
  );
};
