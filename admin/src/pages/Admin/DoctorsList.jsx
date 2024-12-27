import  { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorsList = () => {
  const { doctors, changeAvailability, getAllDoctors, aToken } = useContext(AdminContext);
  const { backendUrl } = useContext(AppContext);

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/delete/${docId}`,
        {
          headers: { 
            aToken: aToken  // Add the admin token in headers
          },
          params: {
            confirmation: 'delete-confirmed'
          }
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Check specifically for authentication error
      if (error.response && error.response.status === 401) {
        toast.error('Please login again to continue');
        // Optionally redirect to login page or handle session expiry
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p>Available</p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="mt-2 w-full px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;