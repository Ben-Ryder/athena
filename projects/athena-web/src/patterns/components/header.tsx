import React from 'react';

import { Link } from 'react-router-dom';


export function Header() {
  return (
    <div className="flex min-h-[50px] border-b border-1">
      <Link className="mx-4 flex items-center" to="/">Home</Link>
      <Link className="mx-4 flex items-center" to="/notes">Notes</Link>
    </div>
  );
}
