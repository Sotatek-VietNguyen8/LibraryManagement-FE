import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useBookStore } from '../../store/useBookStore'
import { useNavigate } from 'react-router-dom'

const QLSach = () => {
  const { getBook, searchBook, updateBook, deleteBook, books } = useBookStore()
  const [searchText, setSearchText] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [isEditBook, setIsEditBook] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getBook()
      } catch (error) {
        console.error("Error fetching initial book data:", error)
        toast.error("Lỗi tải danh sách sách.")
      }
    }
    fetchData()
  }, [getBook])

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }

  const handleFindBook = useCallback(async () => {
    if (!searchText.trim()) {
      toast.error('Vui lòng nhập thông tin tìm kiếm')
      return
    }
    try {
      const foundBooks = await searchBook(searchText)
      if (foundBooks && foundBooks.length > 0) {
        setSelectedBook(foundBooks[0])
        setIsEditBook(false)
        toast.success(`Tìm thấy sách: ${foundBooks[0].bookName || foundBooks[0].IdBook}`)
      } else {
        setSelectedBook(null)
        toast.error('Không tìm thấy sách nào khớp')
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm sách:', error)
      toast.error('Có lỗi xảy ra khi tìm kiếm sách')
      setSelectedBook(null)
    }
  }, [searchText, searchBook])

  const handleRowClick = (book) => {
    setSelectedBook(book)
    setIsEditBook(false)
  }

  const sortedBooks = useMemo(() => {
    let sortableItems = books ? [...books] : []
    if (sortConfig.key !== null && sortableItems.length > 0) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'IdBook') {
          const aValue = a.IdBook || ''
          const bValue = b.IdBook || ''
          let comparison = String(aValue).localeCompare(String(bValue), 'vi', { sensitivity: 'base' })
          return sortConfig.direction === 'descending' ? comparison * -1 : comparison
        }
        return 0
      })
    }
    return sortableItems
  }, [books, sortConfig])

  const requestSort = (key) => {
    if (key !== 'IdBook') {
      return
    }
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== 'IdBook' || columnKey !== 'IdBook') {
      return null
    }
    return sortConfig.direction === 'ascending'
      ? <ChevronUp className='inline ml-1 h-4 w-4 text-blue-500' />
      : <ChevronDown className='inline ml-1 h-4 w-4 text-blue-500' />
  }

  const handleEditClick = () => {
    if (!selectedBook) {
        toast.error("Vui lòng chọn một sách để sửa.")
        return
    }
    setIsEditBook(true)
  }

  const handleCancelEdit = () => {
    setIsEditBook(false)
    const originalBook = books.find(b => (b._id && b._id === selectedBook._id) || (b.IdBook && b.IdBook === selectedBook.IdBook))
    if (originalBook) {
        setSelectedBook(originalBook)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSelectedBook(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleUpdateBook = async () => {
    if (!selectedBook) {
      toast.error("Không có sách nào được chọn để cập nhật.")
      return
    }
    try {
      await updateBook(selectedBook)
      toast.success("Cập nhật thông tin sách thành công!")
      setIsEditBook(false)
      await getBook()
    } catch (error) {
      console.error("Lỗi cập nhật sách:", error)
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật sách.")
    }
  }

  const handleDeleteBook = async () => {
    if (!selectedBook || (!selectedBook._id && !selectedBook.IdBook)) {
      toast.error("Vui lòng chọn một sách để xóa.")
      return
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sách "${selectedBook.bookName || selectedBook.IdBook}" không?`)) {
        return
    }
    try {
      const bookIdToDelete = selectedBook._id || selectedBook.IdBook
      if (!bookIdToDelete) {
         toast.error("Không thể xác định ID sách để xóa.")
         return
      }
      await deleteBook(bookIdToDelete)
      toast.success("Xóa sách thành công!")
      setSelectedBook(null)
      setIsEditBook(false)
      await getBook()
    } catch (error) {
      console.error("Lỗi xóa sách:", error)
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa sách.")
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleGoToAddPage = () => {
    navigate("/admin/managerBook/addBook")
  }

  return (
    <div className="bg-white rounded shadow-md border border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-700">
          Quản Lý Giáo Trình / Sách
        </h2>
      </div>

      <div className="flex items-center p-3 border-b border-gray-200 gap-3 bg-gray-50">
        <label htmlFor='searchInput' className="font-semibold text-sm text-gray-600 whitespace-nowrap">Tìm kiếm:</label>
        <div className="flex items-center flex-grow">
          <input
            id='searchInput'
            type="text"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm"
            placeholder="Nhập mã sách, tên sách, tác giả..."
            value={searchText}
            onChange={handleSearchTextChange}
            onKeyDown={(e) => e.key === 'Enter' && handleFindBook()}
          />
          <button
            onClick={handleFindBook}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors text-sm whitespace-nowrap shadow-sm"
          >
            <Search className="h-4 w-4" />
            Tìm
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 border-b border-gray-200">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Thông tin chi tiết sách</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3'>
          <div>
            <div className="flex flex-col space-y-1 mb-2">
              <label className="text-sm font-medium text-gray-600">Mã Sách</label>
              {isEditBook ? (
                <input
                  type="text"
                  name="IdBook"
                  value={selectedBook?.IdBook || ''}
                  onChange={handleInputChange}
                  className="px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  readOnly
                  title="Mã sách không thể chỉnh sửa"
                 />
              ) : (
                <p className="px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-sm min-h-[38px]">
                  {selectedBook?.IdBook || <span className="text-gray-400">N/A</span>}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1 mb-2">
              <label className="text-sm font-medium text-gray-600">Tên sách</label>
              {isEditBook ? (
                <input
                  type="text"
                  name="bookName"
                  value={selectedBook?.bookName || ''}
                  onChange={handleInputChange}
                  className="px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-sm min-h-[38px]">
                  {selectedBook?.bookName || <span className="text-gray-400">N/A</span>}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1 mb-2">
              <label className="text-sm font-medium text-gray-600">Tác giả</label>
              {isEditBook ? (
                <input
                  type="text"
                  name="author"
                  value={selectedBook?.author || ''}
                  onChange={handleInputChange}
                  className="px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-sm min-h-[38px]">
                  {selectedBook?.author || <span className="text-gray-400">N/A</span>}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-col space-y-1 mb-2">
              <label className="text-sm font-medium text-gray-600">Nhà xuất bản</label>
              {isEditBook ? (
                <input
                  type="text"
                  name="NXB"
                  value={selectedBook?.NXB || ''}
                  onChange={handleInputChange}
                  className="px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-sm min-h-[38px]">
                  {selectedBook?.NXB || <span className="text-gray-400">N/A</span>}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1 mb-2">
              <label className="text-sm font-medium text-gray-600">Số lượng tổng</label>
              {isEditBook ? (
                <input
                  type="number"
                  name="soLuong"
                  min="0"
                  value={selectedBook?.soLuong ?? ''}
                  onChange={handleInputChange}
                  className="px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-sm min-h-[38px]">
                  {selectedBook?.soLuong !== undefined ? selectedBook.soLuong : <span className="text-gray-400">N/A</span>}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1 mb-2">
              <label className="text-sm font-medium text-gray-600">Số lượng còn lại</label>
              <p className="px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-sm min-h-[38px]">
                {selectedBook?.soLuongCon !== undefined ? selectedBook.soLuongCon : <span className="text-gray-400">N/A</span>}
              </p>
            </div>

            <div className="flex flex-col space-y-1 mb-2">
               <label className="text-sm font-medium text-gray-600">URL PDF</label>
              {isEditBook ? (
                <input
                  type="text"
                  name="pdfUrl"
                  value={selectedBook?.pdfUrl || ''}
                  onChange={handleInputChange}
                  className="px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-sm min-h-[38px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {selectedBook?.pdfUrl ? (
                        <a
                            href={selectedBook.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            title={selectedBook.pdfUrl}
                        >
                            {selectedBook.pdfUrl}
                        </a>
                    ) : (
                        <span className="text-gray-400">N/A</span>
                    )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto p-4">
        <div className='border border-gray-200 rounded-md shadow-sm overflow-hidden'>
            <table className='min-w-full table-auto border-collapse'>
                <thead className='bg-gray-100 sticky top-0 z-10'>
                  <tr>
                    <th className='px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>STT</th>
                    <th
                        className='px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200'
                        onClick={() => requestSort('IdBook')}
                    >
                        Mã sách {renderSortIcon('IdBook')}
                    </th>
                    <th className='px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Tên sách</th>
                    <th className='px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Tác giả</th>
                    <th className='px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>NXB</th>
                    <th className='px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>SL Tổng</th>
                    <th className='px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>SL Còn</th>
                    <th className='px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>PDF URL</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBooks && sortedBooks.length > 0 ? (
                    sortedBooks.map((book, index) => (
                      <tr
                        key={book._id || book.IdBook}
                        className={`hover:bg-blue-50 cursor-pointer ${
                          selectedBook?._id === book._id || selectedBook?.IdBook === book.IdBook
                            ? 'bg-blue-100'
                            : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                        }`}
                        onClick={() => handleRowClick(book)}
                      >
                        <td className='px-4 py-3 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap'>{index + 1}</td>
                        <td className='px-4 py-3 border-b border-gray-200 text-sm text-gray-900 font-medium whitespace-nowrap'>{book.IdBook}</td>
                        <td className='px-4 py-3 border-b border-gray-200 text-sm text-gray-700 whitespace-normal max-w-xs'>{book.bookName}</td>
                        <td className='px-4 py-3 border-b border-gray-200 text-sm text-gray-700 whitespace-normal max-w-xs'>{book.author}</td>
                        <td className='px-4 py-3 border-b border-gray-200 text-sm text-gray-700 whitespace-normal max-w-xs'>{book.NXB}</td>
                        <td className='px-4 py-3 border-b border-gray-200 text-sm text-gray-700 text-center whitespace-nowrap'>{book.soLuong}</td>
                        <td className='px-4 py-3 border-b border-gray-200 text-sm text-gray-700 text-center whitespace-nowrap'>{book.soLuongCon}</td>
                        <td className='px-4 py-3 border-b border-gray-200 text-sm text-blue-600 hover:underline whitespace-nowrap overflow-hidden text-ellipsis max-w-xs' title={book.pdfUrl}>
                          {book.pdfUrl ? (
                            <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                PDF
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-10 px-4 text-sm text-gray-500">
                           {books === null ? 'Đang tải danh sách sách...' : 'Không tìm thấy sách nào.'}
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>
        </div>
      </div>

      <div className="p-3 bg-gray-100 border-t border-gray-200 flex flex-wrap gap-3 justify-center md:justify-end">
        <button
          onClick={handleGoToAddPage}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-150 ease-in-out text-sm min-w-[100px]"
        >
          Thêm Mới
        </button>

        {selectedBook && (
            isEditBook ? (
                <>
                    <button
                        onClick={handleUpdateBook}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-150 ease-in-out text-sm min-w-[100px]"
                    >
                        Lưu
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-150 ease-in-out text-sm min-w-[100px]"
                    >
                        Hủy
                    </button>
                </>
            ) : (
                <button
                    onClick={handleEditClick}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-150 ease-in-out text-sm min-w-[100px]"
                >
                    Sửa
                </button>
            )
        )}

        <button
          onClick={handleDeleteBook}
          disabled={!selectedBook || isEditBook}
          className={`font-bold py-2 px-4 rounded shadow-sm transition-colors duration-150 ease-in-out text-sm min-w-[100px] ${
            !selectedBook || isEditBook
              ? 'bg-red-300 text-gray-100 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          Xóa
        </button>

        <button
          onClick={handleBack}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-150 ease-in-out text-sm min-w-[100px]"
        >
          Quay Lại
        </button>
      </div>
    </div>
  )
}

export default QLSach