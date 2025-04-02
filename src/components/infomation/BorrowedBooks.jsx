import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { axiosInstance } from '../../lib/axios';

const BorrowedBooks = () => {
  const { authUser } = useAuthStore();
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await axiosInstance.get(
          `/getBorrowedBooks?Identification=${authUser.Identification}`
        )
        setBorrowedBooks(response.data);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    }
    if (authUser) {
      fetchBorrowedBooks();
    }
  }, [authUser]);

  return (
    <div className="w-full p-4">
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">
          Danh Sách Những quyển Sách Đã Mượn
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 border text-sm">STT</th>
                <th className="py-2 px-3 border text-sm">Tên Sách</th>
                <th className="py-2 px-3 border text-sm">Ngày Mượn</th>
                <th className="py-2 px-3 border text-sm">Hẹn Trả</th>
                <th className="py-2 px-3 border text-sm">Ngày Trả</th>
                <th className="py-2 px-3 border text-sm">quá Hạn(d)</th>
                <th className="py-2 px-3 border text-sm">Số Lượng</th>
                <th className="py-2 px-3 border text-sm">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.length > 0 ? (
                borrowedBooks.map((docket, index) => (
                  <tr key={docket._id}>
                    <td className="py-2 px-3 border text-sm">{index + 1}</td>
                    <td className="py-2 px-3 border text-sm">
                      {docket.book ? docket.book.bookName : 'Không có thông tin'}
                    </td>
                    <td className="py-2 px-3 border text-sm">
                      {new Date(docket.ngayMuon).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 border text-sm">
                      {new Date(docket.ngayHenTra).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 border text-sm">
                      {docket.ngayTra ? new Date(docket.ngayTra).toLocaleDateString() : 'Chưa trả'}
                    </td>
                    <td className="py-2 px-3 border text-sm"></td>
                    <td className="py-2 px-3 border text-sm">{docket.soLuongMuon}</td>
                    <th className={`py-2 px-3 border text-sm ${
                            docket.status === 'active' ? 'text-green-600' :
                            docket.status === 'overdue' ? 'text-red-600' :
                            docket.status === 'returned' ? 'text-gray-600': ''
                    }`}>{docket.status}</th>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-8 text-gray-400 border"
                  >
                    Chưa có sách được mượn
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBooks;