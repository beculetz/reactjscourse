import { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, ref, string } from 'yup';
import { toast } from 'react-toastify';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput';
import { useAuthContext } from './AuthContext';
import { useApi } from '../../hooks/useApi';
import { useLocation, useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const profileSchema = object({
  email: string()
    .email('The email address is not valid')
    .required('Please provide an email address'),
  password: string().test(
    'empty-or-4-characters-check',
    'The password needs to be at least 4 characters long',
    password => !password || password.length >= 4,
    ),
  retypePassword: string()
    .oneOf([ref('password')], 'The two passwords do not match'),
  firstName: string().required('Please tell us your first name'),
  lastName: string().required('Please tell us your last name'),
});

export function Profile() {

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { accessToken, user, login, logout } = useAuthContext();
    const { get, patch } = useApi('users');

    const [userProfileData, setUserProfileData] = useState({ email: user.email, password: "", firstName: user.firstName, lastName: user.lastName });

    useEffect(() => {
        async function getUserProfile() {
            const data = await get(null, user?.id, { accessToken });
            setUserProfileData({email: data.email, password:"", firstName: data.firstName, lastName: data.lastName});
        }
        getUserProfile();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        } = useForm({
        resolver: yupResolver(profileSchema),
    });

    /** handles user profile update */
    const handleUpdateUserProfileData = e => {
        const { name, value } = e.target;
        setUserProfileData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    async function onSubmit(values) {
        let { retypePassword, ...dataToSave } = values;
        const dataToAuth = dataToSave;
        if (values.password=='') {
            let {password, ...dataToSaveNoPass } = dataToSave;
            dataToSave = dataToSaveNoPass;
        }

        await patch(user?.id, dataToSave, { accessToken });

        setUserProfileData(prevState => ({
            ...prevState,
            dataToSave
        }));

        toast.success('Profile edited succesfully.');
        //const path = state.from ?? '/';
        //console.log(state);
        navigate('/');

        /* let path = '/login';
        logout();

        if (dataToAuth.password!='') {
            console.log('dataToAuth: '+JSON.stringify(dataToAuth));
            login(dataToAuth);
            path = pathname;
        }

        navigate(path); */
        
    }
    
    return (
        <>
        <div className='container'>
        <div className='row d-flex justify-content-center'>
          <div className='col-6 mt-5'>
            <h1>Edit profile</h1>
            <form className="brandForm" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" className="form-control" {...register('email')} value={userProfileData.email} placeholder={userProfileData.email} onChange={handleUpdateUserProfileData} />
                    {errors.email && (
                    <p className="secondColumn fieldError">{errors.email.message}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <PasswordInput name="password" className="form-control" onChange={handleUpdateUserProfileData} {...register('password')} />
                    {errors.password && (
                    <p className="secondColumn fieldError">{errors.password.message}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="retypePassword">Retype Password</label>
                    <PasswordInput
                    name="retypePassword" className="form-control"
                    {...register('retypePassword')}
                    />
                    {errors.retypePassword && (
                    <p className="secondColumn fieldError">
                        {errors.retypePassword.message}
                    </p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" className="form-control" {...register('firstName')} value={userProfileData.firstName} placeholder={userProfileData.firstName} onChange={handleUpdateUserProfileData} />
                    {errors.firstName && (
                    <p className="secondColumn fieldError">
                        {errors.firstName.message}
                    </p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" className="form-control" {...register('lastName')} value={userProfileData.lastName} placeholder={userProfileData.lastName} onChange={handleUpdateUserProfileData} />
                    {errors.lastName && (
                    <p className="secondColumn fieldError">
                        {errors.lastName.message}
                    </p>
                    )}
                </div>
                <button type="submit" className="btn btn-success mt-4">
                    Save profile
                </button>
            </form>
            </div>
        </div>
        </div>
        </>
    );
}
