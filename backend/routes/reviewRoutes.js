// routes/reviewRoutes.js
import express from 'express';
import authUser from '../middleware/authUser.js';
import {
    getDoctorReviews,
    addReview,
    updateReview,
    deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Public routes
router.get('/:doctorId', getDoctorReviews);


router.post('/', authUser,addReview);
router.put('/:reviewId', authUser,updateReview);
router.delete('/:reviewId', authUser,deleteReview);

export default router;