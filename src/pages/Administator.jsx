import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  UserIcon,
  BookIcon,
  CreditCardIcon,
  ClipboardListIcon,
} from 'lucide-react'
import Navbar from '../components/Navbar';


const Administator = () => {
    const { authUser, position } = useAuthStore();

    if (!authUser || position !== 'Administator') {
        return <Navigate to="/login" />;
    }

    return (
      <div>
        <Navbar/>
        <div className="space-y-4 max-w-md mx-auto" style={{ paddingTop: '100px' }}> 

          <Link to="/admin/managerStudent" style={{
            backgroundColor: '#ddd',
              padding: '15px 50px', 
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#333',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'}}>
                <UserIcon className="w-6 h-6 text-gray-700" />
                 Quản Lý Sinh Viên
          </Link>

          <Link to="/admin/managerBook" style={{
            backgroundColor: '#ddd',
              padding: '15px 50px', 
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#333',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'}}>
                 <BookIcon className="w-6 h-6 text-gray-700" />
                 Quản Lý Sách 
          </Link>

          <Link to="/admin/managerDocket" style={{
            backgroundColor: '#ddd',
              padding: '15px 50px', 
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#333',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'}}>
                 <ClipboardListIcon  className="w-6 h-6 text-gray-700" />
                 Quản Lý Mượn Trả Sách 
          </Link>
          
          <Link to="/admin/managerCard" style={{
            backgroundColor: '#ddd',
              padding: '15px 50px', 
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#333',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'}}>
                 <CreditCardIcon  className="w-6 h-6 text-gray-700" />
                 Quản Lý Thẻ Thư Viện
          </Link>

        </div>

      </div>
    );
};

export default Administator;