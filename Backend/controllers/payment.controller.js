import crypto from "crypto";
import pool from "../config/sql_connetdb.js";
import { sendPaymentSuccessEmail } from "../utils/sendVerificationEmail.js";

import razorpay from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const { amount, rdPaymentId } = req.body;

    // Check for late fee
    let finalAmount = parseFloat(amount);
    
    // Fetch RD details to check due date
    const rdQuery = await pool.query(
      "SELECT monthly_installment_day FROM rd_accounts WHERE id = $1",
      [rdPaymentId]
    );

    if (rdQuery.rows.length > 0) {
      const dueDay = rdQuery.rows[0].monthly_installment_day;
      const today = new Date().getDate();

      // Simple logic: if today > dueDay, charge fine. 
      // User requested "fine add karo". Fixed fine 50rs.
      if (today > dueDay) {
        // Checking if already paid for this month would be ideal but complex here 
        // without more schema info, assuming user clicks Pay only when due.
        finalAmount += 50; 
      }
    }

    //  Create order
    const order = await razorpay.orders.create({
      amount: finalAmount * 100, // razorpay expects paise
      currency: "INR",
      receipt: `rd_${rdPaymentId}`,
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "OrderCreation failed" });
    console.log("Internal server Error in the:- ", error.message);
  }
};

export const verifypayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.PAYMENT_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // ✅ Payment verified
    // Fetch order details to get correct amount and receipt info
    let order;
    try {
      order = await razorpay.orders.fetch(razorpay_order_id);
    } catch (err) {
      console.error("Error fetching order from Razorpay:", err);
      return res.status(500).json({ message: "Failed to fetch order details" });
    }

    const amountPaid = order.amount / 100; // Convert items back to main currency unit
    const rdId = order.receipt.split("_")[1];

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Ensure transaction table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS rd_payments (
          id SERIAL PRIMARY KEY,
          account_number VARCHAR(255),
          amount DECIMAL(10,2),
          payment_id VARCHAR(255),
          order_id VARCHAR(255),
          payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50)
        )
      `);

      // 2. Update RD Account Passbook (paid_till_amount)
      const updateRes = await client.query(
        `UPDATE rd_accounts 
         SET paid_till_amount = COALESCE(paid_till_amount, 0) + $1 
         WHERE id = $2 
         RETURNING account_number, paid_till_amount`,
        [amountPaid, rdId]
      );

      if (updateRes.rowCount === 0) {
        throw new Error("RD Account not found");
      }

      const { account_number } = updateRes.rows[0];

      // 3. Record Payment
      await client.query(
        `INSERT INTO rd_payments 
         (account_number, amount, payment_id, order_id, status)
         VALUES ($1, $2, $3, $4, 'success')`,
        [account_number, amountPaid, razorpay_payment_id, razorpay_order_id]
      );

      await client.query("COMMIT");

      // Send Email Notification (Async, don't block response)
      try {
        const userQuery = await pool.query(
          "SELECT fullname, email FROM rdusers WHERE account_number = $1",
          [account_number]
        );
        if (userQuery.rows.length > 0) {
          const { fullname, email } = userQuery.rows[0];
          sendPaymentSuccessEmail(
            email,
            fullname,
            amountPaid,
            new Date().toDateString(),
            account_number
          );
        }
      } catch (emailErr) {
        console.error("Failed to send payment email:", emailErr);
      }

      res.status(200).json({
        message: "Payment verified and updated successfully",
        success: true,
      });
    } catch (transactionError) {
      await client.query("ROLLBACK");
      console.error("Transaction failed:", transactionError);
      res.status(500).json({ message: "Database transaction failed" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.log("Internal server error in Verifypayment ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
