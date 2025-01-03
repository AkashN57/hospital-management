import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import DoctorReviews from './DoctorReviews';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState(false);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [showReviews, setShowReviews] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const navigate = useNavigate();

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId);
        setDocInfo(docInfo);
    };

    const getAvailableSolts = async () => {
        setDocSlots([]);

        // getting current date
        let today = new Date();

        for (let i = 0; i < 7; i++) {
            // getting date with index 
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            // setting end time of the date with index
            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();

                const slotDate = day + "_" + month + "_" + year;
                const slotTime = formattedTime;

                const isSlotAvailable = docInfo.slots_booked[slotDate] && 
                                     docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    });
                }

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setDocSlots(prev => ([...prev, timeSlots]));
        }
    };

    const handleReviewClick = () => {
        if (!token) {
            toast.warning('Please login to submit a review');
            navigate('/login');
            return;
        }
        setIsSubmittingReview(true);
        setShowReviews(true);
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book appointment');
            return navigate('/login');
        }

        if (!slotTime) {
            toast.warning('Please select a time slot');
            return;
        }

        const date = docSlots[slotIndex][0].datetime;

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        const slotDate = day + "_" + month + "_" + year;

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`, 
                { docId, slotDate, slotTime }, 
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                getDoctosData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo();
        }
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts();
        }
    }, [docInfo]);

    return docInfo ? (
        <div className="container mx-auto px-4 py-8 pt-24">
            {/* Doctor Details */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img 
                        className='bg-primary w-full sm:max-w-72 rounded-lg object-cover' 
                        src={docInfo.image} 
                        alt={docInfo.name} 
                    />
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    {/* Doctor Info Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                                {docInfo.name} 
                                <img className='w-5' src={assets.verified_icon} alt="verified" />
                            </p>
                            <div className='flex items-center gap-2 mt-1 text-gray-600'>
                                <p>{docInfo.degree} - {docInfo.speciality}</p>
                                <span className='py-0.5 px-2 border text-xs rounded-full'>
                                    {docInfo.experience}
                                </span>
                            </div>
                        </div>

                        {/* Rating and Review Section */}
                        <div className="text-right">
                            
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => {
                                        setIsSubmittingReview(false);
                                        setShowReviews(true);
                                    }}
                                    className="text-sm text-primary hover:underline"
                                >
                                    See all reviews.
                                </button>
                                <button
                                    onClick={handleReviewClick}
                                    className="text-sm bg-primary text-white px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
                                >
                                    Write a Review
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Doctor About Section */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>
                            About 
                            <img className='w-3' src={assets.info_icon} alt="info" />
                        </p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            {docInfo.about}
                        </p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee: 
                        <span className='text-gray-800 ml-2'>
                            {currencySymbol}{docInfo.fees}
                        </span>
                    </p>
                </div>
            </div>

            {/* Booking Slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
                <p className="mb-4">Booking slots</p>
                
                {/* Date Selection */}
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {docSlots.length > 0 && docSlots.map((item, index) => (
                        <div 
                            onClick={() => setSlotIndex(index)} 
                            key={index} 
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-colors duration-300
                                ${slotIndex === index 
                                    ? 'bg-primary text-white' 
                                    : 'border border-[#DDDDDD] hover:bg-gray-50'
                                }`}
                        >
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                {/* Time Slots */}
                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                        <button
                            onClick={() => setSlotTime(item.time)}
                            key={index}
                            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full transition-colors duration-300
                                ${item.time === slotTime
                                    ? 'bg-primary text-white'
                                    : 'text-[#949494] border border-[#B4B4B4] hover:bg-gray-50'
                                }`}
                        >
                            {item.time.toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Book Appointment Button */}
                <button 
                    onClick={bookAppointment}
                    className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6
                        hover:bg-primary/90 transition-colors duration-300'
                >
                    Book an appointment
                </button>
            </div>

            {/* Reviews Modal */}
            {showReviews && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-medium">
                                {isSubmittingReview ? 'Write a Review' : 'Reviews & Ratings'}
                            </h2>
                            <button 
                                onClick={() => {
                                    setShowReviews(false);
                                    setIsSubmittingReview(false);
                                }}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ✕
                            </button>
                        </div>
                        <DoctorReviews 
                            doctorId={docId}
                            isSubmitting={isSubmittingReview}
                            onClose={() => {
                                setShowReviews(false);
                                setIsSubmittingReview(false);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Related Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
};

Appointment.propTypes = {
    docId: PropTypes.string,
    doctorId: PropTypes.string,
    isSubmitting: PropTypes.bool,
    onClose: PropTypes.func
};

export default Appointment;