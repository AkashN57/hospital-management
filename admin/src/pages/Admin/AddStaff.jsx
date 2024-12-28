import  { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AddStaff = () => {
    const [staffImg, setStaffImg] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Nurse');
    const [department, setDepartment] = useState('General');
    const [salary, setSalary] = useState('');
    const [phone, setPhone] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');

    const { backendUrl } = useContext(AppContext);
    const { aToken } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!staffImg) {
                return toast.error('Image Not Selected');
            }

            const formData = new FormData();
            formData.append('image', staffImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', role);
            formData.append('department', department);
            formData.append('salary', Number(salary));
            formData.append('phone', phone);
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

            const { data } = await axios.post(
                backendUrl + '/api/admin/staff/add', 
                formData, 
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                // Reset form
                setStaffImg(false);
                setName('');
                setPassword('');
                setEmail('');
                setAddress1('');
                setAddress2('');
                setPhone('');
                setSalary('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Staff Member</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="staff-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={staffImg ? URL.createObjectURL(staffImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setStaffImg(e.target.files[0])} type="file" id="staff-img" hidden />
                    <p>Upload staff<br />picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Role</p>
                            <select onChange={e => setRole(e.target.value)} value={role} className='border rounded px-2 py-2'>
                                <option value="Nurse">Nurse</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Lab Technician">Lab Technician</option>
                                <option value="Pharmacist">Pharmacist</option>
                                <option value="Administrator">Administrator</option>
                            </select>
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Department</p>
                            <select onChange={e => setDepartment(e.target.value)} value={department} className='border rounded px-2 py-2'>
                                <option value="General">General</option>
                                <option value="Emergency">Emergency</option>
                                <option value="ICU">ICU</option>
                                <option value="Laboratory">Laboratory</option>
                                <option value="Pharmacy">Pharmacy</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Salary</p>
                            <input onChange={e => setSalary(e.target.value)} value={salary} className='border rounded px-3 py-2' type="number" placeholder='Monthly salary' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Phone</p>
                            <input onChange={e => setPhone(e.target.value)} value={phone} className='border rounded px-3 py-2' type="tel" placeholder='Phone number' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
                        </div>
                    </div>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Staff Member</button>
            </div>
        </form>
    );
};

export default AddStaff;