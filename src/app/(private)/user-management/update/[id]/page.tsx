"use client";
import { Fragment } from "react";
import CreateUser from "../../_components/create-user";

export default function UpdateUserPage({
  params,
}: {
  params: {
    id: string;
}
}) {
  return (
    <Fragment>
      <CreateUser id={params.id} isEdit={true}/>
    </Fragment>
  );
}