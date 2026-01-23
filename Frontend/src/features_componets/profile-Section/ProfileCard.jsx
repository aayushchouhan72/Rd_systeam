import { useEffect, useState } from "react";
import { Camera, Mail, User, Phone, BadgeCheck, X, Save } from "lucide-react";

import AnimatedPage from "../../components/AnimatedPage";
import { useAuthStore } from "../../store/auth.store";

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  const { authUser, getProfiledata, isGetingProfileData } = useAuthStore();

  useEffect(() => {
    if (!authUser?.email) return;

    const getdata = async () => {
      const res = await getProfiledata(authUser.email);
      setUserData(res);
    };

    getdata();
  }, [authUser]);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name,
        phone: userData.phone,
      });
    }
  }, [userData]);

  if (isGetingProfileData || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <AnimatedPage />
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated data:", formData);
    setIsEditing(false);
  };

  return (
    <div
      className="w-full max-w-sm mx-auto 
      bg-white/10 backdrop-blur-2xl 
      border border-white/20 
      rounded-3xl p-6 text-white shadow-xl"
    >
      {/* Profile Image */}
      <div className="relative w-28 h-28 mx-auto">
        <img
          src={
            userData?.profileurl ||
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
          }
          alt="profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-white/20"
        />

        <div
          className={`absolute bottom-1 right-1 p-2 rounded-full transition
          ${isEditing ? "bg-blue-500 cursor-pointer" : "bg-gray-500 opacity-50 pointer-events-none"}`}
        >
          <Camera className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Name + Verified */}
      <div className="mt-4 text-center">
        {isEditing ? (
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-center w-full"
          />
        ) : (
          <h2 className="text-xl font-semibold">{userData.name}</h2>
        )}

        {userData?.is_verified && (
          <div
            className="mt-2 inline-flex items-center gap-1 text-xs px-3 py-1 
          bg-green-500/20 text-green-300 rounded-full"
          >
            <BadgeCheck className="w-4 h-4" />
            Verified
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 space-y-4 text-sm">
        <InfoRow icon={<Mail />} value={userData?.email} />

        <InfoRow icon={<User />} value="Investor" />

        <InfoRow
          icon={<User />}
          value={`Account No: ${userData?.account_number}`}
        />

        {isEditing ? (
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2"
          />
        ) : (
          <InfoRow icon={<Phone />} value={userData?.phone} />
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl 
              bg-green-500 hover:bg-green-600 transition"
            >
              <Save className="w-4 h-4" />
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl 
              bg-red-500 hover:bg-red-600 transition"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-2.5 rounded-xl 
            bg-blue-500 hover:bg-blue-600 transition font-medium"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

/* Reusable Info Row */
const InfoRow = ({ icon, value }) => (
  <div
    className="flex items-center gap-3 px-4 py-2 
    bg-white/5 rounded-xl border border-white/10"
  >
    <span className="text-gray-300 w-4 h-4">{icon}</span>
    <span className="text-gray-200 truncate">{value}</span>
  </div>
);

export default ProfileCard;
