import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function DeleteUserModal(props: Props) {
  return (
    <Modal
      aria-label="filter"
      size="xl"
      isOpen={props.isOpen}
      onClose={() => {
        props.onClose();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <h1>Are you sure you want to delete this user?</h1>
            </ModalBody>
            <ModalFooter>
              <Button onPress={() => onClose()}>Cancel</Button>
              <Button color="danger" onPress={() => props.onSubmit()}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
