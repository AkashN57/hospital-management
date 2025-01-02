import Review from '../models/reviewSchemaModel.js';
import Doctor from '../models/doctorModel.js';
import mongoose from 'mongoose';

// Get doctor's reviews (public route)
const getDoctorReviews = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.json({
                success: false,
                message: 'Invalid doctor ID format'
            });
        }

        const reviews = await Review.find({ doctorId })
            .populate('userId', 'name image')
            .sort({ date: -1 });

        res.json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Add a review
// Add a review
const addReview = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { doctorId, rating, review, userId } = req.body;

        // Validate input
        if (!doctorId || !rating || !review || !userId) {
            return res.json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.json({
                success: false,
                message: 'Invalid doctor ID format'
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            return res.json({
                success: false,
                message: 'Rating must be an integer between 1 and 5'
            });
        }

        // Check if doctor exists
        const doctorExists = await Doctor.exists({ _id: doctorId });
        if (!doctorExists) {
            return res.json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Check for existing review
        const existingReview = await Review.findOne({ doctorId, userId });
        if (existingReview) {
            return res.json({
                success: false,
                message: 'You have already reviewed this doctor'
            });
        }

        // Create the review
        const newReview = await Review.create([{
            doctorId,
            userId,
            rating,
            review,
            date: new Date()
        }], { session });

        // Get all reviews including the new one
        const reviews = await Review.find({ doctorId }).session(session);
        
        // Calculate new average rating
        let averageRating = 0;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
            averageRating = Number((totalRating / reviews.length).toFixed(1));
        }

        // Update doctor's average rating
        await Doctor.findByIdAndUpdate(
            doctorId,
            {
                averageRating: averageRating,
                totalReviews: reviews.length
            },
            { session }
        );

        await session.commitTransaction();

        const populatedReview = await Review.findById(newReview[0]._id)
            .populate('userId', 'name image');

        res.json({
            success: true,
            message: 'Review added successfully',
            review: populatedReview
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Error adding review:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    } finally {
        session.endSession();
    }
};
// Update a review
const updateReview = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { reviewId } = req.params;
        const { rating, review, userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.json({
                success: false,
                message: 'Invalid review ID format'
            });
        }

        if (rating && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
            return res.json({
                success: false,
                message: 'Rating must be an integer between 1 and 5'
            });
        }

        const updatedReview = await Review.findOneAndUpdate(
            { _id: reviewId, userId },
            { rating, review },
            { new: true, session, runValidators: true }
        ).populate('userId', 'name image');

        if (!updatedReview) {
            return res.json({
                success: false,
                message: 'Review not found or unauthorized'
            });
        }

        // Update doctor's average rating
        const doctorId = updatedReview.doctorId;
        const reviews = await Review.find({ doctorId });
        const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

        await Doctor.findByIdAndUpdate(
            doctorId,
            {
                averageRating: Number(averageRating.toFixed(1)),
                totalReviews: reviews.length
            },
            { session }
        );

        await session.commitTransaction();

        res.json({
            success: true,
            message: 'Review updated successfully',
            review: updatedReview
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error updating review:', error);
        res.json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { reviewId } = req.params;
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.json({
                success: false,
                message: 'Invalid review ID format'
            });
        }

        const deletedReview = await Review.findOneAndDelete(
            { _id: reviewId, userId },
            { session }
        );

        if (!deletedReview) {
            return res.json({
                success: false,
                message: 'Review not found or unauthorized'
            });
        }

        // Update doctor's average rating
        const doctorId = deletedReview.doctorId;
        const reviews = await Review.find({ doctorId });
        const averageRating = reviews.length ?
            reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0;

        await Doctor.findByIdAndUpdate(
            doctorId,
            {
                averageRating: Number(averageRating.toFixed(1)),
                totalReviews: reviews.length
            },
            { session }
        );

        await session.commitTransaction();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error deleting review:', error);
        res.json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
};

export {
    getDoctorReviews,
    addReview,
    updateReview,
    deleteReview
};