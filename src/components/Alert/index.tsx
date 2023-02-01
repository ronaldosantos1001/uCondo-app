import React, { useRef } from 'react';
import { Modal } from 'react-native';
import { Button, Stack, useTheme, Text, Box, Center } from 'native-base';

interface AlertProps {
  isOpen?: boolean;
  toggle: (val?: boolean) => void;
  onConfirmation: () => void;
  title: string | JSX.Element;
  message: string | JSX.Element;
}

export default function CustomAlert({
  isOpen,
  toggle,
  onConfirmation,
  title,
  message,
}: AlertProps): JSX.Element {
  const cancelRef = useRef(null);
  const theme = useTheme();

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="slide"
      onRequestClose={() => toggle(false)}
    >
      <Center pt={40}>
        <Box bgColor={theme.colors.custom.white} p={10} borderRadius={20}>
          <Stack space={4}>
            {title}
            {message}
            <Center>
              <Button.Group>
                <Button
                  ref={cancelRef}
                  onPress={() => toggle()}
                  variant="ghost"
                >
                  <Text color={theme.colors.custom.danger}> Não!</Text>
                </Button>
                <Button
                  onPress={onConfirmation}
                  bgColor={theme.colors.custom.danger}
                >
                  Com certeza
                </Button>
              </Button.Group>
            </Center>
          </Stack>
        </Box>
      </Center>
    </Modal>
  );
}
