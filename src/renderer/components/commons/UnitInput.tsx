import React, { ReactElement } from 'react';
import { createFilterOptions, Autocomplete } from '@material-ui/lab';
import { UnitDTO } from '../../dto/UnitDTO';
import { TextField } from '@material-ui/core';

const filter = createFilterOptions<UnitSelection>();

class UnitSelection extends UnitDTO {
  inputValue?: string;
}

interface Props {
  unitsData: UnitDTO[];
  value: UnitDTO;
  error: boolean;
  helperText: string;
  onChange: (unit: UnitDTO) => void;
}

export const UnitInput = (props: Props): ReactElement => {
  const { unitsData, value, error, helperText, onChange } = props;

  const unitSelections = unitsData.map(
    (unit): UnitSelection => unit as UnitSelection,
  );
  const unitSelected = value as UnitSelection;

  const selectUnit = (unitSelection: UnitSelection): void => {
    let unit: UnitDTO;

    if (!unitSelection) {
      unit = undefined;
    } else {
      unit = {
        id: unitSelection.id,
        name: unitSelection.inputValue || unitSelection.name,
      };
    }

    onChange(unit);
  };

  return (
    <Autocomplete
      freeSolo
      selectOnFocus
      clearOnBlur
      options={unitSelections}
      filterOptions={(options, params): UnitSelection[] => {
        const filtered = filter(options, params);

        // Suggest the creation of a new value
        if (params.inputValue !== '') {
          filtered.push({
            id: undefined,
            inputValue: params.inputValue,
            name: `Thêm "${params.inputValue}"`,
          });
        }

        return filtered;
      }}
      getOptionLabel={(unit): string => {
        // Value selected with enter, right from the input
        if (typeof unit === 'string') {
          return unit;
        }
        // Add "xxx" option created dynamically
        if (unit.inputValue) {
          return unit.inputValue;
        }
        // Regular option
        return unit.name;
      }}
      renderOption={(unit): string => unit.name}
      renderInput={(params): ReactElement => (
        <TextField
          {...params}
          required
          label="Đơn vị"
          placeholder="Nhập tên đơn vị"
          error={error}
          helperText={helperText}
          variant="outlined"
        />
      )}
      value={unitSelected || null}
      onChange={(_, unit): void => {
        selectUnit(unit as UnitSelection);
      }}
      style={{
        width: 350,
      }}
    />
  );
};
