import { Box } from '@material-ui/core';
import { CellParams, DataGrid } from '@material-ui/data-grid';
import React, { ReactElement } from 'react';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../../constants/AppConst';
import { ItemDTO } from '../../../dto/ItemDTO';
import { ItemStatsDTO } from '../../../dto/ItemStatsDTO';
import { Utils } from '../../../utils/Utils';

interface Props {
  itemStats: ItemStatsDTO[];
}

export const ItemTable = (props: Props): ReactElement => {
  return (
    <Box
      style={{
        width: '100%',
        height:
          props.itemStats.length <= 0
            ? '178px'
            : props.itemStats.length < 5
            ? props.itemStats.length * 52 + 126
            : '386px',
      }}
    >
      <DataGrid
        localeText={GRID_DEFAULT_LOCALE_TEXT}
        hideFooterSelectedRowCount
        rows={props.itemStats}
        columns={[
          {
            field: 'seq',
            headerName: 'STT',
            width: 100,
            valueFormatter: (params: CellParams): string => {
              return `${params.rowIndex + 1}`;
            },
          },
          {
            field: 'name',
            headerName: 'Tên nguyên liệu',
            width: 250,
            valueGetter: (params: CellParams): string => {
              const item = params.row.item as ItemDTO;
              return item.name;
            },
          },
          {
            field: 'provider',
            headerName: 'Nơi cung cấp',
            width: 180,
            valueGetter: (params: CellParams): string => {
              const item = params.row.item as ItemDTO;
              return item.provider;
            },
          },
          {
            field: 'amount',
            headerName: 'Số lượng',
            width: 180,
            valueGetter: (params: CellParams): string => {
              const amount = params.value as number;
              const formatAmount = Utils.formatTwoDecimaNumber(amount);
              return formatAmount.toLocaleString();
            },
          },
          {
            field: 'unit',
            headerName: 'Đơn vị',
            width: 180,
            valueGetter: (params: CellParams): string => {
              const item = params.row.item as ItemDTO;
              return item.unit.name;
            },
          },
        ]}
        pageSize={5}
      />
    </Box>
  );
};
