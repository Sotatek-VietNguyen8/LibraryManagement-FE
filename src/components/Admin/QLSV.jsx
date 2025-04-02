import { Search } from 'lucide-react'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const QLSV = () => {

  const { findUser, getUser, updateUser, deleteUser } = useAuthStore()
  const [searchText, setSearchText] = useState('')
  const [userData, setUserData] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditUser, setIsEditUser] = useState(false)

  const navigate = useNavigate()

  const handleFindUser = useCallback(async () => {
    if (!searchText) {
      toast.error('Vui lòng nhập thông tin')
      return
    }
    try {
      const users = await findUser(searchText)
      console.log("Users từ findUser:", users)

      if (users && users.length > 0) {
        setSelectedUser(users[0])
      } else {
        setSelectedUser(null)
        toast.error('Không tìm thấy sinh viên')
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm', error)
      toast.error('Có lỗi xảy ra khi tìm kiếm')
    }
  }, [searchText, findUser])

  const handleChange = (e) => {
    setSearchText(e.target.value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUser()
        if (users) {
          setUserData(users)
        } else {
          setUserData([])
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to fetch user data.")
        setUserData([])
      }
    }
    fetchData()
  }, [getUser])

  const handleRowClick = (user) => {
    setSelectedUser(user)
  }

  const handleEditClick = () => {
    setIsEditUser(true)
  }

  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) {
        toast.error("Vui long chon sinh vien de sua ")
        return
      }
      await updateUser(selectedUser)
      toast.success("User updated successfully!")
      setIsEditUser(false)
      const updateData = await getUser()
      setUserData(updateData)
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật.")
    }
  }
  const handleDeleteUser = async () => {
    try {
      if (!selectedUser) {
        toast.error("Vui lòng chọn sinh viên để xóa ")
        return
      }
      await deleteUser(selectedUser)
      toast.success("User deleted successfully!")
      setSelectedUser(null)
      const updateData = await getUser()
      setUserData(updateData)
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target 
    setSelectedUser(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleBack = ()=>{
    navigate(-1)
  }
  

  return (
    <div className="bg-[#F0F0F0] rounded shadow-sm border border-gray-300">
      <div className="p-5 border-b border-gray-300 bg-gradient-to-r from-gray-200 to-gray-300">
        <h2 className="text-base font-medium text-gray-700">
          Thông Tin Sinh Viên
        </h2>
      </div>

      <div className="flex items-center p-3 bg-gray-100 border-b gap-2">
        <h2 className="font-semibold text-sm whitespace-nowrap">Tìm kiếm</h2>
        <div className="flex items-center flex-grow">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 shadow-sm text-sm"
            placeholder="Nhập thông tin sinh viên ..."
            value={searchText}
            onChange={handleChange}
          />
          <button
            onClick={handleFindUser}
            className="ml-3 flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md focus:outline-none focus:shadow-outline transition-colors text-sm whitespace-nowrap"
          >
            <Search className="h-4 w-4" />
            Tìm Kiếm
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div className="space-y-2">
          {selectedUser ? (
            <div>
              <div className='flex'>
                <div className='w-1/2'>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-600">Mã Sinh Viên</label>
                    {isEditUser ? (
                      <input
                        type="text"
                        name="Identification"
                        value={selectedUser.Identification || ''}
                        onChange={handleInputChange}
                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{selectedUser.Identification || 'N/A'}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-600">Họ và Tên</label>
                    {isEditUser ? (
                      <input
                        type="text"
                        name="userName"
                        value={selectedUser.userName || ''}
                        onChange={handleInputChange}
                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{selectedUser.userName || 'N/A'}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-600">Chức vụ</label>
                    {isEditUser ? (
                      <input
                        type="text"
                        name="position"
                        value={selectedUser.position || ''}
                        onChange={handleInputChange}
                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{selectedUser.position || 'N/A'}</p>
                    )}
                  </div>
                </div>

                <div className='w-1/2'>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-600">Lớp </label>
                    {isEditUser ? (
                      <input
                        type="text"
                        name="lop"
                        value={selectedUser.lop || ''}
                        onChange={handleInputChange}
                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{selectedUser.lop || 'N/A'}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-600">Số điện thoại </label>
                    {isEditUser ? (
                      <input
                        type="text"
                        name="SDT"
                        value={selectedUser.SDT || ''}
                        onChange={handleInputChange}
                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{selectedUser.SDT || 'N/A'}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-600">Email</label>
                    {isEditUser ? (
                      <input
                        type="email"
                        name="email"
                        value={selectedUser.email || ''}
                        onChange={handleInputChange}
                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{selectedUser.email || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className='flex'>
              <div className='w-1/2'>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Mã Sinh Viên</label>
                  <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">N/A</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Họ và Tên</label>
                  <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">N/A</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Chức vụ</label>
                  <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">N/A</p>
                </div>
              </div>

              <div className='w-1/2'>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Lớp </label>
                  <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">N/A</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Số điện thoại </label>
                  <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">N/A</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-600">Email</label>
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
                <th className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>STT</th>
                <th className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>Ma sinh vien</th>
                <th className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>Ho va ten</th>
                <th className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>Lop</th>
                <th className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>SDT</th>
                <th className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>Email</th>
              </tr>
            </thead>

            <tbody>
              {userData && userData.map((user, index)=>(
                <tr key={index} className={`${index % 3 === 0 ? 'bg-white' : 'bg-gray-300'}`}
                  onClick={()=>handleRowClick(user)}
                >
                  <td className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>{index + 1}</td>
                  <td className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>{user.Identification}</td>
                  <td className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>{user.userName}</td>
                  <td className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>{user.lop}</td>
                  <td className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>{user.SDT}</td>
                  <td className=' py-2 px-3 border text-sm text-gray-600 uppercase tracking-wider'>{user.email}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>
      

      <div className="p-4 bg-gray-800 flex flex-wrap gap-2 justify-center">
        <button onClick = {() => navigate("/admin/managerStudent/signUp")} className="border border-gray-950 bg-gray-950 min-w-[100px]">
          Thêm 
        </button>
       
       {selectedUser && (
          <div className="flex items-center justify-center">
          {!isEditUser ? (
            <button onClick={handleEditClick} className="border border-gray-950 bg-gray-950 min-w-[100px]">
              Sửa Thông Tin
            </button>
            
          ) : (
            <div className="flex space-x-2">
              <button onClick={handleUpdateUser} className="border border-gray-950 bg-gray-950 min-w-[100px]">
                Lưu Thay Đổi
              </button>
              <button onClick={() => setIsEditUser(false)} className="border border-gray-950 bg-gray-950 min-w-[100px]">
                Hủy
              </button>
            </div>
          )}
         </div>
         
        )}
      
        <button onClick={handleDeleteUser} className="border border-gray-950 bg-gray-950 min-w-[100px]">
          Xóa
        </button>
        <button  onClick={handleBack}className="border border-gray-950 bg-gray-950 min-w-[100px]">
          Back
        </button>
      </div>

    </div>
  )
}

export default QLSV