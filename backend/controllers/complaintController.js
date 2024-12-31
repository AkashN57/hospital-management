import ComplaintModel from '../models/ComplaintModel.js';

// Create complaint
const createComplaint = async (req, res) => {
    try {
        const complaint = new ComplaintModel({
            ...req.body,
            userId: req.body.userId,
            status: 'Pending'
        });
        await complaint.save();
        res.json({ success: true, complaint });
    } catch (error) {
        console.error('Create complaint error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get all complaints
const getComplaints = async (req, res) => {
    try {
        const complaints = await ComplaintModel.find()
            .populate('userId', 'name email phone')
            .sort('-createdAt');
        res.json({ success: true, complaints });
    } catch (error) {
        console.error('Get complaints error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get user complaints
const getUserComplaints = async (req, res) => {
    try {
        const complaints = await ComplaintModel.find({ userId: req.body.userId })
            .sort({ createdAt: -1 });
        res.json({ success: true, complaints });
    } catch (error) {
        console.error('Get user complaints error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Update complaint
const updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminResponse, status } = req.body;

        const complaint = await ComplaintModel.findByIdAndUpdate(
            id,
            { adminResponse, status },
            { new: true, runValidators: true }
        );

        if (!complaint) {
            return res.json({
                success: false,
                message: 'Complaint not found'
            });
        }

        res.json({
            success: true,
            message: 'Complaint updated successfully',
            complaint
        });
    } catch (error) {
        console.error('Update complaint error:', error);
        res.json({ success: false, message: error.message });
    }
};

export {
    createComplaint,
    getComplaints,
    getUserComplaints,
    updateComplaint
};