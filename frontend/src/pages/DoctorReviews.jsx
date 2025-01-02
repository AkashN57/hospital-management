import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Star, ArrowLeft, Send, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorReviewsPage = () => {
    const { docId } = useParams();
    const { backendUrl, token, doctors } = useContext(AppContext);
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Review form states
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    const fetchDoctorDetails = () => {
        try {
            const doctorInfo = doctors?.find((doc) => doc._id === docId);
            if (doctorInfo) {
                setDoctor(doctorInfo);
            } else {
                toast.error('Doctor not found');
            }
        } catch (error) {
            console.error('Failed to fetch doctor details:', error);
            toast.error('Failed to fetch doctor details');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/reviews/${docId}`);
            if (data.success) {
                setReviews(data.reviews || []);
                if (token) {
                    const existingReview = data.reviews?.find(review => 
                        review.userId?._id === token.id
                    );
                    if (existingReview) {
                        setUserReview(existingReview);
                        setRating(existingReview.rating);
                        setReviewText(existingReview.review);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            toast.error('Failed to fetch reviews');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!token) {
            toast.warning('Please login to submit a review');
            return;
        }

        try {
            const endpoint = isEditing ? 
                `${backendUrl}/api/reviews/${userReview._id}` : 
                `${backendUrl}/api/reviews`;
            
            const method = isEditing ? 'put' : 'post';
            
            const { data } = await axios[method](
                endpoint,
                { doctorId: docId, rating, review: reviewText },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await fetchReviews();
                if (!isEditing) {
                    setRating(5);
                    setReviewText('');
                }
                setIsEditing(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    };

    const handleDeleteReview = async () => {
        if (!userReview) return;

        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/reviews/${userReview._id}`,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                setUserReview(null);
                setRating(5);
                setReviewText('');
                await fetchReviews();
            }
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    useEffect(() => {
        if (doctors?.length > 0) {
            fetchDoctorDetails();
        }
    }, [docId, doctors]);

    useEffect(() => {
        if (docId) {
            fetchReviews();
        }
    }, [docId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-medium mb-4">Doctor not found</h2>
                <Link to="/" className="text-primary hover:underline">
                    Go back to home
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link 
                    to={`/appointment/${docId}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Doctor Profile
                </Link>
                
                <div className="flex items-center gap-6">
                    <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-3xl font-medium">{doctor.name}</h1>
                        <p className="text-gray-600">{doctor.speciality} - {doctor.degree}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < Math.round(doctor.averageRating || 0)
                                                ? 'fill-yellow-400 stroke-yellow-400'
                                                : 'stroke-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-600">
                                ({doctor.averageRating?.toFixed(1) || '0.0'}) • {doctor.totalReviews || 0} reviews
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-medium mb-4">
                    {isEditing ? 'Edit Your Review' : 'Write a Review'}
                </h2>
                
                <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Rating Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                        </label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <Star
                                    key={value}
                                    className={`w-8 h-8 cursor-pointer transition-colors 
                                        ${(hoveredRating || rating) >= value 
                                            ? 'fill-yellow-400 stroke-yellow-400' 
                                            : 'stroke-gray-300'}`
                                    }
                                    onClick={() => setRating(value)}
                                    onMouseEnter={() => setHoveredRating(value)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Share your experience with this doctor..."
                            rows="4"
                            required
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            {isEditing ? 'Update Review' : 'Submit Review'}
                        </button>
                        
                        {userReview && (
                            <>
                                {!isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-6 py-2 border rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleDeleteReview}
                                    className="flex items-center gap-2 px-6 py-2 border rounded-full text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                <h2 className="text-xl font-medium">All Reviews</h2>
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={review.userId?.image}
                                    alt={review.userId?.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-medium">{review.userId?.name}</h3>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < review.rating
                                                        ? 'fill-yellow-400 stroke-yellow-400'
                                                        : 'stroke-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="ml-auto text-sm text-gray-500">
                                    {new Date(review.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-600">{review.review}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorReviewsPage;