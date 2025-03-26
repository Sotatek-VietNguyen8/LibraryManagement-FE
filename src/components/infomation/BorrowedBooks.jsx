import React from 'react'
const BorrowedBooks = () => {
  return (
    <div className="w-full md:w-2/3 p-4">
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
                <th className="py-2 px-3 border text-sm">quá Hạn(h)</th>
                <th className="py-2 px-3 border text-sm">Số Lượng</th>
                <th className="py-2 px-3 border text-sm">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-8 text-gray-400 border"
                >
                  Chưa có sách được mượn
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed">
            Trả Sách
          </button>
        </div>
      </div>
    </div>
  )
}
export default BorrowedBooks
