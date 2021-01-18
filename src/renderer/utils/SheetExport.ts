import * as XLSX from 'xlsx';
import { remote } from 'electron';
import { ItemStatsDTO } from '../dto/ItemStatsDTO';
import { ToolStatsDTO } from '../dto/ToolStatsDTO';
import { MenuDTO } from '../dto/MenuDTO';
import { Utils } from './Utils';

const EXTENSIONS = 'xls|xlsx|xlsm|xlsb|xml|csv|txt|dif|sylk|slk|prn|ods|fods|htm|html'.split(
  '|',
);

type KeyValue = { [x: string]: string | number };

interface SheetOptions {
  itemTitle: string;
  itemTableData: KeyValue[];
  toolTitle: string;
  toolTableData: KeyValue[];
}

export class SheetExport {
  async export(menus: MenuDTO[]): Promise<void> {
    const wb = XLSX.utils.book_new();

    // Total sheet
    const itemStats = Utils.getItemStats(menus);
    const itemTableData = this.convertToItemTable(itemStats);
    const toolStats = Utils.getToolStats(menus);
    const toolTableData = this.convertToToolTable(toolStats);
    const wsTotal2 = this.createSheet({
      itemTitle: 'Thống kê nguyên liệu tất cả thực đơn',
      itemTableData,
      toolTitle: 'Thống kê dụng cụ tất cả thực đơn',
      toolTableData,
    });
    XLSX.utils.book_append_sheet(wb, wsTotal2, 'Tổng nguyên liệu - dụng cụ');

    // Dish sheets
    const allDish = Utils.getDishesInMenu(menus);
    allDish.forEach((dish) => {
      const itemStatsByDish = Utils.getItemStatsByDishId(dish.id, menus);
      const itemTableByDish = this.convertToItemTable(itemStatsByDish);
      const toolStatsByDish = Utils.getToolStatsByDishId(dish.id, menus);
      const toolTableByDish = this.convertToToolTable(toolStatsByDish);
      const wsDish = this.createSheet({
        itemTitle: `Tổng nguyên liệu cho món ${dish.name}`,
        itemTableData: itemTableByDish,
        toolTitle: `Tổng dụng cụ cho món ${dish.name}`,
        toolTableData: toolTableByDish,
      });
      XLSX.utils.book_append_sheet(wb, wsDish, dish.name);
    });

    const saveFile = await remote.dialog.showSaveDialog({
      title: 'Lưu tệp thống kê',
      filters: [
        {
          name: 'Spreadsheets',
          extensions: EXTENSIONS,
        },
      ],
    });

    XLSX.writeFile(wb, saveFile.filePath);
    remote.dialog.showMessageBox({
      message: 'Đã xuất tệp thống kê tại ' + saveFile.filePath,
      buttons: ['OK'],
    });
  }

  createSheet(sheetOptions: SheetOptions): XLSX.WorkSheet {
    const ws = XLSX.utils.aoa_to_sheet([[sheetOptions.itemTitle]]);

    XLSX.utils.sheet_add_json(ws, sheetOptions.itemTableData, {
      header: ['STT', 'Tên nguyên liệu', 'Nơi cung cấp', 'Số lượng', 'Đơn vị'],
      origin: 'A2',
    });

    XLSX.utils.sheet_add_aoa(ws, [[sheetOptions.toolTitle]], {
      origin: {
        r: sheetOptions.itemTableData.length + 4,
        c: 0,
      },
    });

    XLSX.utils.sheet_add_json(ws, sheetOptions.toolTableData, {
      header: ['STT', 'Tên dụng cụ', 'Kích cỡ', 'Số lượng', 'Đơn vị'],
      origin: {
        r: sheetOptions.itemTableData.length + 5,
        c: 0,
      },
    });

    return ws;
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
