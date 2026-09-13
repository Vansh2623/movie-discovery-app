import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#141414', color: '#fff', borderBottom: '1px solid #333' }}>
      <Link to="/" style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', textDecoration: 'none' }}>
        🎬 Movie Discovery App
      </Link>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Home</Link>
        <Link to="/wishlist" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Wishlist</Link>
      </div>
    </nav>
  );
}