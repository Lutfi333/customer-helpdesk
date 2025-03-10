"use client";
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import { HiMailOpen, HiOutlineInformationCircle } from "react-icons/hi";

export default function VerifyCard(props: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setError] = useState<boolean>(false);

  const { mutate, isPending } = useHttpMutation("/customer/auth/verify", {
    method: "POST",
    queryOptions: {
      onSuccess: () => {
        setIsLoading(false);
        setError(false);
        toast.success("Email verified successfully");
      },
      onError: (e) => {
        setIsLoading(false);
        setError(true);
        toast.error(e.data.message);
      },
    },
  });
  useEffect(() => {
    setIsLoading(true);
    if (props.id) {
      mutate({ token: props.id });
    } else {
      router.replace("/login");
    }
  }, [props.id, mutate, router]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Spinner />
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="w-5/12 h-2/5 rounded-lg p-5 flex items-center">
        <CardBody>
          <div className="flex flex-col h-full items-center justify-center space-y-3">
            <HiOutlineInformationCircle size={100} className="text-red-500" />
            <div className="mt-3">
              <p className="text-center text-slate-500 ">
                Verification token is invalid or expired.
              </p>
            </div>
            <Button
              className="w-full mt-3 bg-red-500 text-white hover:bg-red-800"
              onPress={() => {
                router.replace("/login");
              }}
            >
              Login
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-10/12 md:w-5/12 h-2/5 rounded-lg p-5 flex items-center">
      <CardBody>
        <div className="flex flex-col h-full items-center justify-center space-y-3">
          <HiMailOpen size={100} className="text-primary" />
          <div className="mt-3">
            <p className="text-center text-slate-500 ">
              Your email has been verified successfully.
            </p>
          </div>
          <Button
            className="w-full mt-3 bg-primary text-white hover:bg-gray-600"
            onClick={() => {
              router.replace("/login");
            }}
          >
            Login
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
