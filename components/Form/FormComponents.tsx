import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Controller, Control } from 'react-hook-form';

interface InputTypes {
  value?: string | number | number[] | undefined | boolean
  name: any
  control: Control<any, object>
  label: string
  grid?: number
  options?: string[] | number[]
  type?: React.InputHTMLAttributes<unknown>['type'];
  disabled?: boolean
  multiline?: boolean
  rows?: number
}

function InputEdit({
  value, name, control, label, grid, type, disabled, multiline, rows
}: InputTypes) {
  return (
    <Grid item md={grid || 4} className="my-4">
      <Controller
        name={name}
        defaultValue={value || ''}
        control={control}
        render={({ field }) => (
          <TextField
            className="w-full"
            InputLabelProps={{ shrink: true }}
            type={type || 'text'}
            label={label}
            disabled={disabled}
            multiline={multiline}
            rows={rows || 1}
            {...field}

          />)}
      />
    </Grid>
  );
}

export {
  InputEdit
};
