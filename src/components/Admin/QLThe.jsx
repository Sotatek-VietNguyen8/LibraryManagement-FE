import React, { useState, useEffect, useMemo } from 'react'
import Navbar from '../Navbar'
import { ArrowLeft, Search, UserPlus, ChevronUp, ChevronDown } from 'lucide-react' 
import { useCardStore } from '../../store/useCardStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const getNestedValue = (obj, path) => {
    if (!obj || !path) return undefined
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

const QLThe = () => {
    const { addCard, getCard, searchCard, cards, setCards, checkAndUpdateStatusCard } = useCardStore()
    const [searchText, setSearchText] = useState('')
    const [isAddingCard, setIsAddCard] = useState(false)
    const [formData, setFormData] = useState({
        IdCard: '',
        Identification: '',
        ngayCap: '',
        ngayHetHan: '',
        status: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })

    useEffect(() => {
        getCard()
        checkAndUpdateStatusCard()
    }, []) 

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            IdCard: prevFormData.Identification,
        }))
    }, [formData.Identification])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.ngayCap && formData.ngayHetHan && new Date(formData.ngayCap) >= new Date(formData.ngayHetHan)) {
            toast.error('Ngày hết hạn phải sau ngày cấp.')
            return
        }
        setIsSubmitting(true)
        try {
            const cardData = await addCard(formData)
            if (cardData) {
                toast.success('Thêm thẻ thành công!')
                setFormData({ IdCard: '', Identification: '', ngayCap: '', ngayHetHan: '', status: '' })
                await getCard()
                setIsAddCard(false)
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi thêm thẻ.'
            toast.error(errorMessage)
            console.log('Error on submit AddCardForm: ', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancelAddCard = () => {
        setIsAddCard(false)
        setFormData({ IdCard: '', Identification: '', ngayCap: '', ngayHetHan: '', status: '' })
    }

    const handleNewCardClick = () => {
        setIsAddCard(true)
    }

    const handleFindCard = async () => {
        if (!searchText.trim()) {
            toast.success('Hiển thị tất cả thẻ.')
            await getCard()
            setSortConfig({ key: null, direction: 'ascending' }) 
            return
        }
        try {
            const result = await searchCard(searchText)
            if (result && result.length > 0) {
                setCards(result)
                toast.success(`Tìm thấy ${result.length} kết quả.`)
            } else {
                setCards([])
                toast.error('Không tìm thấy thẻ nào khớp.')
            }
            setSortConfig({ key: null, direction: 'ascending' }) 
        } catch (error) {
            console.error('Lỗi tìm kiếm', error)
            toast.error('Có lỗi xảy ra khi tìm kiếm')
        }
    }

    const navigate = useNavigate()
    const handleBack = () => {
        navigate(-1)
    }

    const sortedCards = useMemo(() => {
        let sortableItems = cards ? [...cards] : []
        if (sortConfig.key !== null && sortableItems.length > 0) {
            sortableItems.sort((a, b) => {
                const aValue = getNestedValue(a, sortConfig.key)
                const bValue = getNestedValue(b, sortConfig.key)

                if (aValue == null && bValue == null) return 0
                if (aValue == null) return 1
                if (bValue == null) return -1

                let comparison = 0
                const stringA = String(aValue) 
                const stringB = String(bValue)
                comparison = stringA.localeCompare(stringB, 'vi', { sensitivity: 'base' })

                return sortConfig.direction === 'descending' ? comparison * -1 : comparison
            })
        }
        return sortableItems
    }, [cards, sortConfig])

    const requestSort = (key) => {
        const allowedSortKeys = ['IdCard', 'Identification.Identification', 'status']
        if (!allowedSortKeys.includes(key)) {
            return 
        }

        let direction = 'ascending'
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    const renderSortIcon = (columnKey) => {
         const allowedSortKeys = ['IdCard', 'Identification.Identification', 'status']
         if (!allowedSortKeys.includes(columnKey) || sortConfig.key !== columnKey) {
             return null
         }
    
        if (sortConfig.direction === 'ascending') {
            return <ChevronUp className="inline ml-1 h-4 w-4 text-blue-600" />
        } else {
            return <ChevronDown className="inline ml-1 h-4 w-4 text-blue-600" />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className='container mx-auto px-4 pt-20 pb-10' style={{ paddingTop: '60px' }}>
                <div className='w-full max-w-5xl mx-auto mb-5'>
                    <div className="flex justify-between items-center mb-4">
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm flex items-center text-gray-600 hover:text-gray-900"
                            onClick={handleBack}
                        >
                            <ArrowLeft className='mr-1 h-4 w-4' />
                            Quay Lại
                        </button>
                        <h1 className='text-2xl font-semibold text-gray-800'>Quản Lý Thẻ Thư Viện</h1>
                    </div>
                    {!isAddingCard && (
                        <div className="flex justify-end mb-6">
                            <button className='btn btn-primary' onClick={handleNewCardClick}>
                                <UserPlus size={18} className="mr-2" />
                                Thêm Thẻ Mới
                            </button>
                        </div>
                    )}
                </div>

                {isAddingCard && (
                    <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700 mb-5">Thông Tin Thẻ Mới</h2>
                        <form onSubmit={handleSubmit}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text text-sm font-medium text-gray-700">Mã Sinh Viên <span className="text-red-500">*</span></span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered input-sm w-full"
                                        placeholder="Nhập mã định danh"
                                        value={formData.Identification}
                                        onChange={(e) => setFormData({ ...formData, Identification: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text text-sm font-medium text-gray-700">Mã Thẻ</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered input-sm w-full bg-gray-100"
                                        placeholder=" "
                                        value={formData.IdCard}
                                        readOnly
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text text-sm font-medium text-gray-700">Ngày Cấp <span className="text-red-500">*</span></span>
                                    </label>
                                    <input
                                        type="date"
                                        className="input input-bordered input-sm w-full"
                                        value={formData.ngayCap}
                                        max={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setFormData({ ...formData, ngayCap: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text text-sm font-medium text-gray-700">Ngày Hết Hạn <span className="text-red-500">*</span></span>
                                    </label>
                                    <input
                                        type="date"
                                        className="input input-bordered input-sm w-full"
                                        min={formData.ngayCap || undefined}
                                        value={formData.ngayHetHan}
                                        onChange={(e) => setFormData({ ...formData, ngayHetHan: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-control md:col-span-2">
                                    <label className="label pb-1">
                                        <span className="label-text text-sm font-medium text-gray-700">Trạng Thái Ban Đầu <span className="text-red-500">*</span></span>
                                    </label>
                                    <select
                                        className="select select-bordered select-sm w-full"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Chọn trạng thái</option>
                                        <option value="Active">Active</option>
                                    </select>
                                </div>
                            </div>
                            <div className='flex justify-end mt-6 space-x-3'>
                                <button type='button' className='btn btn-ghost btn-sm' onClick={handleCancelAddCard} disabled={isSubmitting}>
                                    Hủy Bỏ
                                </button>
                                <button type='submit' className='btn btn-primary btn-sm' disabled={isSubmitting}>
                                    {isSubmitting ? <span className="loading loading-spinner loading-xs"></span> : 'Lưu Thẻ'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className='w-full max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200'>
                    <div className="mb-4">
                        <label htmlFor="search-card" className="label pb-1">
                            <span className="label-text text-sm font-medium text-gray-700">Tìm kiếm thẻ</span>
                        </label>
                        <div className="relative flex items-center">
                            <input
                                id="search-card"
                                type="text"
                                placeholder="Nhập Mã thẻ, Mã SV"
                                className="input input-bordered input-sm w-full pr-12"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFindCard()}
                            />
                            <button
                                className='btn btn-primary btn-sm absolute right-1 top-1/2 transform -translate-y-1/2'
                                onClick={handleFindCard}
                                title="Tìm kiếm"
                            >
                                <Search size={16} />
                            </button>
                        </div>
                    </div>

                    <div className='overflow-x-auto overflow-y-auto max-h-[450px] border rounded-md'>
                        <table className='min-w-full table-auto border-collapse text-sm'>
                            <thead className='bg-gray-100 sticky top-0 z-10'>
                                <tr>
                                    <th className='py-2 px-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>STT</th>

                                    <th
                                        className='py-2 px-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 whitespace-nowrap'
                                        onClick={() => requestSort('IdCard')} 
                                    >
                                        Mã Thẻ {renderSortIcon('IdCard')}
                                    </th>

                                    <th
                                        className='py-2 px-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 whitespace-nowrap'
                                        onClick={() => requestSort('Identification.Identification')} 
                                    >
                                        Mã Sinh viên {renderSortIcon('Identification.Identification')} 
                                    </th>

                                    <th className='py-2 px-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Họ và Tên</th>
                                    <th className='py-2 px-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'>SĐT</th>
                                    <th className='py-2 px-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'>Ngày Cấp</th>
                                    <th className='py-2 px-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'>Ngày Hết Hạn</th>

                                    <th
                                        className='py-2 px-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200'
                                        onClick={() => requestSort('status')} 
                                    >
                                        Trạng Thái {renderSortIcon('status')} 
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedCards && sortedCards.length > 0 ? (
                                    sortedCards.map((card, index) => {
                                        const identification = card.Identification || {}
                                        const statusClass = card.status === 'Active' ? 'text-green-700 bg-green-100' :
                                                        card.status === 'Overdue' ? 'text-red-700 bg-red-100' :
                                                        card.status === 'Suspend' ? 'text-yellow-600 bg-yellow-100' :
                                                        'text-gray-600 bg-gray-100'
                                        const isExpired = card.status === 'Overdue'
                                        const rowClass = isExpired ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'

                                        return (
                                            <tr key={card._id || card.IdCard || index} className={rowClass}>
                                                <td className='py-2 px-3 border-b border-gray-200 text-gray-700'>{index + 1}</td>
                                                <td className='py-2 px-3 border-b border-gray-200 text-gray-900 font-medium'>{card.IdCard || 'N/A'}</td>
                                                <td className='py-2 px-3 border-b border-gray-200 text-gray-700'>{identification.Identification || 'N/A'}</td>
                                                <td className='py-2 px-3 border-b border-gray-200 text-gray-700'>{identification.userName || 'N/A'}</td>
                                                <td className='py-2 px-3 border-b border-gray-200 text-gray-700'>{identification.SDT || 'N/A'}</td>
                                                <td className='py-2 px-3 border-b border-gray-200 text-gray-700 whitespace-nowrap'>{card.ngayCap ? new Date(card.ngayCap).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                                <td className='py-2 px-3 border-b border-gray-200 text-gray-700 whitespace-nowrap'>{card.ngayHetHan ? new Date(card.ngayHetHan).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                                <td className='py-2 px-3 border-b border-gray-200'>
                                                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                                                        {card.status || 'N/A'}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="py-4 px-3 text-center text-gray-500">
                                            {cards === null ? 'Đang tải dữ liệu...' : 'Không có dữ liệu thẻ nào.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QLThe