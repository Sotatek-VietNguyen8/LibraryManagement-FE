import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { useDocketStore } from '../../store/useDocketStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const QLMuonTra = () => {
  const { getDocket, dockets, checkAndUpdateStatus, updateNgayTra , searchDocket, deleteDocket} = useDocketStore()
  const [searchText, setSearchText]= useState('')
  const [showInput, setShowInput] = useState(false)
  const [searchResults , setSearchResults]= useState(null)
  const [clickRow, setClickRow] = useState(null)
  useEffect(() => {
    getDocket();
    checkAndUpdateStatus()
  }, [getDocket, checkAndUpdateStatus])

  const navigate= useNavigate()

  const handleToggleSearch = () => {
    if (!showInput) {
      setShowInput(true)
      setSearchText('')
      setSearchResults(null)
    }else{
      handleSearchDocket()
    }
  };
  const handleSearchDocket = async()=>{
    if(!searchText){
      toast.error("Vui long nhap thong tin")
      setSearchResults(null)
      return
    }
    try {
      const result = await searchDocket(searchText)
      setSearchResults(result)
      console.log(result)
    } catch (error) {
      console.error('Lỗi tìm kiếm', error);
      toast.error('Có lỗi xảy ra khi tìm kiếm')
      setSearchResults(null)
    }
  }
  const handleReturnBook = async(docket)=>{
    try {
      const today = new Date()
      await updateNgayTra(docket._id, {status: 'returned', ngayTra: today})
      getDocket()
      if(searchResults){
        handleSearchDocket()
      }
    } catch (error) {
      console.error('Lỗi khi trả sách:', error)
    }
  }
  const handleDeleteDocket = async (docketId)=>{
    try {
      await deleteDocket({_id: docketId})
      getDocket()
      if (searchResults){
        handleSearchDocket()
      } 
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xoa")
    }
  }
  
  const handleBack =()=>{
    navigate(-1)
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className='container mx-auto px-4 pt-20 pb-10' style={{ paddingTop: '50px' }}>
        <div className='w-full mx-auto bg-white p-6 rounded-lg shadow-sm'>
          <h1 className='text-2xl font-extralight text-center text-gray-950 mb-3'>Quản lí Phiếu mượn/trả Sách</h1>
          <h1 className='text-sm text-center text-gray-950 mb-10'>HỌC VIỆN KỸ THUẬT MẬT MÃ</h1>
          
          <div className='flex items-center flex-1  justify-end mb-4 '>
            {showInput && (
              <input
                type='text'
                placeholder='MaSV - MaThe - MaSach'
                className='input input-bordered h-8 pr-7'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            )}
            <button className='btn btn-outline btn-sm mr-4' onClick={handleToggleSearch}>
              Search
              <Search className="text-gray-900" size={18} />
            </button>
          </div>

          <div className='w-full mx-auto flex justify-center'>
            <div className=' overflow-y-auto h-[400px]'>
              <table className='min-w-full table-auto border-collapse border border-gray-800'>
                <thead className='bg-blue-100 sticky top-0'>
                  <tr>
                    <th className=' py-2 px-3 border text-sm'>STT</th>
                    <th className=' py-2 px-3 border text-sm'>Ma Phieu </th>
                    <th className=' py-2 px-3 border text-sm'>Ma The</th>
                    <th className=' py-2 px-3 border text-sm'>Ma Sinh Vien</th>
                    <th className=' py-2 px-3 border text-sm'>Ma Sach</th>
                    <th className=' py-2 px-3 border text-sm'>Ngay muon</th>
                    <th className=' py-2 px-3 border text-sm'>Ngay hen tra</th>
                    <th className=' py-2 px-3 border text-sm'>Ngay tra</th>
                    <th className=' py-2 px-3 border text-sm'>Trang thai</th>
                    <th className=' py-2 px-3 border text-sm'>Tra sach</th>
                    <th className=' py-2 px-3 border text-sm'></th>
                  </tr>
                </thead>

                <tbody>
                  {((searchResults ? searchResults : dockets) || []).map((docket, index) => (
                      <tr 
                        key={docket._id} 
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                        onMouseEnter={()=>setClickRow(docket._id)}
                        onMouseLeave={()=>setClickRow(null)}
                      >
                        <td className=' py-2 px-3 border text-sm'>{index + 1}</td>
                        <td className=' py-2 px-3 border text-sm'>{docket.IdDocket}</td>
                        <td className=' py-2 px-3 border text-sm'>{docket.IdCard}</td>
                        <td className=' py-2 px-3 border text-sm'>{docket.Identification }</td> 
                        <td className=' py-2 px-3 border text-sm'>{docket.IdBook }</td>
                        <td className=' py-2 px-3 border text-sm'>{new Date(docket.ngayMuon).toLocaleDateString()}</td>
                        <td className=' py-2 px-3 border text-sm'>{new Date(docket.ngayHenTra).toLocaleDateString()}</td>
                        <td className=' py-2 px-3 border text-sm'>{ (docket.ngayTra) ? new Date(docket.ngayTra).toLocaleDateString() : 'Chưa trả'}</td>
                        <th className={`py-2 px-3 border text-sm ${
                            docket.status === 'active' ? 'text-green-600' :
                            docket.status === 'overdue' ? 'text-red-600' :
                            docket.status === 'returned' ? 'text-gray-600': ''
                        }`}>{docket.status}</th>

                        <td className={'py-2 px-3 border text-sm'}>
                            {docket.status !== 'returned' && (
                                <button className='btn' onClick={()=> handleReturnBook(docket)}>
                                    Trả sách
                                </button>
                            )}
                        </td>

                        <td className='py-2 px-3 border text-sm'>
                          {clickRow === docket._id &&(
                            <button onClick={()=>handleDeleteDocket(docket._id)} className='items-center'>
                              <Trash2 className='text-red-700 hover:text-red-900' size={18}/>
                            </button>
                          )}
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex justify-start'>
                <button
                    type="submit"
                    className="btn-primary w-[550px] mt-4 "
                    onClick={handleBack}
                >
                    <ArrowLeft className='mr-2 h-5 w-[550px]' />
                    Back
                </button>
            </div>

            <div className='flex justify-end mt-4 w-[450px]'>
              <button type='button' className='btn btn-active border-black min-w-[250px] mr-2' onClick={()=>navigate("/admin/managerCard/creatDocket")}>
                  Lập phiếu mượn
              </button>
            </div>
          </div>
  
        </div>
      </div>
    </div>
  );
}

export default QLMuonTra;