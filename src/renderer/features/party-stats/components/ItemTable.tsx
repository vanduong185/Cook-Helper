import { Box } from '@material-ui/core';
import { CellParams, DataGrid } from '@material-ui/data-grid';
import React, { ReactElement } from 'react';
import { ItemDTO } from '../../../dto/ItemDTO';
import { ItemStatsDTO } from '../../../dto/ItemStatsDTO';

interface Props {
  itemStats: ItemStatsDTO[];
}

export const ItemTable = (props: Props): ReactElement => {
  return (
    <Box>
      <h4>Tổng nguyên liệu cần</h4>
      <Box
        style={{
          width: '100%',
          height:
            props.itemStats.length <= 0
              ? '170px'
              : props.itemStats.length < 5
              ? props.itemStats.length * 62 + 108
              : '400px',
        }}
      >
        <DataGrid
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
          pageSize={10}
        />
      </Box>
    </Box>
  );
};
