import React from 'react';
import { StrictReactNode } from '../../types/strict-react-node';

import { Header } from '../components/header';


export interface PageProps {
  children: StrictReactNode
}

export function Page(props: PageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="grow relative">
        {props.children}
      </div>
    </div>
  );
}
