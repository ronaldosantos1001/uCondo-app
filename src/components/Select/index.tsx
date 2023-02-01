import React from 'react';
import { ISelectProps, Box, useTheme } from 'native-base';
import { useController } from 'react-hook-form';
import Select from './style';
import Label from '../Label';

interface Option {
  label: string;
  value: string | boolean | number;
}

interface SelectProps extends ISelectProps {
  options: Option[];
  name: string;
  label?: string;
  isRequired?: boolean;
}

export default function CustomSelect({
  options,
  name,
  label,
  ...props
}: SelectProps): JSX.Element {
  const theme = useTheme();
  const { field, fieldState } = useController({
    name,
    rules: {
      required: props.isRequired,
    },
  });

  const { value, onChange, ref } = field;

  return (
    <>
      {label && <Label>{label}</Label>}
      <Box bg={theme.colors.custom.white} borderRadius={10} overflow="hidden">
        <Select
          {...props}
          variant="unstyled"
          onValueChange={(e) => [onChange(e), props.onValueChange?.(e)]}
          selectedValue={value.toString()}
          ref={ref}
        >
          {options.map(({ label, value }, i) => (
            <Select.Item key={i} label={label} value={value.toString()} />
          ))}
        </Select>
      </Box>
    </>
  );
}
