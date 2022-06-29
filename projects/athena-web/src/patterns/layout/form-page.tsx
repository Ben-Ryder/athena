import React from 'react';
import { StrictReactNode } from '../../types/strict-react-node';
import {Helmet} from "react-helmet-async";


export interface FormPageProps {
  title: string,
  description?: string | StrictReactNode,
  children: StrictReactNode
}

export function FormPage(props: FormPageProps) {
  return (
    <>
      <Helmet>
        <title>{`${props.title} | Athena`}</title>
      </Helmet>
      <div>
        <div>
          <h1>{props.title}</h1>
          {props.description && <p>{props.description}</p>}
        </div>
        <div>
          {props.children}
        </div>
      </div>
    </>
  );
}
