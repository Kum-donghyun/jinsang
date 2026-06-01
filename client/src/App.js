import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import Layout from './components/Layout';
import Home from './pages/Home';
import Write from './pages/Write';
import Search from './pages/Search';
import MyPage from './pages/MyPage';
import CategoryList from './pages/CategoryList';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import EditProfile from './pages/EditProfile';
import Ranking from './pages/Ranking';
import InteractiveContent from './pages/InteractiveContent';
import ManhwaViewer from './pages/ManhwaViewer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/write" element={<Write />} />
              <Route path="/search" element={<Search />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/mypage" element={<MyPage />} />
            </Route>
            <Route path="/category/:slug" element={<CategoryList />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/interactive/:slug" element={<InteractiveContent />} />
            <Route path="/manhwa/:episode" element={<ManhwaViewer />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
