import * as ExcelJS from 'exceljs';
import { remote, shell } from 'electron';
import { Utils } from './Utils';
import { MenuDTO } from '../dto/MenuDTO';
import { ItemStatsDTO } from '../dto/ItemStatsDTO';
import { ToolStatsDTO } from '../dto/ToolStatsDTO';

const EXTENSIONS = 'xlsx|xls|xlsm|xlsb|xml|csv|txt|dif|sylk|slk|prn|ods|fods|htm|html'.split(
  '|',
);

export const exportItemToolFile = async (menus: MenuDTO[]): Promise<void> => {
  const workbook = new ExcelJS.Workbook();

  const createItemSheet = (): ExcelJS.Worksheet => {
    const ws = workbook.addWorksheet('Tổng nguyên liệu');
    ws.pageSetup.margins = {
      left: 0.25,
      right: 0.25,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    };
    ws.properties.defaultRowHeight = 16;

    let rowPos = 1;

    const itemStats = Utils.getItemStats(menus);
    createItemTableToWorksheet(
      ws,
      rowPos,
      'Thống kê tổng nguyên liệu',
      itemStats,
    );
    rowPos = rowPos + itemStats.length + 4;

    const allDishes = Utils.getDishesInMenu(menus);
    allDishes.forEach((dish) => {
      const itemStatsByDish = Utils.getItemStatsByDishId(dish.id, menus);
      createItemTableToWorksheet(ws, rowPos, dish.name, itemStatsByDish);
      rowPos = rowPos + itemStatsByDish.length + 4;
    });

    ws.columns[0].width = 8;
    ws.columns[1].width = 30;
    ws.columns[2].width = 30;
    ws.columns[3].width = 14;
    ws.columns[4].width = 12;

    return ws;
  };

  const createToolSheet = (): ExcelJS.Worksheet => {
    const ws = workbook.addWorksheet('Tổng dụng cụ');
    ws.pageSetup.margins = {
      left: 0.25,
      right: 0.25,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    };
    ws.properties.defaultRowHeight = 16;

    let rowPos = 1;

    const toolStats = Utils.getToolStats(menus);
    createToolTableToWorksheet(ws, rowPos, 'Thống kê tổng dụng cụ', toolStats);
    rowPos = rowPos + toolStats.length + 4;

    const allDishes = Utils.getDishesInMenu(menus);
    allDishes.forEach((dish) => {
      const toolStatsByDish = Utils.getToolStatsByDishId(dish.id, menus);
      createToolTableToWorksheet(ws, rowPos, dish.name, toolStatsByDish);
      rowPos = rowPos + toolStatsByDish.length + 4;
    });

    ws.columns[0].width = 8;
    ws.columns[1].width = 30;
    ws.columns[2].width = 30;
    ws.columns[3].width = 14;
    ws.columns[4].width = 12;

    return ws;
  };

  createItemSheet();
  createToolSheet();

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

  await workbook.xlsx.writeFile(saveFile.filePath);

  remote.dialog
    .showMessageBox({
      type: 'question',
      message: `Đã xuất tệp thống kê. Bạn có muốn mở tệp này không?`,
      detail: `Đường dẫn tệp ${saveFile.filePath}`,
      buttons: ['Đóng', 'Mở tệp'],
      defaultId: 1,
    })
    .then((value) => {
      if (value.response === 1) {
        shell.openPath(saveFile.filePath);
      }
    });
};

