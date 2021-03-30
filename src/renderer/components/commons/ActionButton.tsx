import React, { useState } from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
} from '@material-ui/core';
import { Delete, Edit, MoreVert } from '@material-ui/icons';

interface ActionButtonProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export const ActionButton = (props: ActionButtonProps): React.ReactElement => {
  const { onEditClick, onDeleteClick } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenPopup = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopup = (): void => {
    setAnchorEl(null);
  };

  const handleEditClick = (): void => {
    handleClosePopup();
    onEditClick();
  };

  const handleDeleteClick = (): void => {
    handleClosePopup();
    onDeleteClick();
  };

  return (
    <div>
      <IconButton onClick={handleOpenPopup}>
        <MoreVert fontSize="small"></MoreVert>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopup}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <List style={{ padding: '0px' }}>
          <ListItem button onClick={handleEditClick}>
            <ListItemIcon>
              <Edit color="primary" fontSize="small"></Edit>
            </ListItemIcon>
            <ListItemText>Sửa</ListItemText>
          </ListItem>
          <ListItem button onClick={handleDeleteClick}>
            <ListItemIcon>
              <Delete color="error" fontSize="small"></Delete>
            </ListItemIcon>
            <ListItemText>Xóa</ListItemText>
          </ListItem>
        </List>
      </Popover>
    </div>
  );
};
