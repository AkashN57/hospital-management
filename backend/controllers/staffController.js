import staffModel from "../models/staffModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";

// Add new staff member
const addStaff = async (req, res) => {
    try {
        const { name, email, password, role, department, salary, phone, address } = req.body;
        const imageFile = req.file;

        // Check for required fields
        if (!name || !email || !password || !role || !department || !salary || !phone || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Check if email already exists
        const existingStaff = await staffModel.findOne({ email });
        if (existingStaff) {
            return res.json({ success: false, message: "Email already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        // Create new staff member
        const staffData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            role,
            department,
            salary: Number(salary),
            phone,
            address: JSON.parse(address),
            joinDate: Date.now()
        };

        const newStaff = new staffModel(staffData);
        await newStaff.save();
        res.json({ success: true, message: 'Staff Member Added Successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all staff members
const getAllStaff = async (req, res) => {
    try {
        const staffs = await staffModel.find({})
            .select('-password')
            .sort({ joinDate: -1 });
        res.json({ success: true, staffs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single staff member
const getStaffById = async (req, res) => {
    try {
        const staffId = req.params.id;
        const staff = await staffModel.findById(staffId).select('-password');
        
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        res.json({ success: true, staff });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update staff member
const updateStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        const { name, email, role, department, salary, phone, status, address } = req.body;
        const imageFile = req.file;

        // Check if staff exists
        const staff = await staffModel.findById(staffId);
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        // Check if email exists for another staff member
        const existingStaff = await staffModel.findOne({ email, _id: { $ne: staffId } });
        if (existingStaff) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use by another staff member'
            });
        }

        // Prepare update data
        const updateData = {
            name,
            email,
            role,
            department,
            salary: Number(salary),
            phone,
            status,
            address: JSON.parse(address)
        };

        // If new image is uploaded, update image URL
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;
        }

        // Update staff member
        const updatedStaff = await staffModel.findByIdAndUpdate(
            staffId, 
            updateData, 
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Staff member updated successfully',
            staff: updatedStaff
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete staff member
const deleteStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        const { confirmation } = req.query;

        if (confirmation !== 'delete-confirmed') {
            return res.status(400).json({
                success: false,
                message: 'Invalid deletion request'
            });
        }

        const staff = await staffModel.findById(staffId);
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        // Delete staff member's image from cloudinary
        const imageUrl = staff.image;
        if (imageUrl) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await staffModel.findByIdAndDelete(staffId);
        res.json({
            success: true,
            message: 'Staff member deleted successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update staff shifts
const updateStaffShifts = async (req, res) => {
    try {
        const staffId = req.params.id;
        const { shifts } = req.body;

        const staff = await staffModel.findById(staffId);
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        staff.shifts = shifts;
        await staff.save();

        res.json({
            success: true,
            message: 'Staff shifts updated successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Request leave
const requestLeave = async (req, res) => {
    try {
        const staffId = req.params.id;
        const { startDate, endDate, reason } = req.body;

        const staff = await staffModel.findById(staffId);
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        staff.leaves.push({
            startDate,
            endDate,
            reason,
            status: 'Pending'
        });

        await staff.save();

        res.json({
            success: true,
            message: 'Leave request submitted successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Manage leave request
const manageLeaveRequest = async (req, res) => {
    try {
        const staffId = req.params.id;
        const { leaveId, action } = req.body;

        const staff = await staffModel.findById(staffId);
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        const leave = staff.leaves.id(leaveId);
        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        leave.status = action;
        if (action === 'Approved') {
            staff.status = 'On Leave';
        }

        await staff.save();

        res.json({
            success: true,
            message: `Leave request ${action.toLowerCase()} successfully`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get staff statistics
const getStaffStats = async (req, res) => {
    try {
        const stats = await staffModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalStaff: { $sum: 1 },
                    averageSalary: { $avg: "$salary" },
                    departmentCounts: {
                        $push: {
                            department: "$department",
                            status: "$status"
                        }
                    }
                }
            }
        ]);

        const departmentStats = stats[0].departmentCounts.reduce((acc, curr) => {
            acc[curr.department] = acc[curr.department] || { total: 0, active: 0, onLeave: 0 };
            acc[curr.department].total++;
            if (curr.status === 'Active') acc[curr.department].active++;
            if (curr.status === 'On Leave') acc[curr.department].onLeave++;
            return acc;
        }, {});

        res.json({
            success: true,
            stats: {
                totalStaff: stats[0].totalStaff,
                averageSalary: Math.round(stats[0].averageSalary),
                departmentStats
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update staff password
const updateStaffPassword = async (req, res) => {
    try {
        const staffId = req.params.id;
        const { currentPassword, newPassword } = req.body;

        const staff = await staffModel.findById(staffId);
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, staff.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters'
            });
        }

        // Hash and update new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        staff.password = hashedPassword;
        await staff.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
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
};