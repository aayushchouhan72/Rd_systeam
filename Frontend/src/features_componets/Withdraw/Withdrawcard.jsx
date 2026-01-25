import { useEffect, useState } from "react";
import { useUserStore } from "../../store/register.store";

const Withdrawcard = () => {
  const [withDrawData, setWithDrawData] = useState([]);
  const { getwithDrawData, userAccountNumber } = useUserStore();

  useEffect(() => {
    if (!userAccountNumber) return;

    const fetchData = async () => {
      const res = await getwithDrawData(userAccountNumber);
      setWithDrawData(res || []);
    };

    fetchData();
  }, [userAccountNumber]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatAmount = (amount) => Number(amount).toLocaleString("en-IN");

  // 🔥 Button Handler
  const handleWithdraw = (rd) => {
    if (rd.is_completed) {
      console.log("Normal Withdraw:", rd.rd_number);
      // 👉 navigate("/withdraw/" + rd.rd_number)
    } else {
      console.log("Force Withdraw Applied:", rd.rd_number);
      // 👉 open confirmation modal
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Your RD Accounts
      </h2>

      {withDrawData.length === 0 ? (
        <div className="text-center text-gray-300 py-10">
          No RD data available
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {withDrawData.map((rd) => (
            <div
              key={rd.id}
              className="relative rounded-3xl p-6 
                         bg-white/10 backdrop-blur-xl
                         border border-white/20
                         shadow-xl"
            >
              {/* Status Badge */}
              <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium
                ${
                  rd.is_completed
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {rd.is_completed ? "Completed" : "Running"}
              </span>

              {/* Info */}
              <div className="space-y-2 text-white">
                <p className="text-sm text-gray-300">RD Number</p>
                <p className="text-lg font-semibold">{rd.rd_number}</p>

                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-gray-300">Total Amount</p>
                    <p className="font-semibold">
                      ₹ {formatAmount(rd.rd_total_amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-300">Paid Till</p>
                    <p className="font-semibold">
                      ₹ {formatAmount(rd.paid_till_amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-300">Installment</p>
                    <p className="font-semibold">
                      ₹ {formatAmount(rd.installment_amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-300">Duration</p>
                    <p className="font-semibold">{rd.duration_months} Months</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 text-sm">
                  <p className="text-gray-300">Start Date</p>
                  <p className="font-medium">{formatDate(rd.rd_start_date)}</p>
                </div>

                {/* 🔘 Action Button */}
                <button
                  onClick={() => handleWithdraw(rd)}
                  className={`w-full mt-5 py-3 rounded-xl font-semibold transition-all
                    ${
                      rd.is_completed
                        ? "bg-green-500/90 hover:bg-green-500 text-white"
                        : "bg-orange-500/90 hover:bg-orange-500 text-white"
                    }`}
                >
                  {rd.is_completed
                    ? "Withdraw Amount"
                    : "Apply for Force Withdraw"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Withdrawcard;
