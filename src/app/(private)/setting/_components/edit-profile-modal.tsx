import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { Controller } from "react-hook-form";

interface EditProfileModalProps {
  profileControl: any;
  handleSaveProfile?: any;
  handleFileChange?: any;
  inputFileRef: any;
  valueBio: string;
  setValueBio: any;
  open: boolean;
  setOpen: any;
  selectedAvatar?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  } | null;
}

export default function EditProfileModal(props: EditProfileModalProps) {
  return (
    <Modal isOpen={props.open} onOpenChange={props.setOpen} size="3xl">
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalBody>
          <div>
            <form
              onSubmit={props.handleSaveProfile}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative w-40 h-40 rounded-full overflow-hidden">
                <Avatar
                  src={props.selectedAvatar?.url || ""}
                  className="w-full h-full"
                />
              </div>
              <Controller
                name="name"
                control={props.profileControl}
                rules={{
                  required: { value: true, message: "Name is required" },
                }}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Input
                    type="text"
                    variant="bordered"
                    placeholder="Name"
                    errorMessage={error?.message}
                    isInvalid={invalid}
                    {...field}
                  />
                )}
              />
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="bordered"
                  className="border-promary text-primary"
                  onPress={() => props.setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-white"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
