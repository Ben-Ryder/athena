import React from 'react';

import { Link } from 'react-router-dom';


export function Header() {
  return (
    <div className="flex min-h-[50px] bg-br-atom-800">
      <Link className="mx-4 flex items-center" to="/">Home</Link>
      <Link className="mx-4 flex items-center" to="/notes">Notes</Link>
        <Link className="mx-4 flex items-center" to="/user/logout">Logout</Link>
    </div>
  );
}
