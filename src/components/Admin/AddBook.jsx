import React, { useState } from 'react' 
import Navbar from '../Navbar' 
import { useBookStore } from '../../store/useBookStore' 
import { BookText, Loader2 } from 'lucide-react' 

const AddBook = () => {
    const [formData, setFormData] = useState({
        IdBook: '',
        bookName: '',
        author: '',
        NXB: '',
        soLuong: '',
        description: '',
    }) 
    const [isSubmitting, setIsSubmitting] = useState(false) 

    const { addBook } = useBookStore() 

    const handleSubmit = async (e) => {
        e.preventDefault() 
        setIsSubmitting(true)
        console.log("Data to be sent:", formData) 
        try {
            const bookData = await addBook(formData) 
            if (bookData) {
                console.log('Add Book: ', bookData) 
                setFormData({
                    IdBook: '',
                    bookName: '',
                    author: '',
                    NXB: '',
                    soLuong: '',
                    description: '',
                }) 
            }
        } catch (error) {
            console.log('Error on submit addBookForm: ', error) 
        } finally {
            setIsSubmitting(false) 
        }
    } 

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 pt-20 pb-10" style={{ paddingTop: '80px' }}>
                <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">

                    <h1 className="text-2xl font-bold text-center mb-6">THÊM SÁCH MỚI</h1>
                    <p className="text-center">Vui lòng nhập thông tin tài liệu</p>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className=' space-y-4'>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-lg font-medium  ">BookID* </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        placeholder="Nhap ma sach"
                                        value={formData.IdBook}
                                        onChange={(e) => setFormData({ ...formData,IdBook: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-control space-y-2">
                                    <label className="label">
                                        <span className="label-text text-lg font-medium  ">Book Name* </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        placeholder="Nhap Ten sach"
                                        value={formData.bookName}
                                        onChange={(e) => setFormData({ ...formData, bookName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-control space-y-2">
                                    <label className="label">
                                        <span className="label-text text-lg font-medium  ">Author* </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        placeholder="Tac gia.."
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='space-y-4'>
                                <div className="form-control space-y-2">
                                    <label className="label">
                                        <span className="label-text text-lg font-medium  ">Nhà Xuất Bản* </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        placeholder="Nha xuat ban.."
                                        value={formData.NXB}
                                        onChange={(e) => setFormData({ ...formData, NXB: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-control space-y-2">
                                    <label className="label">
                                        <span className="label-text text-lg font-medium  ">Số Lượng* </span>
                                    </label>
                                    <input
                                        type="number"
                                        className="input input-bordered"
                                        placeholder="So Luong"
                                        value={formData.soLuong}
                                        onChange={(e) => setFormData({ ...formData, soLuong: e.target.value === "" ? 0 : e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-control space-y-2 mt-4">
                            <label className="label">
                                <span className="label-text text-lg font-medium  ">Mô tả </span>
                            </label>
                            <textarea
                                type="text"
                                className="textarea textarea-bordered w-full"
                                placeholder="Description - mo ta sach"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4" />
                                    Đang xử lí...
                                </>
                            ) : (
                                <>
                                    <BookText className="mr-2 h-4 w-4" />
                                    Add Book
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    ) 
} 

export default AddBook 