import React from 'react';
import { StrictReactNode } from '../../types/strict-react-node';
import {Helmet} from "react-helmet-async";
import { H1 } from "@ben-ryder/jigsaw";
import {Page} from "./page";
import {PageHeader} from "../regions/page-header";


export interface FormPageProps {
  title: string,
  description?: string | StrictReactNode,
  children: StrictReactNode
}

export function FormPage(props: FormPageProps) {
  const description = typeof props.description === 'string' ? <p>{props.description}</p> : props.description;

  return (
    <>
      <Helmet>
        <title>{`${props.title} | Athena`}</title>
      </Helmet>
      <div className="bg-br-atom-700 min-h-[100vh] flex flex-col">
        <PageHeader />
        <div className="grow flex justify-center items-center">
          <main className="max-w-md mx-auto mt-3">
            <div>
              <H1 className="text-br-teal-600">{props.title}</H1>
              {props.description && description}
            </div>
            <div className="mt-6">
              {props.children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
