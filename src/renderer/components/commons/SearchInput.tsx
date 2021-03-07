import React from 'react';
import { TextField } from '@material-ui/core';

interface SearchInputProps {
  onFinishChange: (value: string) => void;
  size?: 'small' | 'medium';
  style?: React.CSSProperties;
}

export const SearchInput = (props: SearchInputProps): React.ReactElement => {
  let timer: NodeJS.Timeout;

  const handleChangeValue = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      props.onFinishChange(event.target.value);
    }, 1000);
  };

  return (
    <TextField
      label="Tìm kiếm"
      placeholder="Nhập từ khóa"
      variant="outlined"
      onChange={handleChangeValue}
      style={{
        ...props.style,
        width: 250,
      }}
      type="search"
      size={props.size || 'medium'}
    />
  );
};
