import { useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card'
import { Alert, AlertTitle } from '../../components/ui/alert';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AdminComplaints = () => {
    const {
        complaints,
        getAllComplaints,
        isLoading,
        updateComplaintStatus
    } = useContext(AdminContext);

    useEffect(() => {
        getAllComplaints();
    }, []);

    const handleStatusChange = (complaintId, newStatus) => {
        updateComplaintStatus(complaintId, newStatus);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'In Progress':
                return <AlertCircle className="w-5 h-5 text-blue-500" />;
            case 'Resolved':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            default:
                return null;
        }
    };

    const getStatusStyles = (status) => {
        const baseStyles = "px-3 py-1 rounded-full text-xs font-medium";
        switch (status) {
            case 'Pending':
                return `${baseStyles} bg-yellow-100 text-yellow-800 border border-yellow-200`;
            case 'In Progress':
                return `${baseStyles} bg-blue-100 text-blue-800 border border-blue-200`;
            case 'Resolved':
                return `${baseStyles} bg-green-100 text-green-800 border border-green-200`;
            default:
                return baseStyles;
        }
    };

    const getCardStyles = (status) => {
        const baseStyles = "border rounded-lg transition-all duration-200 hover:shadow-lg";
        switch (status) {
            case 'Pending':
                return `${baseStyles} border-yellow-200 bg-yellow-50`;
            case 'In Progress':
                return `${baseStyles} border-blue-200 bg-blue-50`;
            case 'Resolved':
                return `${baseStyles} border-green-200 bg-green-50`;
            default:
                return `${baseStyles} border-gray-200 bg-white`;
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <Alert>
                    <AlertTitle>Loading complaints...</AlertTitle>
                </Alert>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Manage Complaints</h2>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm text-gray-600">Pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-gray-600">In Progress</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-600">Resolved</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {complaints.length === 0 ? (
                    <Alert className="col-span-full">
                        <AlertTitle>No complaints found</AlertTitle>
                    </Alert>
                ) : (
                    complaints.map((complaint) => (
                        <Card
                            key={complaint._id}
                            className={getCardStyles(complaint.status)}
                        >
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-4 mb-4">
                                            <h3 className="font-bold text-lg text-gray-900">{complaint.hospitalName}</h3>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(complaint.status)}
                                                <select
                                                    value={complaint.status}
                                                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                                                    className={getStatusStyles(complaint.status)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Resolved">Resolved</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-gray-600">
                                            <p className="text-sm flex justify-between">
                                                <span className="font-medium">Doctor:</span>
                                                <span>{complaint.doctorName}</span>
                                            </p>
                                            <p className="text-sm flex justify-between">
                                                <span className="font-medium">Department:</span>
                                                <span>{complaint.department}</span>
                                            </p>
                                            <p className="text-sm flex justify-between">
                                                <span className="font-medium">Type:</span>
                                                <span>{complaint.complaintType}</span>
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="font-medium text-gray-700 mb-2">Complaint:</p>
                                            <p className="text-gray-600 text-sm leading-relaxed">{complaint.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminComplaints;