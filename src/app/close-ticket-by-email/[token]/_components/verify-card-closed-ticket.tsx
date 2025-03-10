"use client";
import { Card, CardBody, Spinner } from "@heroui/react";
import toast from "react-hot-toast";

import {
  HiOutlineClipboardCheck,
  HiOutlineInformationCircle,
} from "react-icons/hi";

export default function VerifyCardClosedTicket(props: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setError] = useState<boolean>(false);

  const { mutate, isPending } = useHttpMutation(
    "/customer/ticket/close-by-email",
    {
      method: "POST",
      queryOptions: {
        onSuccess: () => {
          setIsLoading(false);
          setError(false);
          toast.success("Closed ticket verified successfully");
        },
        onError: (e) => {
          setIsLoading(false);
          setError(true);
          toast.error(e.data.message);
        },
      },
    },
  );

  useEffect(() => {
    setIsLoading(true);
    if (props.token) {
      mutate({ token: props.token });
    }
  }, [props.token, router, mutate]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Spinner />
        <p>Loading...</p>
      </div>
    );
  }

  if (isError && !isLoading) {
    return (
      <Card className="w-10/12 md:w-5/12 h-2/5 rounded-lg p-5 flex items-center">
        <CardBody>
          <div className="flex flex-col h-full items-center justify-center space-y-3">
            <HiOutlineInformationCircle size={100} className="text-red-500" />
            <div className="mt-3">
              <p className="text-center text-slate-500 ">
                Your ticket failed to closed. Token is invalid or expired.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-5/12 h-2/5 rounded-lg p-5 flex items-center">
      <CardBody>
        <div className="flex flex-col h-full items-center justify-center space-y-3">
          <HiOutlineClipboardCheck size={100} className="text-primary" />
          <div className="mt-3">
            <p className="text-center text-slate-500 ">
              Your ticket was successfully closed.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
