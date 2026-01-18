import { createOrderApi, verifyPaymentApi } from "../../api/payment.api";
import { loadRazorpay } from "../../utils/loadRazorpay";

const PayButton = ({ amount, rdPaymentId }) => {
  const handlePayment = async () => {
    try {
      // Load Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      // Create order
      const { data: order } = await createOrderApi({
        amount, // rupees
        rdPaymentId,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "RD System Bank",
        description: "RD Installment Payment",
        order_id: order.id,

        handler: async (response) => {
          const verifyRes = await verifyPaymentApi({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert(verifyRes.data.message);
        },

        prefill: {
          name: "Aayush Chouhan",
          email: "aayush@gmail.com",
          contact: "9999999999",
        },

        theme: {
          color: "#0f766e",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed, please try again");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      Pay ₹{amount}
    </button>
  );
};

export default PayButton;
