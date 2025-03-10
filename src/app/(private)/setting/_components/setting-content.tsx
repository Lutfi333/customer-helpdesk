/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAuthMe } from "@/services/auth";
import { useDetailCompany } from "@/services/company";
import { useChangePassword } from "@/services/setting";
import { Avatar, Card, CardBody, Button, Input } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineEyeOff, HiPencil } from "react-icons/hi";
import EditProfileModal from "./edit-profile-modal";

interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export default function SettingContent() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isEditProfile, setEditProfile] = useState(false);
  const [isEditPassword, setEditPassword] = useState(false);
  const [isEditDomain, setEditDomain] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [valueBio, setValueBio] = useState("");
  const [valueName, setValueName] = useState("");
  const [valueDomain, setValueDomain] = useState("");
  const [visibleOld, setVisibleOld] = useState(false);
  const [visibleNew, setVisibleNew] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const { control, handleSubmit, setValue } = useForm<{
    isCustom: boolean;
    subdomain: string;
    fullUrl: string;
  }>({
    mode: "all",
  });

  const {
    control: passControl,
    handleSubmit: handleSubmitPass,
    setValue: setValuePass,
    setError: setErrorPass,
  } = useForm<{
    oldPassword: string;
    newPassword: string;
  }>({
    mode: "all",
  });

  const {
    control: profileControl,
    handleSubmit: handleSubmitProfile,
    setValue: setValueProfile,
  } = useForm<{
    name: string;
    attachment: string;
  }>({
    mode: "all",
  });

  const { data, isFetching, refetch } = useAuthMe();
  const { data: company, refetch: refetchCompany } = useDetailCompany();
  const { mutate: updatePassword } = useChangePassword();

  useEffect(() => {
    if (data?.data) {
      setValueName(data?.data?.name);
    }
  }, [data]);

  useEffect(() => {
    if (company?.data) {
      setIsCustom(company?.data?.settings.domain?.isCustom);
      setValue(
        "fullUrl",
        isCustom
          ? company?.data?.settings.domain?.fullUrl
          : company?.data?.settings.domain?.subdomain,
      );
    }
  }, [company, setValue]);

  const onSubmitPass = handleSubmitPass((payload) => {
    updatePassword(
      {
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Success to update password");
          setValuePass("oldPassword", "");
          setValuePass("newPassword", "");
          setEditPassword(false);
        },
        onError: (e) => {
          toast.error(e.data.message);
          if (e.data.validation) {
            if (e.data.validation.oldPassword) {
              setErrorPass("oldPassword", {
                message: e.data.validation.oldPassword,
              });
            }
            if (e.data.validation.newPassword) {
              setErrorPass("newPassword", {
                message: e.data.validation.newPassword,
              });
            }
          }
        },
      },
    );
  });

  const toggleVisiblePass = (type: string) => {
    type == "new" ? setVisibleNew(!visibleNew) : setVisibleOld(!visibleOld);
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      <Card>
        <CardBody className="p-4">
          <h1 className="font-semibold text-xl">Profile</h1>
          <>
            <div className="flex items-center mt-2">
              {!isFetching && (
                <div className="w-20 h-20">
                  <Avatar
                    className="w-20 h-20 text-large"
                    src={data?.data?.profilePicture?.url ?? ""}
                  />
                </div>
              )}
              <div className="w-full mx-5">
                <p>{data?.data?.name ?? ""}</p>
              </div>
              {/* <Button
                onPress={() => {
                  setValueProfile("name", data?.data?.name ?? "");
                  setEditProfile(true);
                }}
              >
                <HiPencil size={20} />
                Edit
              </Button> */}
            </div>
          </>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="p-4">
          <h1 className="font-semibold text-xl">Account Setting</h1>
          {isEditPassword ? (
            <form onSubmit={onSubmitPass}>
              <div className="flex flex-col gap-3">
                <Controller
                  name="oldPassword"
                  control={passControl}
                  render={({ field, fieldState: { error, invalid } }) => (
                    <Input
                      id="oldPassword"
                      label="Old Password"
                      type={visibleOld ? "text" : "password"}
                      labelPlacement="outside"
                      variant="bordered"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      className="w-4/12"
                      placeholder=""
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={() => toggleVisiblePass("old")}
                        >
                          {visibleOld ? (
                            <HiOutlineEyeOff className="h-5 w-5 text-default-500" />
                          ) : (
                            <HiOutlineEye className="h-5 w-5 text-default-500" />
                          )}
                        </button>
                      }
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="newPassword"
                  control={passControl}
                  render={({ field, fieldState: { error, invalid } }) => (
                    <Input
                      id="newPassword"
                      label="New Password"
                      type={visibleNew ? "text" : "password"}
                      labelPlacement="outside"
                      variant="bordered"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      className="w-4/12"
                      placeholder=""
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={() => toggleVisiblePass("new")}
                        >
                          {visibleNew ? (
                            <HiOutlineEyeOff className="h-5 w-5 text-default-500" />
                          ) : (
                            <HiOutlineEye className="h-5 w-5 text-default-500" />
                          )}
                        </button>
                      }
                      {...field}
                    />
                  )}
                />
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant="bordered"
                    className="border-promary text-primary"
                    onPress={() => {
                      setEditPassword(false);
                      setValuePass("oldPassword", "");
                      setValuePass("newPassword", "");
                    }}
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
              </div>
            </form>
          ) : (
            <div className="flex items-start mt-2 gap-3">
              <div>
                <p className="text-slate-400 text-md">Email</p>
                <p className="text-gray-500">{data?.data.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-md">Password</p>
                <Button
                  onPress={() => setEditPassword(true)}
                  size="sm"
                  className="bg-primary text-white"
                >
                  Change Password
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
      <EditProfileModal
        open={isEditProfile}
        setOpen={setEditProfile}
        profileControl={profileControl}
        inputFileRef={inputFileRef}
        valueBio={valueBio}
        setValueBio={setValueBio}
        selectedAvatar={attachment || null}
      />
    </div>
  );
}
