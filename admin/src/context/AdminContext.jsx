import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [complaints, setComplaints] = useState([]);

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } });
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to change doctor availability using API
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } });
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } });
            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } });
            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Getting all Staff data from Database using API
    const getAllStaffs = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(backendUrl + '/api/admin/staff/all', { headers: { aToken } });
            if (data.success) {
                setStaffs(data.staffs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Add new staff member
    const addStaff = async (formData) => {
        try {
            setIsLoading(true);
            const { data } = await axios.post(
                backendUrl + '/api/admin/staff/add',
                formData,
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Update staff member
    const updateStaff = async (staffId, formData) => {
        try {
            setIsLoading(true);
            const { data } = await axios.put(
                `${backendUrl}/api/admin/staff/update/${staffId}`,
                formData,
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Get single staff member
    const getStaffById = async (staffId) => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(
                `${backendUrl}/api/admin/staff/${staffId}`,
                { headers: { aToken } }
            );
            if (data.success) {
                return data.staff;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Get all complaints
    // const getAllComplaints = async () => {
    //     try {
    //         setIsLoading(true);
    //         console.log('Current aToken:', aToken);
    //         const { data } = await axios.get(
    //             `${backendUrl}/api/admin/complaints`,
    //             { headers: { aToken } }
    //         );
    //         if (data.success) {
    //             setComplaints(data.complaints);
    //         } else {
    //             toast.error(data.message);
    //         }
    //     } catch (error) {
    //         console.log('Error details:', error.response?.data || error.message);
    //         toast.error(error.response?.data?.message || error.message);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // Update complaint status
    // const updateComplaintStatus = async (complaintId, newStatus) => {
    //     try {
    //         setIsLoading(true);
    //         const { data } = await axios.put(
    //             `${backendUrl}/api/admin/complaints/${complaintId}`,
    //             { status: newStatus },
    //             { headers: { aToken } }
    //         );
    //         if (data.success) {
    //             toast.success(data.message);
    //             getAllComplaints();
    //             return true;
    //         } else {
    //             toast.error(data.message);
    //             return false;
    //         }
    //     } catch (error) {
    //         console.error('Error updating complaint:', error);
    //         toast.error(error.response?.data?.message || error.message);
    //         return false;
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const value = {
        aToken,
        setAToken,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData,
        // Staff related values
        staffs,
        isLoading,
        getAllStaffs,
        addStaff,
        updateStaff,
        getStaffById,
        // Complaints related values
        // complaints,
        // getAllComplaints,
        // updateComplaintStatus
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;