import React from 'react';
import StudentInfo from '../../components/infomation/StudentInfo';
import BorrowedBooks from '../../components/infomation/BorrowedBooks';
import BookSearch from '../../components/infomation/BookSearch';
const HomePage = () => {
    return (
      <div className="bg-gray-100 min-h-screen p-4 pt-16">  {/* Added pt-16 */}
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <header className="bg-blue-400 text-white p-3 text-center">
            <h1 className="text-xl font-semibold">Thống Tin Quản Lý</h1>
          </header>
          <div className="flex flex-col md:flex-row">
            {/* Student Information */}
            <StudentInfo />
            {/* Borrowed Books */}
            <BorrowedBooks />
          </div>
  
          <BookSearch />
        </div>
      </div>
    );
  };

export default HomePage;