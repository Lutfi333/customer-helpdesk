import VerifyCardClosedTicket from "./_components/verify-card-closed-ticket";

export default function DetailPage({
  params,
}: {
  params: { token: string };
  searchParams: { id: string };
}) {
  return (
    <div className="flex items-center justify-center w-screen h-[calc(100vh)] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500">
      <VerifyCardClosedTicket token={params.token} />
    </div>
  );
}
