
import { Search } from 'lucide-react';
import React, { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useBookStore } from '../../store/useBookStore';
import { useNavigate } from 'react-router-dom';

const QLSach = () => {
  const { getBook, searchBook, updateBook, deleteBook } = useBookStore()
  const [searchText, setSearchText] = useState('');
  const [bookData, setBookData] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditBook, setIsEditBook] = useState(false);
  
  const navigate = useNavigate()

  const handleFindBook = useCallback(async () => {
    if (!searchText) {
      toast.error('Vui lòng nhập thông tin');
      return;
    }
    try {
      const book = await searchBook(searchText);
      console.log("Book :", book);

      if (book && book.length > 0) {
        setSelectedBook(book[0]); 
      } else {
        setSelectedBook(null);
        toast.error('Không tìm thấy sách');
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm', error);
      toast.error('Có lỗi xảy ra khi tìm kiếm');
    }
  }, [searchText, searchBook]);

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect( ()=>{
    const fetchData = async()=>{
      try {
        const books = await getBook()
        if(books){
          setBookData(books)
        }else{
          setBookData([])
        }
      } catch (error) {
        console.error("Error fetching book data:", error)
        toast.error("Failed to fetch book data.")
        setBookData([])
      }
    }
    fetchData()
  }, [getBook])

  const handleRowClick = (book) =>{
    setSelectedBook(book)
  }
  const handleEditClick = ()=>{
    setIsEditBook(true)
  }
  const handleUpdateBook = async ()=>{
    try {
      if(!selectedBook){
        toast.error("Vui lòng chọn sách để chỉnh sửa")
        return
      }
      await updateBook(selectedBook)
      toast.success("Book updated successfully")
      setIsEditBook(false)
      const updateData= await getBook()
      setBookData(updateData)
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật.")
    }
  }

  const handleDeleteBook= async() =>{
    try {
      if(!selectedBook){
        toast.error("Vui lòng chọn sinh viên để xóa")
        return
      }
      await deleteBook(selectedBook)
      toast.success("Book deleted successfully")
      setSelectedBook(null)
      const updateData= await getBook()
      setBookData(updateData) 
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật.")
    }
  }

  const handleInputChange= (e)=>{
    const {name, value} = e.target
    setSelectedBook(prevState =>({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <div className="bg-[#F0F0F0] rounded shadow-sm border border-gray-300">
      <div className="p-5 border-b border-gray-300 bg-gradient-to-r from-gray-200 to-gray-300">
        <h2 className="text-base font-medium text-gray-700">
          Thông Tin Giáo Trình
        </h2>
      </div>

      <div className="flex items-center p-3 bg-gray-100 border-b gap-2">
        <h2 className="font-semibold text-sm whitespace-nowrap">Tìm kiếm</h2>
        <div className="flex items-center flex-grow">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 shadow-sm text-sm"
            placeholder="Nhập thông tin sách ..."
            value={searchText}
            onChange={handleChange}
          />
          <button
            onClick={handleFindBook}
            className="ml-3 flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md focus:outline-none focus:shadow-outline transition-colors text-sm whitespace-nowrap"
          >
            <Search className="h-4 w-4" />
            Tìm Kiếm
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div className="space-y-2">
          {selectedBook ? (
            <div className='flex'>
              <div className='w-1/2'>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Mã Sách </label>
                  {isEditBook ? (
                    <input
                    type="text"
                    name="IdBook"
                    value={selectedBook.IdBook || ''}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                  />
                  ): (
                    <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{selectedBook.IdBook || 'N/A'}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Tên sách </label>
                  {isEditBook ? (
                    <input
                    type="text"
                    name="bookName"
                    value={selectedBook.bookName || ''}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                  />
                  ): (
                    <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{selectedBook.bookName || 'N/A'}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Tác giả </label>
                  {isEditBook ? (
                    <input
                    type="text"
                    name="author"
                    value={selectedBook.author || ''}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                  />
                  ): (
                    <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{selectedBook.author || 'N/A'}</p>
                  )}
                </div>
              </div>

              <div className='w-1/2'>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Nhà xuất bản </label>
                  {isEditBook ? (
                    <input
                    type="text"
                    name="NXB"
                    value={selectedBook.NXB || ''}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                  />
                  ): (
                    <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{selectedBook.NXB || 'N/A'}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Số lượng </label>
                  {isEditBook ? (
                    <input
                    type="text"
                    name="soLuong"
                    value={selectedBook.soLuong || ''}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                  />
                  ): (
                    <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{selectedBook.soLuong || 'N/A'}</p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className='flex'>
              <div className='w-1/2'>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Mã Sách</label>
                  <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">N/A</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Tên sách</label>
                  <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">N/A</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Tác giả</label>
                  <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">N/A</p>
                </div>
              </div>

              <div className='w-1/2'>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Nhà xuất bản</label>
                  <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">N/A</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Số lượng</label>
                  <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">N/A</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <div className='w-full overflow-x-auto'>
        <div className=' overflow-y-auto h-[250px]'>

          <table className='min-w-full table-auto border-collapse border border-gray-300'>
            <thead className='bg-gray-100 sticky top-0'>
              <tr>
                <th className=' py-2 px-3 border text-sm'>STT</th>
                <th className=' py-2 px-3 border text-sm'>Ma sach</th>
                <th className=' py-2 px-3 border text-sm'>Ten sach</th>
                <th className=' py-2 px-3 border text-sm'>Tac gia</th>
                <th className=' py-2 px-3 border text-sm'>Nha xuat ban</th>
                <th className=' py-2 px-3 border text-sm'>So luong</th>
              </tr>
            </thead>

            <tbody>
              {bookData && bookData.map((book, index)=>(
                <tr key={index} className={`${index % 3 === 0 ? 'bg-white' : 'bg-gray-300'}`}
                  onClick={()=>handleRowClick(book)}
                >
                  <td className=' py-2 px-3 border text-sm'>{index + 1}</td>
                  <td className=' py-2 px-3 border text-sm'>{book.IdBook}</td>
                  <td className=' py-2 px-3 border text-sm'>{book.bookName}</td>
                  <td className=' py-2 px-3 border text-sm'>{book.author}</td>
                  <td className=' py-2 px-3 border text-sm'>{book.NXB}</td>
                  <td className=' py-2 px-3 border text-sm'>{book.soLuong}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>
      

      <div className="p-4 bg-gray-800 flex flex-wrap gap-2 justify-center">
        <button onClick={()=> navigate("/admin/managerBook/addBook")} className="border border-gray-950 bg-gray-950 min-w-[100px]">
          Thêm
        </button>

        {selectedBook && (
          <div className="flex items-center justify-center">
          {!isEditBook ? (
            <button onClick={handleEditClick} className="border border-gray-950 bg-gray-950 min-w-[100px]">
              Sửa Thông Tin
            </button>
            
          ) : (
            <div className="flex space-x-2">
              <button onClick={handleUpdateBook} className="border border-gray-950 bg-gray-950 min-w-[100px]">
                Lưu Thay Đổi
              </button>
              <button onClick={() => setIsEditBook(false)} className="border border-gray-950 bg-gray-950 min-w-[100px]">
                Hủy
              </button>
            </div>
          )}
         </div>
         
        )}
        <button  onClick = {handleDeleteBook} className="border border-gray-950 bg-gray-950 min-w-[100px]">
          Xóa
        </button>
        <button  className="border border-gray-950 bg-gray-950 min-w-[100px]">
          Làm Mới
        </button>
      </div>

    </div>
  );
};

export default QLSach;
