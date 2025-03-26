
import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff, Lock, Mail, Notebook, Phone, User, UserCircle } from "lucide-react";
import Navbar from "../Navbar";

const SignUpPage = () => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    Identification: "",
    userName: "",
    password: "",
    position: "",
    lop: "",
    SDT: "",
    email: "",
  });
  const { signUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const userData = await signUp(formData);

      if (userData) {
        console.log("SignUp account: ", userData);
        setFormData({
          Identification: "",
          userName: "",
          password: "",
          position: "",
          lop: "",
          SDT: "",
          email: "",
        });
      }
    } catch (error) {
      console.error("Error on Submmit SingUpForm :", error)
    }
  };

  return (
    <div>
        <Navbar/>
        <div className="grid place-items-center bg-gray-400 " style={{ paddingTop: '50px' }}>
            <div className="w-full max-w-md justify-center items-center p-8 sm:p-12 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">Đăng ký tài khoản</h1>
                <p className="text-center">Vui lòng nhập đầy đủ thông tin để tạo tài khoản sinh viên </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                        <span className="label-text font-medium">Identification - Ma sinh vien</span>
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="size-5 text-base-content/45" />
                        </div>
                        <input
                            type="text"
                            className="input input-bordered w-full pl-10"
                            placeholder="Nhap ma sinh vien..."
                            value={formData.Identification}
                            onChange={(e) => setFormData({ ...formData, Identification: e.target.value })}
                            required
                        />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                        <span className="label-text font-medium">Ho va ten</span>
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="size-5 text-base-content/45" />
                        </div>
                        <input
                            type="text"
                            className="input input-bordered w-full pl-10"
                            placeholder="Nhap ho va ten... "
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            required
                        />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                        <span className="label-text font-medium">Password</span>
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="size-5 text-base-content/45" />
                        </div>
                        <input
                            type={showPass ? "text" : "password"}
                            className="input input-bordered w-full pl-10"
                            placeholder="******"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPass(!showPass)}
                        >
                            {showPass ? (
                            <EyeOff className="size-5 text-base-content/45" />
                            ) : (
                            <Eye className="size-5 text-base-content/45" />
                            )}
                        </button>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                        <span className="label-text font-medium">Lop</span>
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Notebook className="size-5 text-base-content/45" />
                        </div>
                        <input
                            type="text"
                            className="input input-bordered w-full pl-10"
                            placeholder="Nhap lop..."
                            value={formData.lop}
                            onChange={(e) => setFormData({ ...formData, lop: e.target.value })}
                            required
                        />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                        <span className="label-text font-medium">So dien thoai</span>
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="size-5 text-base-content/45" />
                        </div>
                        <input
                            type="tel"
                            className="input input-bordered w-full pl-10"
                            placeholder="Nhap so dien thoai..."
                            value={formData.SDT}
                            onChange={(e) => setFormData({ ...formData, SDT: e.target.value })}
                            required
                        />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                        <span className="label-text font-medium">Email</span>
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="size-5 text-base-content/45" />
                        </div>
                        <input
                            type="Email-edu"
                            className="input input-bordered w-full pl-10"
                            placeholder="Email..."
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                        <span className="label-text font-medium">Chuc vu</span>
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserCircle className="size-5 text-base-content/45" />
                        </div>
                        <select
                            className="select select-bordered w-full pl-10"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            required
                        >
                            <option value="" disabled>
                            Chọn chức vụ
                            </option>
                            <option value="Student">Sinh vien - Student</option>

                        </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    </div>
    
  );
};

export default SignUpPage;