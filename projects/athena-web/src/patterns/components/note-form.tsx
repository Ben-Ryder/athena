import React from "react";
import { StrictReactNode } from "../../types/strict-react-node";

import { INoteContent } from "@ben-ryder/athena-js-lib";

import { Button } from "../elements/button/button";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";

export interface NoteFormProps {
    initialValues: INoteContent,
    onSubmit: SubmitHandler<INoteContent>,
    leftContent?: StrictReactNode
}

function NoteFormError(errors:  FieldErrors<INoteContent>) {
    let error: string|undefined;
    if (errors.title) {
        error = errors.title.message;
    }
    else if (errors.body) {
        error = errors.body.message;
    }

    if (error) {
        return (<p className="text-sm flex items-center text-red-600">{error}</p>)
    }
    else {
        return null;
    }
}

export function NoteForm(props: NoteFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<INoteContent>();

    return (
      <form onSubmit={handleSubmit(props.onSubmit)} className="absolute h-full w-full flex flex-col">
          <div className="border-b">
              <label htmlFor="note-title" className="sr-only">Title</label>
              <input
                {...register("title")} defaultValue={props.initialValues.title}
                type="text" placeholder="enter title..."
                className="block w-full px-4 min-h-[40px] text-center"
              />
          </div>
          <div className="h-full">
              <label htmlFor="note-body" className="sr-only">Body</label>
              <textarea
                {...register("body")} defaultValue={props.initialValues.body || ""}
                placeholder="an awesome note..."
                className="block w-full p-4 resize-none min-h-full"
              />
          </div>
          <div className="absolute bottom-0 w-full p-4 flex justify-between">
              <div>
                  {props.leftContent && props.leftContent}
              </div>
              <NoteFormError />
              <div>
                  <Button type="submit">Save</Button>
              </div>
          </div>
      </form>
    )
}
