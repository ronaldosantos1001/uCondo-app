import React, { useRef } from 'react';
import { Modal } from 'react-native';
import { Button, Text, Box, Center, useTheme, VStack } from 'native-base';

interface CustomAlertModalProps {
  isOpen?: boolean;
  onClose: (val?: boolean) => void;
  onConfirmation: () => void;
  title: string | JSX.Element;
  message: string | JSX.Element;
}

export default function CustomAlertModal({
  isOpen = false,
  onClose,
  onConfirmation,
  title,
  message,
}: CustomAlertModalProps): JSX.Element {
  const cancelRef = useRef(null);
  // O cancelRef é utilizado para poder fechar o modal ao clicar no botão "Não!"

  const { colors } = useTheme();

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="slide"
      onRequestClose={() => onClose(false)}
    >
      <Center pt={40}>
        <Box bgColor={colors.custom.white} p={10} borderRadius={20}>
          <VStack space={4}>
            {typeof title === 'string' ? (
              <Text fontSize="xl" fontWeight="bold">
                {title}
              </Text>
            ) : (
              title
            )}
            {typeof message === 'string' ? (
              <Text>{message}</Text>
            ) : (
              message
            )}
            <Center>
              <Button.Group size="sm">
                <Button
                  ref={cancelRef}
                  onPress={() => onClose()}
                  variant="ghost"
                >
                  <Text color={colors.custom.danger}> Não!</Text>
                </Button>
                <Button onPress={onConfirmation} bgColor={colors.custom.danger}>
                  Com certeza
                </Button>
              </Button.Group>
            </Center>
          </VStack>
        </Box>
      </Center>
    </Modal>
  );
}
