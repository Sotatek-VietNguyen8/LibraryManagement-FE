import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Lock, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [showPassW, setShowPassW] = useState(false);
    const [formData, setFormData] = useState({
        Identification: '',
        password: '',
    });

    const navigate = useNavigate();
    const { login, isLogin, position } = useAuthStore(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = await login(formData);

        if (userData) {
             if (userData.position === 'Student') {
                 navigate('/');
             } else if (userData.position === 'Administator') {
                 navigate('/admin');
             } else {
                 console.error('Vai trò người dùng không xác định.');
             }
        } else {
            console.error('Đăng nhập thất bại.');
        }
    };

    return (
      <div className="grid place-items-center h-screen">
            <div className='w-full max-w-md justify-center items-center p-6 sm:p-12'>
              <form onSubmit={handleSubmit} className='space-y-6'>
      
                <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Identification</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="size-5 text-base-content/40" />
                      </div>
                      <input
                        type="text"
                        className={`input input-bordered w-full pl-10`}
                        placeholder=" "
                        value={formData.Identification}
                        onChange={(e) => setFormData({ ...formData, Identification: e.target.value })}
                      />
                    </div>
                </div>
      
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassW ? "text":"password"}
                      className={`input input-bordered w-full pl-10`}
                      placeholder="******"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={()=>setShowPassW(!showPassW)}
                    >
                      {showPassW ? (
                        <EyeOff className='size-5 text-base-content/40'/>
                      ) :(
                        <Eye className='size-5 text-base-content/40'/>
                      )}
                    </button>
                  </div>
                </div>
      
                <button type='submit' className='btn btn-primary w-full ' disabled={isLogin}>
                  {isLogin ? (
                    <>
                      <Loader2 className='size-5 animate-spin'/>
                      Loadding...
                    </>
                  ) : (
                    "Log In"
                  )}
                </button>
      
              </form>
            </div>
          </div>
    );
};

export default LoginPage;