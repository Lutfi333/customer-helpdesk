import { TbError404 } from "react-icons/tb";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <TbError404 className="text-9xl text-primary" />
      <div className="text-2xl font-bold">Page Not Found</div>
    </div>
  );
}
