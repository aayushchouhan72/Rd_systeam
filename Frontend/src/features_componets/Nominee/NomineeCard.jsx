import { User, Phone, Home, FileText, IdCard, ArrowRight } from "lucide-react";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import Input from "../Helper/Input.jsx";
import Readonly from "../Helper/Readonly";
import Textarea from "../Helper/Textarea";
import AnimatedPage from "../../components/AnimatedPage";

function NomineeCard() {
  const [nomineeData, setNomineeData] = useState({
    name: "",
    contact: "",
    address: "",
    panno: "",
    adharno: "",
  });

  const {
    authUser,
    getNomineedata,
    editNominee,
    isGetinNomineeData,
    isEditingNominee,
  } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);

  //  FETCH DATA
  useEffect(() => {
    if (!authUser?.email) return;

    const fetchNominee = async () => {
      try {
        const res = await getNomineedata(authUser.email);

        setNomineeData({
          name: res?.name || "",
          contact: res?.contact || "",
          address: res?.address || "",
          panno: res?.panno || "",
          adharno: res?.adharno || "",
        });
      } catch (err) {
        console.error("Failed to load nominee");
      }
    };

    fetchNominee();
  }, [authUser?.email]);

  // EDIT SUBMIT
  const handleEditNominee = async (e) => {
    e.preventDefault();

    try {
      const res = await editNominee(nomineeData, authUser.email);

      setNomineeData({
        name: res?.name || "",
        contact: res?.contact || "",
        address: res?.address || "",
        panno: res?.panno || "",
        adharno: res?.adharno || "",
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Edit nominee failed");
    }
  };

  //  INPUT HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;

    setNomineeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //  Intaial loading
  if (isGetinNomineeData || isEditingNominee) {
    return <AnimatedPage />;
  }

  return (
    <>
      {/* ================= EDIT MODE ================= */}
      {isEditing && (
        <div className="w-full mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 text-white shadow-xl">
          <form
            onSubmit={handleEditNominee}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-3xl"
          >
            {/* NAME */}
            <Input
              icon={<User size={18} />}
              label="Nominee Name"
              name="name"
              value={nomineeData.name}
              onChange={handleChange}
            />

            {/* CONTACT */}
            <Input
              icon={<Phone size={18} />}
              label="Contact Number"
              name="contact"
              value={nomineeData.contact}
              onChange={handleChange}
              maxLength={10}
            />

            {/* ADDRESS */}
            <Textarea
              icon={<Home size={18} />}
              label="Address"
              name="address"
              value={nomineeData.address}
              onChange={handleChange}
            />

            {/* PAN */}
            <Input
              icon={<FileText size={18} />}
              label="PAN Number"
              name="panno"
              value={nomineeData.panno}
              onChange={handleChange}
            />

            {/* AADHAR */}
            <Input
              icon={<IdCard size={18} />}
              label="Aadhar Number"
              name="adharno"
              value={nomineeData.adharno}
              onChange={handleChange}
              maxLength={12}
            />

            {/* BUTTONS */}
            <div className="md:col-span-2 flex gap-4 mt-6">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Save Nominee <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-bold"
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW MODE} */}
      {!isEditing && (
        <div className="w-full mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-3xl">
            <Readonly label="Name" value={nomineeData.name} />
            <Readonly label="Contact" value={nomineeData.contact} />
            <Readonly label="Address" value={nomineeData.address} full />
            <Readonly label="PAN" value={nomineeData.panno} />
            <Readonly label="Aadhar" value={nomineeData.adharno} />

            <div className="md:col-span-2 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Change Nominee <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NomineeCard;
