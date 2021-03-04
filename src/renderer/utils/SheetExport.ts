import * as XLSX from 'xlsx';
import { remote } from 'electron';
import { ItemStatsDTO } from '../dto/ItemStatsDTO';
import { ToolStatsDTO } from '../dto/ToolStatsDTO';
import { MenuDTO } from '../dto/MenuDTO';
import { Utils } from './Utils';

const EXTENSIONS = 'xls|xlsx|xlsm|xlsb|xml|csv|txt|dif|sylk|slk|prn|ods|fods|htm|html'.split(
  '|',
);

const MARGIN_ROW = 3;

type KeyValue = { [x: string]: string | number };

export class SheetExport {
  export(menus: MenuDTO[]): void {
    const workbook = XLSX.utils.book_new();

    const itemWorkSheet = this.createItemSheet(menus);
    XLSX.utils.book_append_sheet(workbook, itemWorkSheet, 'Tổng nguyên liệu');

    const toolWorkSheet = this.createToolSheet(menus);
    XLSX.utils.book_append_sheet(workbook, toolWorkSheet, 'Tổng dụng cụ');

    this.saveFile(workbook);
  }

  createItemSheet(menus: MenuDTO[]): XLSX.WorkSheet {
    // Table of total stats
    let rowPos = 0;
    const ws = XLSX.utils.aoa_to_sheet([
      ['Thống kê tổng nguyên liệu'.toUpperCase()],
    ]);
    rowPos++;

    const itemStats = Utils.getItemStats(menus);
    const itemTableData = this.convertToItemTable(itemStats);
    XLSX.utils.sheet_add_json(ws, itemTableData, {
      origin: {
        r: rowPos,
        c: 0,
      },
    });
    rowPos += itemTableData.length + MARGIN_ROW;

    // Table of stat of each dish
    const allDishes = Utils.getDishesInMenu(menus);
    allDishes.forEach((dish) => {
      XLSX.utils.sheet_add_aoa(ws, [[`${dish.name}`.toUpperCase()]], {
        origin: {
          r: rowPos,
          c: 0,
        },
      });
      rowPos++;

      const itemStatsByDish = Utils.getItemStatsByDishId(dish.id, menus);
      const itemTableByDish = this.convertToItemTable(itemStatsByDish);
      XLSX.utils.sheet_add_json(ws, itemTableByDish, {
        origin: {
          r: rowPos,
          c: 0,
        },
      });
      rowPos += itemTableByDish.length + MARGIN_ROW;
    });

    return ws;
  }

  createToolSheet(menus: MenuDTO[]): XLSX.WorkSheet {
    // Table of total stats
    let rowPos = 0;
    const ws = XLSX.utils.aoa_to_sheet([
      ['Thống kê tổng dụng cụ'.toUpperCase()],
    ]);
    rowPos++;

    const toolStats = Utils.getToolStats(menus);
    const toolTableData = this.convertToToolTable(toolStats);
    XLSX.utils.sheet_add_json(ws, toolTableData, {
      origin: {
        r: rowPos,
        c: 0,
      },
    });
    rowPos += toolTableData.length + MARGIN_ROW;

    // Table of stat of each dish
    const allDishes = Utils.getDishesInMenu(menus);
    allDishes.forEach((dish) => {
      XLSX.utils.sheet_add_aoa(ws, [[`${dish.name}`.toUpperCase()]], {
        origin: {
          r: rowPos,
          c: 0,
        },
      });
      rowPos++;

      const toolStatsByDish = Utils.getToolStatsByDishId(dish.id, menus);
      const toolTableByDish = this.convertToToolTable(toolStatsByDish);
      XLSX.utils.sheet_add_json(ws, toolTableByDish, {
        origin: {
          r: rowPos,
          c: 0,
        },
      });
      rowPos += toolTableByDish.length + MARGIN_ROW;
    });

    return ws;
  }

  exportItemByProvider(menus: MenuDTO[]): void {
    const workbook = XLSX.utils.book_new();
    const itemWorkSheet = this.createProviderSheet(menus);
    XLSX.utils.book_append_sheet(
      workbook,
      itemWorkSheet,
      'Thống kê theo nhà cung cấp',
    );

    this.saveFile(workbook);
  }

  createProviderSheet(menus: MenuDTO[]): XLSX.WorkSheet {
    const providers: string[] = [];

    menus.forEach((menu): void => {
      menu.dishes.forEach((dish) => {
        dish.dishRecipes.forEach((recipe) => {
          const provider = recipe.item.provider;
          if (providers.indexOf(provider) < 0) {
            providers.push(provider);
          }
        });
      });
    });

    let rowPos = 0;
    const ws = XLSX.utils.aoa_to_sheet([
      ['Thống kê nguyên liệu theo nhà cung cấp'.toUpperCase()],
    ]);
    rowPos += 2;

    const itemStats = Utils.getItemStats(menus);

    providers.forEach((provider) => {
      XLSX.utils.sheet_add_aoa(ws, [[provider.toUpperCase()]], {
        origin: {
          r: rowPos,
          c: 0,
        },
      });

      rowPos++;

      const itemsStatByProvider = itemStats.filter(
        (itemStat) => itemStat.item.provider === provider,
      );

      const itemTableData = this.convertToItemTable(itemsStatByProvider);

      XLSX.utils.sheet_add_json(ws, itemTableData, {
        origin: {
          r: rowPos,
          c: 0,
        },
      });

      rowPos += itemsStatByProvider.length + MARGIN_ROW;
    });

    return ws;
  }

  async saveFile(workbook: XLSX.WorkBook): Promise<void> {
    const saveFile = await remote.dialog.showSaveDialog({
      title: 'Lưu tệp thống kê',
      filters: [
        {
          name: 'Spreadsheets',
          extensions: EXTENSIONS,
        },
      ],
    });

    if (saveFile.canceled) {
      return;
    }

    XLSX.writeFile(workbook, saveFile.filePath);
    remote.dialog.showMessageBox({
      message: 'Đã xuất tệp thống kê tại ' + saveFile.filePath,
      buttons: ['OK'],
    });
  }

  convertToItemTable(itemStats: ItemStatsDTO[]): KeyValue[] {
    const table: KeyValue[] = [];

    itemStats.forEach((itemStat, index) => {
      const row: KeyValue = {};
      row['STT'] = index + 1;
      row['Tên nguyên liệu'] = itemStat.item.name;
      row['Nơi cung cấp'] = itemStat.item.provider;
      row['Số lượng'] = itemStat.amount;
      row['Đơn vị'] = itemStat.item.unit.name;

      table.push(row);
    });

    return table;
  }

  convertToToolTable(toolStats: ToolStatsDTO[]): KeyValue[] {
    const table: KeyValue[] = [];

    toolStats.forEach((toolStat, index) => {
      const row: KeyValue = {};
      row['STT'] = index + 1;
      row['Tên dụng cụ'] = toolStat.tool.name;
      row['Kích cỡ'] = toolStat.tool.size;
      row['Số lượng'] = toolStat.amount;
      row['Đơn vị'] = toolStat.tool.unit.name;

      table.push(row);
    });

    return table;
  }
}
