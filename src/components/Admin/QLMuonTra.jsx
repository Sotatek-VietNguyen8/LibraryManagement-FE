import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { useDocketStore } from '../../store/useDocketStore';
import { useNavigate } from 'react-router-dom';

const QLMuonTra = () => {
  const { getDocket, dockets, checkAndUpdateStatus, updateNgayTra } = useDocketStore()

  useEffect(() => {
    getDocket();
    checkAndUpdateStatus()
  }, [getDocket, checkAndUpdateStatus])

  const navigate= useNavigate()

  const handleReturnBook = async(docket)=>{
    try {
        const today = new Date()
        await updateNgayTra(docket._id, {status: 'returned', ngayTra: today})
        getDocket()
    } catch (error) {
        console.error('Lỗi khi trả sách:', error)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className='container mx-auto px-4 pt-20 pb-10' style={{ paddingTop: '50px' }}>
        <div className='w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm'>
          <h1 className='text-2xl font-extralight text-center text-gray-950 mb-3'>Quản lí Phiếu mượn/trả Sách</h1>
          <h1 className='text-sm text-center text-gray-950 mb-9'>HỌC VIỆN KỸ THUẬT MẬT MÃ</h1>

          <div className='max-w-3xl mx-auto flex justify-center'>
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
                  </tr>
                </thead>

                <tbody>
                  {dockets && dockets.map((docket, index) => {
                    return (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                        <td className=' py-2 px-3 border text-sm'>{index + 1}</td>
                        <td className=' py-2 px-3 border text-sm'>{docket.IdDocket}</td>
                        <td className=' py-2 px-3 border text-sm'>{docket.IdCard}</td>
                        <td className=' py-2 px-3 border text-sm'>{docket.Identification }</td> 
                        <td className=' py-2 px-3 border text-sm'>{docket.IdBook }</td>
                        <td className=' py-2 px-3 border text-sm'>{new Date(docket.ngayMuon).toLocaleDateString()}</td>
                        <td className=' py-2 px-3 border text-sm'>{new Date(docket.ngayHenTra).toLocaleDateString()}</td>
                        <td className=' py-2 px-3 border text-sm'>{docket.ngayTra }</td>
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>

            </div>
          </div>

          <div className='flex justify-end mt-4'>
            <button type='button' className='btn btn-active border-black min-w-[250px] mr-2' onClick={()=>navigate("/admin/managerCard/creatDocket")}>
                Lập phiếu mượn
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default QLMuonTra;