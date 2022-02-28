import React from 'react';

import { Link } from 'react-router-dom';


export function HomePage() {
  return (
    <div>
      <Link to="/add-notes">Add Note</Link>
      <Link to="/notes">Notes</Link>
    </div>
  );
}

