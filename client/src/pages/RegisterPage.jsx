import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserContext } from '../context/UserContext.js';
import { Eye, EyeOff, Mail, Lock, UserPlus, Upload } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    avatar: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post('/api/register', formData);

      console.log('Registration successful:', response.data);
      
      // Set the user in context (auto-login after registration)
      setUser(response.data);
      
      // Replace alert with success toast
      toast.success(`Welcome to Sahayog, ${response.data.firstName || response.data.name}!`, {
        icon: '🎉',
        duration: 4000,
      });
      
      navigate('/');

    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || 'Registration failed';
        setErrors({ submit: errorMessage });
        toast.error(errorMessage);
      } else {
        const errorMessage = 'Network error. Please try again.';
        setErrors({ submit: errorMessage });
        toast.error(errorMessage);
        console.error('Registration error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-[#008080] rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} className={`relative block w-full px-3 py-3 border ${ errors.firstName ? 'border-[#ff6b6b]' : 'border-gray-300' } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-colors`} placeholder="First Name"/>
              {errors.firstName && (<p className="mt-1 text-sm text-[#ff6b6b]">{errors.firstName}</p>)}
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className={`relative block w-full px-3 py-3 border ${ errors.lastName ? 'border-[#ff6b6b]' : 'border-gray-300' } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-colors`} placeholder="Last Name"/>
              {errors.lastName && (<p className="mt-1 text-sm text-[#ff6b6b]">{errors.lastName}</p>)}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className={`block w-full pl-10 pr-3 py-3 border ${ errors.email ? 'border-[#ff6b6b]' : 'border-gray-300' } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-colors`} placeholder="Email address"/>
            </div>
            {errors.email && (<p className="mt-1 text-sm text-[#ff6b6b]">{errors.email}</p>)}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} className={`block w-full pl-10 pr-10 py-3 border ${ errors.password ? 'border-[#ff6b6b]' : 'border-gray-300' } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-colors`} placeholder="Password"/>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                  {showPassword ? (<EyeOff className="h-5 w-5" />) : (<Eye className="h-5 w-5" />)}
                </button>
              </div>
            </div>
            {errors.password && (<p className="mt-1 text-sm text-[#ff6b6b]">{errors.password}</p>)}
          </div>
          <div>
            <label htmlFor="avatar" className="sr-only">Avatar URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Upload className="h-5 w-5 text-gray-400" /></div>
              <input id="avatar" name="avatar" type="url" value={formData.avatar} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-colors" placeholder="Avatar URL (optional)"/>
            </div>
          </div>
          {errors.submit && (<div className="bg-[#ff6b6b]/10 border border-[#ff6b6b] text-[#ff6b6b] px-4 py-3 rounded-lg">{errors.submit}</div>)}
          <div>
            <button type="button" onClick={handleSubmit} disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#008080] hover:bg-[#006666] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008080] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isLoading ? (<div className="flex items-center"><div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>Creating Account...</div>) : ('Create Account')}
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Already have an account?{' '}<button onClick={() => navigate('/login')} className="font-medium text-[#008080] hover:text-[#006666] transition-colors bg-transparent border-none cursor-pointer">Sign in here</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;