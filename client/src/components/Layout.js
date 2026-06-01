import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaPen, FaSearch, FaTrophy, FaUser } from 'react-icons/fa';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <FaHome />, label: '홈' },
    { path: '/write', icon: <FaPen />, label: '글작성' },
    { path: '/search', icon: <FaSearch />, label: '검색' },
    { path: '/ranking', icon: <FaTrophy />, label: '랭킹' },
    { path: '/mypage', icon: <FaUser />, label: '마이' },
  ];

  return (
    <>
      <header className="header">
        <h1 className="header-title">진상도감</h1>
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
