import express from 'express';
import { 
    addStaff, 
    getAllStaff, 
    getStaffById,
    updateStaff, 
    deleteStaff,
    updateStaffShifts,
    requestLeave,
    manageLeaveRequest,
    getStaffStats,
    updateStaffPassword
} from '../controllers/staffController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const staffRouter = express.Router();

// Basic CRUD operations
staffRouter.post("/staff/add", authAdmin, upload.single('image'), addStaff);
staffRouter.get("/staff/all", authAdmin, getAllStaff);
staffRouter.get("/staff/:id", authAdmin, getStaffById);
staffRouter.put("/staff/update/:id", authAdmin, upload.single('image'), updateStaff);
staffRouter.delete("/staff/delete/:id", authAdmin, deleteStaff);

// Shift management
staffRouter.put("/staff/shifts/:id", authAdmin, updateStaffShifts);

// Leave management
staffRouter.post("/staff/leave/request/:id", authAdmin, requestLeave);
staffRouter.put("/staff/leave/manage/:id", authAdmin, manageLeaveRequest);

// Statistics
staffRouter.get("/staff/stats", authAdmin, getStaffStats);

// Password management
staffRouter.put("/staff/password/:id", authAdmin, updateStaffPassword);

export default staffRouter;