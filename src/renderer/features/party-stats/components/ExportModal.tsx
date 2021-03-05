import React, { ReactElement } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Paper, IconButton, Button } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { SheetExport } from '../../../utils/SheetExport';
import { MenuDTO } from '../../../dto/MenuDTO';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '650px',
      height: '300px',
      padding: theme.spacing(2, 4, 3),
      overflow: 'auto',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    exportButton: {
      width: 250,
      height: 100,
      margin: '20px',
    },
  }),
);

interface Props {
  onClose: () => void;
  menus: MenuDTO[];
}

export const ExportModal = (props: Props): ReactElement => {
  const classes = useStyles();

  const handleStatItemTool = (): void => {
    const sheetExport = new SheetExport();
    sheetExport.exportItemToolStat(props.menus);
  };

  const handleStatByProvider = (): void => {
    const sheetExport = new SheetExport();
    sheetExport.exportItemByProvider(props.menus);
  };

  return (
    <Paper className={classes.paper}>
      <IconButton className={classes.closeButton} onClick={props.onClose}>
        <Close />
      </IconButton>
      <h1>Xuất Excel</h1>
      <Button
        className={classes.exportButton}
        variant="contained"
        color="primary"
        onClick={handleStatItemTool}
      >
        Thống kê nguyên liệu - dụng cụ
      </Button>
      <Button
        className={classes.exportButton}
        variant="contained"
        color="primary"
        onClick={handleStatByProvider}
      >
        Thống kê nguyên liệu theo nơi cung cấp
      </Button>
    </Paper>
  );
};
