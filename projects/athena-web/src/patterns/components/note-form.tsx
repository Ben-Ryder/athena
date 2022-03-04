import React from "react";
import { StrictReactNode } from "../../types/strict-react-node";
import { Field, Form, Formik, FormikHelpers } from "formik";

import { INoteContent } from "@ben-ryder/athena-js-sdk";

import { Button } from "../elements/button/button";


export interface NoteFormProps {
    initialValues: INoteContent,
    onSubmit: (values: INoteContent, helpers: FormikHelpers<INoteContent>) => Promise<void>,
    leftContent?: StrictReactNode
}


export function NoteForm(props: NoteFormProps) {
    return (
        <Formik
            initialValues={props.initialValues}
            onSubmit={props.onSubmit}
        >
            {({values, handleChange}) => (
                <Form className="absolute h-full w-full flex flex-col">
                    <div className="border-b">
                        <label htmlFor="note-title" className="sr-only">Title</label>
                        <Field
                            id="note-title" name="title" type="text" placeholder="enter title..."
                            className="block w-full px-4 min-h-[40px] text-center"
                            value={values.title} onChange={handleChange}
                        />
                    </div>

                    <div className="h-full">
                        <label htmlFor="note-body" className="sr-only">Body</label>
                        <Field
                            as="textarea" id="note-body" name="body" type="text" placeholder="an awesome note..."
                            className="block w-full p-4 resize-none min-h-full"
                            value={values.body} onChange={handleChange}
                        />
                    </div>

                    <div className="absolute bottom-0 w-full p-4 flex justify-between">
                        <div>
                            {props.leftContent && props.leftContent}
                        </div>
                        <div>
                            <Button type="submit">Save</Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}