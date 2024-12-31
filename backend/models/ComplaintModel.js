// models/ComplaintModel.js
import mongoose from "mongoose"

const complaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference the 'user' model directly without import
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    complaintType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    adminResponse: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Use conditional model creation
const ComplaintModel = mongoose.models.complaint || mongoose.model("complaint", complaintSchema);
export default ComplaintModel;