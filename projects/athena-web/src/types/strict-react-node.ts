/**
 * React.ReactNode is commonly used for type checking "something that can be rendered by React"
 * however it is functionally equivalent to `any`.
 * Learn more here: https://changelog.com/posts/the-react-reactnode-type-is-a-black-hole.
 *
 * StrictReactNode is taken from that blog post and implements the expected functionality of React.ReactNode.
 */

import { ReactChild, ReactPortal, ReactNodeArray } from 'react';

export type StrictReactFragment =
  | {
  key?: string | number | null;
  ref?: null;
  props?: {
    children?: StrictReactNode;
  };
}
  | ReactNodeArray;
export type StrictReactNode =
  | ReactChild
  | StrictReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined;
