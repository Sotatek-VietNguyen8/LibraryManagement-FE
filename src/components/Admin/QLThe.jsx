

import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar'
import { ArrowLeft, Search, UserPlus } from 'lucide-react'
import { useCardStore } from '../../store/useCardStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const QLThe = () => {
    const { addCard, getCard, searchCard, cards, setCards, checkAndUpdateStatusCard } = useCardStore()
    const [searchText, setSearchText] = useState('')
    const [isAddingCard, setIsAddCard] = useState(false)
    const [formData, setFormData] = useState({
        IdCard: '',
        Identification: '',
        ngayCap: '',
        ngayHetHan: '',
        status: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        getCard()
        checkAndUpdateStatusCard()
    }, [getCard, checkAndUpdateStatusCard])
    useEffect(()=>{
        setFormData((prveFormData)=>({
            ...prveFormData,
            IdCard: prveFormData.Identification
        }))
    },[formData.Identification])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const cardData = await addCard(formData)
            if (cardData) {
                console.log('Add card: ', cardData)
                setFormData({
                    IdCard: '',
                    Identification: '',
                    ngayCap: '',
                    ngayHetHan: '',
                    status: ''
                })
                getCard() 
                setIsAddCard(false) 
            }
        } catch (error) {
            console.log('Error on submit AddCardForm: ', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancelAddCard = () => {
        setIsAddCard(false) 
    }

    const handleNewCardClick = () => {
        setIsAddCard(true) 
    }
    const handleFindCard = async()=> {
        if (!searchText) {
            toast.error('Vui lòng nhập thông tin');
            return;
        }
        try {
            const result = await searchCard(searchText)
            setCards(result)
        } catch (error) {
            console.error('Lỗi tìm kiếm', error);
            toast.error('Có lỗi xảy ra khi tìm kiếm')
        }
    }

    const navigate = useNavigate()
    const handleBack = ()=>{
        navigate(-1)
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className='container mx-auto px-4 pt-20 pb-10' style={{ paddingTop: '50px' }}>
                <div className='w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm'>
                    <h1 className='text-2xl font-extralight text-left text-gray-950 mb-2'>Quản Lí Thẻ Thư Viện</h1>
                    <div className='flex justify-start'>
                        <button
                            type="submit"
                            className="btn-primary min-w-[15px] mb-7 "
                            onClick={handleBack}
                        >
                            <ArrowLeft className='mr-6 h-5 w-5' />
                            Back
                        </button>
                    </div>

                    {isAddingCard && (
                        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className=' space-y-4'>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text text-lg font-medium  ">Identification</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input input-bordered"
                                                placeholder="Identification"
                                                value={formData.Identification}
                                                onChange={(e) => setFormData({ ...formData, Identification: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-control space-y-2">
                                            <label className="label">
                                                <span className="label-text text-lg font-medium  ">Ngay cap </span>
                                            </label>
                                            <input
                                                type="date"
                                                className="input input-bordered"
                                                placeholder="Ngay cap"
                                                value={formData.ngayCap}
                                                onChange={(e) => setFormData({ ...formData, ngayCap: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className=' space-y-4'>
                                        <div className="form-control space-y-2">
                                            <label className="label">
                                                <span className="label-text text-lg font-medium  ">IdCard </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input input-bordered"
                                                placeholder="IdCard"
                                                value={formData.IdCard}
                                                readOnly
                                                required
                                            />
                                        </div>

                                        <div className="form-control space-y-2">
                                            <label className="label">
                                                <span className="label-text text-lg font-medium  ">Ngay het han</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="input input-bordered"
                                                placeholder="Ngay het han"
                                                value={formData.ngayHetHan}
                                                onChange={(e) => setFormData({ ...formData, ngayHetHan: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-control space-y-2">
                                        <label className="label">
                                            <span className="label-text text-lg font-medium  ">Status</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full pl-10"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            required
                                        >
                                            <option value="" disabled>
                                            Choice Status
                                            </option>
                                            <option value="Active">Active</option>

                                        </select>
                                       
                                    </div>
                                </div>

                                <div className='flex justify-end mt-4'>
                                    <button type='submit' className='btn btn-primary mr-2' disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Add Card'}
                                    </button>
                                    <button type='button' className='btn btn-ghost' onClick={handleCancelAddCard}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center flex-1 justify-end"> 
                                <div className="relative flex-1 max-w-md mr-2"> 
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên, mã thẻ, mã sinh viên..."
                                        className="input input-bordered w-full pr-10"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </div>
                                <button className='btn btn-outline btn-sm mr-2' onClick={handleFindCard}> 
                                    Find
                                    <Search className=" text-gray-400" size={18} />
                                </button>

                                <div className='flex'>
                                    <button className='btn btn-outline btn-sm' onClick={handleNewCardClick}>
                                        <UserPlus size={16} className="mr-1" />
                                        New Card
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className='max-w-3xl mx-auto flex justify-center'>
                    <div className=' overflow-y-auto h-[250px]'>

                    <table className='min-w-full table-auto border-collapse border border-gray-300'>
                        <thead className='bg-gray-100 sticky top-0'>
                        <tr>
                            <th className=' py-2 px-3 border text-sm'>STT</th>
                            <th className=' py-2 px-3 border text-sm'>Ma The </th>
                            <th className=' py-2 px-3 border text-sm'>Ma sinh vien</th>
                            <th className=' py-2 px-3 border text-sm'>Ho va ten</th>
                            <th className=' py-2 px-3 border text-sm'>SDT</th>
                            <th className=' py-2 px-3 border text-sm'>Ngay cap</th>
                            <th className=' py-2 px-3 border text-sm'>Ngay het han</th>
                            <th className=' py-2 px-3 border text-sm'>Trang thai</th>
                        </tr>
                        </thead>

                        <tbody>
                        {cards && cards.map((card, index) => {
                            return (
                                <tr key={index} className={`${index % 4 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                <td className=' py-2 px-3 border text-sm'>{index + 1}</td>
                                <td className=' py-2 px-3 border text-sm'>{card.IdCard}</td>
                                <td className=' py-2 px-3 border text-sm'>{card.Identification ? card.Identification.Identification: 'N/A'}</td>
                                <td className=' py-2 px-3 border text-sm'>{card.Identification ? card.Identification.userName : 'N/A'}</td>
                                <td className=' py-2 px-3 border text-sm'>{card.Identification ? card.Identification.SDT : 'N/A'}</td>
                                <td className=' py-2 px-3 border text-sm'>{new Date(card.ngayCap).toLocaleDateString()}</td>
                                <td className=' py-2 px-3 border text-sm'>{new Date(card.ngayHetHan).toLocaleDateString()}</td>
                                <th className = {`py-2 px-3 border text-sm 
                                    ${
                                        card.status === 'Active' ? 'text-green-800': 
                                        card.status === 'Overdue' ? 'text-red-700' :
                                        card.status === 'Suspend' ? 'text-yellow-400': ''
                                    }
                                `}>{card.status}</th>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    </div>
                </div>
                
            </div>    
        </div>
    )
}

export default QLThe