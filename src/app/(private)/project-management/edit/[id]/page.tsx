"use client";
import { Fragment } from "react";
import { useProjectDetail } from "@/services/project";
import CreateProject from "../../_components/create-project";

export default function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { data } = useProjectDetail(params.id);
  return (
    <Fragment>
      <CreateProject
        isEdit
        id={params.id}
        defaultValues={{
          name: data?.data.name || "",
          description: data?.data.description || "",
        }}
      />
    </Fragment>
  );
}
