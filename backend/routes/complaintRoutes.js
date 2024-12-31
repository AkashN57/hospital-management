
// routes/complaintRoutes.js
import express from 'express';
import authUser from '../middleware/authUser.js';
import authAdmin from '../middleware/authAdmin.js';
import {
    createComplaint,
    getComplaints,
    getUserComplaints,
    updateComplaint,
   
} from '../controllers/complaintController.js';

const router = express.Router();

// Base routes are now under /api/admin/complaints
router.get('/', authAdmin, getComplaints); // GET /api/admin/complaints
router.put('/:id', authAdmin, updateComplaint); // PUT /api/admin/complaints/:id

// User complaint routes should be moved to userRoute.js or kept under a different base path
router.post('/user', authUser, createComplaint);
router.get('/user', authUser, getUserComplaints);

export default router;