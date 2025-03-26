import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const kmaLogoUrl = "https://navigates.vn/wp-content/uploads/2023/06/logo-hoc-vien-ky-thuat-mat-ma.jpg"; // DIRECT IMAGE LINK

  if (!authUser) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-3 mb-6 items-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl text-center">
          Profile
        </h2>
        <p className="text-center text-gray-600">
          HOC VIEN KY THUAT MAT MA - KMA
          <br />
          Academy of Cryptography Techniques (ACT)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <User className="w-4 h-4" />
            Họ và tên
          </div>
          <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{authUser.userName}</p>
        </div>

        <div className="space-y-1.5">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <User className="w-4 h-4" />
            Identification
          </div>
          <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{authUser.Identification}</p>
        </div>

        <div className="space-y-1.5">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <User className="w-4 h-4" />
            Chức vụ (Position)
          </div>
          <p className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">{authUser.position}</p>
        </div>
      </div>

      <div className="flex justify-center mt-8">
      <img src={kmaLogoUrl} alt="KMA Logo" className="max-h-full max-w-full" />      
      </div>

    </div>
  );
};

export default ProfilePage;