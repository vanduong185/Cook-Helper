import { Box } from '@material-ui/core';
import { CellParams, DataGrid } from '@material-ui/data-grid';
import React, { ReactElement } from 'react';
import { ToolDTO } from '../../../dto/ToolDTO';
import { ToolStatsDTO } from '../../../dto/ToolStatsDTO';

interface Props {
  toolStats: ToolStatsDTO[];
}

export const ToolTable = (props: Props): ReactElement => {
  return (
    <Box
      style={{
        width: '100%',
        height:
          props.toolStats.length <= 0
            ? '178px'
            : props.toolStats.length < 5
            ? props.toolStats.length * 52 + 126
            : '386px',
      }}
    >
      <DataGrid
        rows={props.toolStats}
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
            headerName: 'Tên dụng cụ',
            width: 250,
            valueGetter: (params: CellParams): string => {
              const tool = params.row.tool as ToolDTO;
              return tool.name;
            },
          },
          {
            field: 'size',
            headerName: 'Kích cỡ',
            width: 180,
            valueGetter: (params: CellParams): string => {
              const tool = params.row.tool as ToolDTO;
              return tool.size;
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
              const tool = params.row.tool as ToolDTO;
              return tool.unit.name;
            },
          },
        ]}
        pageSize={5}
      />
    </Box>
  );
};
