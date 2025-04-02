import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { useDocketStore } from '../../store/useDocketStore';
import { FileTextIcon, UserIcon, BookIcon, CalendarIcon, ArrowLeft, BookKey } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCardStore } from '../../store/useCardStore';
import { useBookStore } from '../../store/useBookStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreateDocket = () => {
    const { creatDocket } = useDocketStore();
    const { authUser } = useAuthStore();
    const { searchCard } = useCardStore();
    const { getBookById } = useBookStore();
    const [isCardLoading, setIsCardLoading] = useState(false);
    const [isBookLoading, setIsBookLoading] = useState(false);

    const generateRandomCharacters = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 2; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };
    const generateRandomNumbers = () => {
        return Math.floor(Math.random() * 90000) + 10000;
    };
    const generateRandomIdDocket = () => {
        const character = generateRandomCharacters();
        const number = generateRandomNumbers();
        return `${character}-${number}`;
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const calculateDefaultReturnDate = (startDate) => {
        const returnDate = new Date(startDate);
        returnDate.setMonth(returnDate.getMonth() + 4);
        return formatDate(returnDate);
    };

    const today = new Date();
    const initialNgayMuon = formatDate(today);
    const initialNgayHenTra = calculateDefaultReturnDate(today);

    const [formData, setFormData] = useState({
        IdDocket: '',
        IdCard: '',
        bookName: '',
        IdBook: '',
        Identification: '',
        userName: '',
        SDT: '',
        ngayMuon: initialNgayMuon,
        ngayHenTra: initialNgayHenTra,
        ngayTra: '',
        status: '',
        soLuongMuon: '',
        soLuongCon: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
          setFormData(prevFormData => ({
              ...prevFormData,
              IdDocket: generateRandomIdDocket()
          }))
      }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (parseInt(formData.soLuongMuon) > parseInt(formData.soLuongCon) || !formData.soLuongCon) {
            toast.error("Số lượng mượn vượt quá số lượng sách còn lại!");
            setIsSubmitting(false);
            return;
        }

        const ngayMuonDate = new Date(formData.ngayMuon);
        const ngayHenTraDate = new Date(formData.ngayHenTra);

        if (isNaN(ngayHenTraDate.getTime())) {
            toast.error("Vui lòng chọn ngày hẹn trả hợp lệ.");
            setIsSubmitting(false);
            return;
        }

        const maxHenTra = new Date(ngayMuonDate);
        maxHenTra.setMonth(ngayMuonDate.getMonth() + 4);

        if (ngayHenTraDate.getTime() > maxHenTra.getTime()) {
            toast.error("Hẹn trả vượt quá 4 tháng!");
            setIsSubmitting(false);
            return;
        }

        try {
            const docketData = await creatDocket({
                ...formData,
                ngayMuon: new Date(formData.ngayMuon),
                ngayHenTra: new Date(formData.ngayHenTra)
            });

            if (docketData) {
                console.log('Create Docket: ', formData);
                const today = new Date();
                setFormData(prevFormData => ({
                    IdDocket: generateRandomIdDocket(),
                    IdCard: '',
                    bookName: '',
                    IdBook: '',
                    Identification: '',
                    userName: '',
                    SDT: '',
                    ngayMuon: formatDate(today),
                    ngayHenTra: calculateDefaultReturnDate(today),
                    ngayTra: '',
                    status: '',
                    soLuongMuon: '',
                    soLuongCon: ''
                }));
                setIsSubmitting(false);
            }
        } catch (error) {
            console.log('Error on submit CreateDocketForm: ', error);
            toast.error(error.response?.data?.message || "Failed to create docket");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let newNgayHenTra = formData.ngayHenTra;

        if (name === 'ngayMuon') {
            newNgayHenTra = calculateDefaultReturnDate(value);
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
            ...(name === 'ngayMuon' ? { ngayHenTra: newNgayHenTra } : {}),
        }));
    };


    useEffect(() => {
        const loadCard = async () => {
            setIsCardLoading(true);
            try {
                if (formData.IdCard) {
                    const cardData = await searchCard(formData.IdCard);

                    if (cardData && cardData.length > 0) {

                        const findCard = cardData.find(card => card.IdCard === formData.IdCard);

                        if (findCard) {
                            setFormData(prev => ({
                                ...prev,
                                Identification: findCard.Identification?.Identification || '',
                                userName: findCard.Identification?.userName || '',
                                SDT: findCard.Identification?.SDT || '',
                            }));
                        } else {
                            setFormData(prev => ({
                                ...prev,
                                Identification: '',
                                userName: '',
                                SDT: '',
                            }));
                        }
                    }
                }
            } catch (error) {
                console.log("Failed to load card");
            } finally {
                setIsCardLoading(false);
            }
        };

        loadCard();

    }, [formData.IdCard, searchCard]);

    useEffect(() => {
        const loadBookId = async () => {
            setIsBookLoading(true);
            try {
                if (formData.IdBook) {
                    const bookData = await getBookById(formData.IdBook);
                    if (bookData) {
                        setFormData(prev => ({
                            ...prev,
                            bookName: bookData.bookName,
                            soLuongCon: bookData.soLuongCon,
                        }));
                    } else {
                        setFormData(prev => ({
                            ...prev,
                            bookName: '',
                            soLuongCon: '',
                        }));
                    }
                } else {
                    setFormData(prev => ({
                        ...prev,
                        bookName: '',
                        soLuongCon: ''
                    }));
                }
            } catch (error) {
                console.log("Failed to load book");
            } finally {
                setIsBookLoading(false);
            }
        };

        loadBookId();

    }, [formData.IdBook, getBookById]);

    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className='container mx-auto px-4 pt-20 pb-10' style={{ paddingTop: '50px' }}>
                <div className='w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm'>
                    <h1 className='text-2xl font-extralight text-center text-gray-950 mb-3'>Quản lí Phiếu mượn/trả Sách</h1>
                    <h1 className='text-sm text-center text-gray-950 mb-9'>HỌC VIỆN KỸ THUẬT MẬT MÃ</h1>
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                        <form onSubmit={handleSubmit}>

                            <div className="mb-4">
                                <h3 className="text-lg font-medium flex items-center">
                                    <FileTextIcon className="mr-2 h-5 w-5" />
                                    Thông tin phiếu
                                </h3>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">Mã phiếu - IdDocket</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered"
                                            placeholder="IdDocket"
                                            value={formData.IdDocket}
                                            readOnly
                                            name='IdDocket'
                                            required
                                        />
                                    </div>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">Ngày mượn </span>
                                        </label>
                                        <input
                                            type="date"
                                            className="input input-bordered"
                                            placeholder="dd/mm/yyyy"
                                            value={formData.ngayMuon}
                                            onChange={handleInputChange}
                                            name='ngayMuon'
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-medium flex items-center">
                                    <UserIcon className="mr-2 h-5 w-5" />
                                    Thông tin người mượn
                                </h3>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">Mã thẻ</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered"
                                            placeholder="IdCard"
                                            value={formData.IdCard}
                                            onChange={handleInputChange}
                                            name='IdCard'
                                            required
                                        />
                                        {isCardLoading && <span className="loading loading-spinner loading-sm"></span>}
                                    </div>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">Identification</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered"
                                            placeholder="Identification"
                                            value={formData.Identification}
                                            onChange={handleInputChange}
                                            name='Identification'
                                            readOnly
                                            required
                                        />
                                    </div>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">Họ và tên</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered"
                                            placeholder="Họ và tên"
                                            value={formData.userName}
                                            onChange={handleInputChange}
                                            name='userName'
                                            readOnly
                                            required
                                        />
                                    </div>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">SDT</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered"
                                            placeholder="SDT"
                                            value={formData.SDT}
                                            onChange={handleInputChange}
                                            name='SDT'
                                            readOnly
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-medium flex items-center">
                                    <BookIcon className="mr-2 h-5 w-5" />
                                    Thông tin sách
                                </h3>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">Mã sách</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered"
                                            placeholder="IdBook"
                                            value={formData.IdBook}
                                            onChange={handleInputChange}
                                            name='IdBook'
                                            required
                                        />
                                        {isBookLoading && <span className="loading loading-spinner loading-sm"></span>}
                                    </div>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">So luong sach con lai</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="input input-bordered"
                                            placeholder=""
                                            value={formData.soLuongCon}
                                            readOnly
                                            name='soLuongCon'
                                            required
                                        />
                                    </div>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">Tên sách</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered"
                                            placeholder="Tên sách"
                                            value={formData.bookName}
                                            onChange={handleInputChange}
                                            name='bookName'
                                            readOnly
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-medium flex items-center">
                                    <CalendarIcon className="mr-2 h-5 w-5" />
                                    Thông tin mượn trả
                                </h3>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">So luong muon</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="input input-bordered"
                                            placeholder='1'
                                            value={formData.soLuongMuon}
                                            onChange={handleInputChange}
                                            name='soLuongMuon'
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">Ngày hẹn trả </span>
                                        </label>
                                        <input
                                            type="date"
                                            className="input input-bordered"
                                            placeholder="dd/mm/yyyy"
                                            value={formData.ngayHenTra}
                                            onChange={handleInputChange}
                                            name='ngayHenTra'
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-medium flex items-center">
                                    <UserIcon className="mr-2 h-5 w-5" />
                                    Thông tin người tạo phiếu
                                </h3>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">Max Nhân viên </span>
                                        </label>
                                        <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{authUser.Identification}</p>
                                    </div>
                                    <div className='form-control mb-4'>
                                        <label className="label">
                                            <span className="label-text text-sm font-medium">Họ và tên</span>
                                        </label>
                                        <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{authUser.userName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex justify-start'>
                                    <button
                                        type="submit"
                                        className="btn-primary min-w-[15px] mt-4 "
                                        onClick={handleBack}
                                    >
                                        <ArrowLeft className='mr-2 h-5 w-5' />
                                        Back
                                    </button>
                                </div>

                                <div className='flex justify-end'>
                                    <button
                                        type="submit"
                                        className="btn btn-success min-w-[250px] mt-4 "
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Đang xử lý..." : "Tạo phiếu mượn"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateDocket