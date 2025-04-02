import React, { useState } from 'react'
import { Download, SearchIcon } from 'lucide-react'
import { useBookStore } from '../../store/useBookStore'

const BookSearch = () => {
  const { searchBook, getPDF } = useBookStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async () => {
    try {
      const results = await searchBook(searchQuery)
      if (results && Array.isArray(results) && results.length > 0) {
        setSearchResults(results)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error("Error during search:", error)
      setSearchResults([])
    }
  }

  const handleReviewer = async(pdfUrl)=>{
    if(pdfUrl){
      const filename = pdfUrl.substring(pdfUrl.lastIndexOf('/') + 1)
      getPDF(filename)
    }else{
      alert('No PDF available for this book')
    }
  }

  return (
    <div className="p-4 border-t md:w-2/3 border-gray-200">
      <div className="flex flex-col md:flex-row items-center mb-4 gap-4">
        <div className="text-lg font-medium">Tìm Kiếm:</div>
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập từ khóa tìm kiếm..."
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button onClick={handleSearch} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
          Tìm Kiếm
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 border text-sm">STT</th>
              <th className="py-2 px-3 border text-sm">Tên Sách</th>
              <th className="py-2 px-3 border text-sm">Tác giả</th>
              <th className="py-2 px-3 border text-sm">Nhà Xuất Bản</th>
              <th className="py-2 px-3 border text-sm">Review</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((book, index) => (
                <tr key={book._id}>
                  <td className="py-2 px-3 border text-sm">{index + 1}</td>
                  <td className="py-2 px-3 border text-sm">{book.bookName}</td>
                  <td className="py-2 px-3 border text-sm">{book.author}</td>
                  <td className="py-2 px-3 border text-sm">{book.NXB}</td>
                  <td className="py-2 px-3 border text-sm">
                    <Download onClick={()=>handleReviewer(book.pdfUrl)} className='flex justify-items-center cursor-pointer'/>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400 border">
                  Không tìm thấy sách nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BookSearch