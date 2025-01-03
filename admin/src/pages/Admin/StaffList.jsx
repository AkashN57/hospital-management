import  { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const StaffList = () => {
    const { staffs, getAllStaffs, aToken, isLoading } = useContext(AdminContext);
    const { backendUrl } = useContext(AppContext);

    const handleDelete = async (staffId) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) {
            return;
        }

        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/admin/staff/delete/${staffId}`,
                {
                    headers: { aToken },
                    params: {
                        confirmation: 'delete-confirmed'
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAllStaffs();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Please login again to continue');
            } else {
                toast.error(error.response?.data?.message || error.message);
            }
            console.log(error);
        }
    };

    useEffect(() => {
        getAllStaffs();
    }, []);

    if (isLoading) {
        return (
            <div className="m-5 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className='m-5 max-h-[90vh] overflow-y-scroll'>
            <div className="flex justify-between items-center mb-5">
                <h1 className='text-lg font-medium px-8'>All Staff Members</h1>
                <Link 
                    to="/admin/add-staff" 
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                >
                    Add Staff
                </Link>
            </div>

            {staffs && staffs.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    No staff members found
                </div>
            ) : (
                <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
                    {staffs?.map((item, index) => (
                        <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
                            <img 
                                className='w-full h-48 object-cover bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' 
                                src={item.image} 
                                alt={item.name} 
                            />
                            <div className='p-4'>
                                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                                <p className='text-[#5C5C5C] text-sm'>{item.role}</p>
                                <p className='text-[#5C5C5C] text-sm'>{item.department}</p>
                                <div className='mt-2 flex gap-2'>
                                    <Link 
                                        to={`/EditStaff/${item._id}`}
                                        className="flex-1 text-center px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="flex-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffList;