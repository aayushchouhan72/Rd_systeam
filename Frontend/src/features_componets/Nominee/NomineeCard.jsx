import { User, Phone, Home, FileText, IdCard, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuthStore } from "../../store/auth.store";
import InfoRow from "../Helper/InfoRow";
function NomineeCard() {
  const [nomineeData, setNomineeData] = useState({});
  const {
    authUser,
    getNomineedata,
    isGetinNomineeData,
    editNominee,
    isEditingNominee,
  } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const selected = isEditing ? "hidden" : "display";

  //  Intial data on render setup
  useEffect(() => {
    const data = async () => {
      try {
        const res = await getNomineedata(authUser?.email);
        setNomineeData(res);
      } catch (error) {
        console.log("Error in the useEffect of nominee card");
      }
    };
    data();
  }, [authUser?.email]);

  // Edit nominee handler
  const handleEditNominee = async (e) => {
    e.preventDefault();
    try {
      const res = await editNominee(nomineeData, authUser.email);
      setNomineeData(res);
      console.log(nomineeData);
    } catch (error) {
      console.log("Error in the edit nominee", error.message);
    }
  };

  //  Handle Edit
  const handleEdit = async () => {
    setIsEditing(true);
  };

  return (
    <>
      {isEditing && (
        <div
          className="w-full flex flex-col justify-between  mx-auto bg-white/10 backdrop-blur-2xl 
      border border-white/20 rounded-3xl p-6 text-white shadow-xl"
        >
          <form
            onSubmit={(e) => handleEditNominee(e)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl"
          >
            {/* NAME */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Nominee Name</label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  type="text"
                  name="name"
                  onChange={(e) => {
                    setNomineeData({ ...nomineeData, name: e.target.value });
                  }}
                  value={nomineeData.name}
                  required
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* CONTACT */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">
                Contact Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  type="tel"
                  onChange={(e) => {
                    setNomineeData({ ...nomineeData, contact: e.target.value });
                  }}
                  value={nomineeData.contact}
                  name="contact"
                  required
                  max={10}
                  placeholder="10-digit mobile number"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400 ml-1">Address</label>
              <div className="relative">
                <Home
                  size={18}
                  className="absolute left-4 top-4 text-blue-500"
                />
                <textarea
                  onChange={(e) => {
                    setNomineeData({
                      ...nomineeData,
                      [e.target.name]: e.target.value,
                    });
                  }}
                  name="address"
                  required
                  placeholder="Full address"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 resize-none"
                />
              </div>
            </div>

            {/* PAN */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">PAN Number</label>
              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  type="text"
                  name="panno"
                  minLength={10}
                  onChange={(e) => {
                    setNomineeData({ ...nomineeData, panno: e.target.value });
                  }}
                  value={nomineeData.panno}
                  required
                  placeholder="ABCDE1234F"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* AADHAR */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">
                Aadhar Number
              </label>
              <div className="relative">
                <IdCard
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  type="text"
                  name="adharno"
                  minLength={12}
                  onChange={(e) => {
                    setNomineeData({ ...nomineeData, adharno: e.target.value });
                  }}
                  value={nomineeData.adharno}
                  required
                  placeholder="12-digit Aadhar"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <div className="md:col-span-2 w-full mt-6 flex flex-col md:flex-row">
              <button
                type="submit"
                className="w-full my-3 md:w-[45%] mx-3 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 group"
              >
                Save Nominee
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                }}
                type="submit"
                className="w-full my-3 md:w-[45%] mx-3 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 group"
              >
                discard
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        className={`${selected} w-full flex flex-col justify-between  mx-auto bg-white/10 backdrop-blur-2xl 
      border border-white/20 rounded-3xl p-6 text-white shadow-xl`}
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
          {/* NAME */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 ml-1">Nominee Name</label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
              />
              <input
                type="text"
                name="name"
                value={nomineeData.name}
                required
                disabled={true}
                placeholder="Full Name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* CONTACT */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 ml-1">Contact Number</label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
              />
              <input
                type="tel"
                value={nomineeData.contact}
                name="contact"
                disabled={true}
                required
                placeholder="10-digit mobile number"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-gray-400 ml-1">Address</label>
            <div className="relative">
              <Home size={18} className="absolute left-4 top-4 text-blue-500" />
              <textarea
                name="address"
                required
                placeholder="Full address"
                disabled={true}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 resize-none"
              />
            </div>
          </div>

          {/* PAN */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 ml-1">PAN Number</label>
            <div className="relative">
              <FileText
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
              />
              <input
                type="text"
                name="panno"
                disabled={true}
                value={nomineeData.panno}
                required
                placeholder="ABCDE1234F"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* AADHAR */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 ml-1">Aadhar Number</label>
            <div className="relative">
              <IdCard
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
              />
              <input
                type="text"
                name="adharno"
                disabled={true}
                value={nomineeData.adharno}
                required
                placeholder="12-digit Aadhar"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2 mt-6">
            <button
              type="button"
              onClick={handleEdit}
              className="w-full my-4 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 group"
            >
              change Nominee
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default NomineeCard;