export const exportItemProviderFile = async (
  menus: MenuDTO[],
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const itemStats = Utils.getItemStats(menus);
  const allDishes = Utils.getDishesInMenu(menus);
  const providers: string[] = [];

  // get providers
  itemStats.forEach((itemStat): void => {
    if (providers.indexOf(itemStat.item.provider) < 0) {
      providers.push(itemStat.item.provider);
    }
  });

  // make sheet for each provider
  providers.forEach((provider) => {
    const ws = workbook.addWorksheet(provider.substring(0, 30));
    ws.pageSetup.margins = {
      left: 0.25,
      right: 0.25,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    };
    ws.properties.defaultRowHeight = 16;

    let rowPos = 1;

    const itemsStatByProvider = itemStats.filter(
      (itemStat) => itemStat.item.provider === provider,
    );
    createItemTableToWorksheet(
      ws,
      rowPos,
      `Thống kê nguyên liệu theo nơi cung cấp ${provider}`.toUpperCase(),
      itemsStatByProvider,
    );
    rowPos = rowPos + itemsStatByProvider.length + 4;

    // stat item of provider by dish
    allDishes.forEach((dish) => {
      // get item dish data
      const itemStatsByDish = Utils.getItemStatsByDishId(dish.id, menus);
      const itemStatByDishAndProvider = itemStatsByDish.filter(
        (stat) => stat.item.provider === provider,
      );
      if (itemStatByDishAndProvider.length === 0) {
        return;
      }

      createItemTableToWorksheet(
        ws,
        rowPos,
        dish.name.toUpperCase(),
        itemStatByDishAndProvider,
      );
      rowPos = rowPos + itemStatByDishAndProvider.length + 4;
    });

    ws.columns[0].width = 8;
    ws.columns[1].width = 30;
    ws.columns[2].width = 30;
    ws.columns[3].width = 14;
    ws.columns[4].width = 12;
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

  if (saveFile.canceled) {
    return;
  }

  await workbook.xlsx.writeFile(saveFile.filePath);

  remote.dialog
    .showMessageBox({
      type: 'question',
      message: `Đã xuất tệp thống kê. Bạn có muốn mở tệp này không?`,
      detail: `Đường dẫn tệp ${saveFile.filePath}`,
      buttons: ['Đóng', 'Mở tệp'],
      defaultId: 1,
    })
    .then((value) => {
      if (value.response === 1) {
        shell.openPath(saveFile.filePath);
      }
    });
};

const createItemTableToWorksheet = (
  ws: ExcelJS.Worksheet,
  rowPos: number,
  title: string,
  data: ItemStatsDTO[],
): void => {
  // title
  const titleRow = ws.insertRow(rowPos, [title.toUpperCase()]);
  titleRow.height = 26;
  const titleCell = titleRow.getCell(1);
  titleCell.font = {
    size: 16,
    bold: true,
  };
  titleCell.alignment = {
    vertical: 'middle',
  };

  // table
  const headerRow = ws.insertRow(rowPos + 1, [
    'STT',
    'Tên nguyên liệu',
    'Nơi cung cấp',
    'Số lượng',
    'Đơn vị',
  ]);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    cell.font = {
      size: 14,
      bold: true,
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffd59c' },
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } },
    };
  });

  data.forEach((item, index) => {
    const row = ws.insertRow(rowPos + 2 + index, [
      index + 1,
      item.item.name,
      item.item.provider,
      item.amount,
      item.item.unit.name,
    ]);

    row.height = 18;
    row.eachCell((cell, colNumber) => {
      cell.alignment = {
        horizontal: colNumber === 1 ? 'center' : undefined,
        vertical: 'middle',
      };
      cell.font = {
        size: 14,
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
    });
  });
};

const createToolTableToWorksheet = (
  ws: ExcelJS.Worksheet,
  rowPos: number,
  title: string,
  data: ToolStatsDTO[],
): void => {
  // title
  const titleRow = ws.insertRow(rowPos, [title.toUpperCase()]);
  titleRow.height = 26;
  const titleCell = titleRow.getCell(1);
  titleCell.font = {
    size: 16,
    bold: true,
  };
  titleCell.alignment = {
    vertical: 'middle',
  };

  // table
  const headerRow = ws.insertRow(rowPos + 1, [
    'STT',
    'Tên dụng cụ',
    'Kích cỡ',
    'Số lượng',
    'Đơn vị',
  ]);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    cell.font = {
      size: 14,
      bold: true,
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ff9edbae' },
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } },
    };
  });

  data.forEach((item, index) => {
    const row = ws.insertRow(rowPos + 2 + index, [
      index + 1,
      item.tool.name,
      item.tool.size,
      item.amount,
      item.tool.unit.name,
    ]);

    row.height = 18;
    row.eachCell((cell, colNumber) => {
      cell.alignment = {
        horizontal: colNumber === 1 ? 'center' : undefined,
        vertical: 'middle',
      };
      cell.font = {
        size: 14,
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
    });
  });
};
