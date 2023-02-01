import React from 'react';
import { IInputProps } from 'native-base';

import { useController, Controller, useFormContext } from 'react-hook-form';
import Input from './style';
import Label from '../Label';
interface CustomInputProps extends IInputProps {
  name: string;
  label?: string;
}

export default function CustomInput({
  name,
  label,
  ...props
}: CustomInputProps): JSX.Element {
  const { field } = useController({
    name,
    rules: { required: props.isRequired },
  });
  const { value, ref, onChange } = field;

  return (
    <>
      {label && <Label>{label}</Label>}
      <Input
        {...props}
        value={value}
        onChangeText={(e) => [onChange(e), props.onChangeText?.(e)]}
        ref={ref}
      />
    </>
  );
}
