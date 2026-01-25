import pool from "../config/sql_connetdb.js";
import {
  generateAccountNumber,
  generateRdNumber,
} from "../lib/NumberGenrates.js";
import {
  rdRegisterUserMail,
  sendNomineeAddedEmail,
  sendRdStartedEmail,
} from "../utils/sendVerificationEmail.js";

//  Register user for RD
export const registerUser = async (req, res) => {
  try {
    const { fullname, adharno, photourl, dob, panno, occupation, email } =
      req.body;

    // ✅ Validation
    if (!fullname || !adharno || !dob || !panno || !occupation || !email) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    // TODO  add funnality for photo url

    // ✅ Check existing user
    const exist = await pool.query("SELECT 1 FROM rdusers WHERE adharno = $1", [
      adharno,
    ]);

    if (exist.rowCount > 0) {
      return res.status(400).json({
        message: "User already registered",
      });
    }

    // ✅ Generate account number
    const rdAccountNumber = await generateAccountNumber();

    // ✅ Insert user
    const result = await pool.query(
      `INSERT INTO rdusers
       (fullname, adharno,photourl, dob, panno, account_number, occupation,email)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, account_number`,
      [
        fullname,
        adharno,
        photourl || null,
        dob,
        panno,
        rdAccountNumber,
        occupation,
        email,
      ],
    );
    rdRegisterUserMail(fullname, rdAccountNumber, email);
    return res.status(201).json({
      message: "User registered for RD successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error in Register User for RD controller:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//  Add nominee
export const addNomine = async (req, res) => {
  try {
    const { name, address, panno, adharno, contact } = req.body;
    const { account_number } = req.params;

    // validation
    if (!name || !address || !panno || !adharno || !contact) {
      return res.status(400).json({
        message: "All nominee fields are required",
      });
    }

    // check user
    const user = await pool.query(
      "SELECT id FROM rdusers WHERE account_number = $1",
      [account_number],
    );

    if (user.rowCount === 0) {
      return res.status(400).json({
        message: "Invalid account number",
      });
    }

    // insert nominee
    const nominee = await pool.query(
      `INSERT INTO nominee (name, address, panno, adharno, contact)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id`,
      [name, address, panno, adharno, contact],
    );

    // update user
    await pool.query(
      `UPDATE rdusers
       SET nominee_id = $1
       WHERE account_number = $2`,
      [nominee.rows[0].id, account_number],
    );

    // Send Email Notification
    try {
      const userQuery = await pool.query(
        "SELECT fullname, email FROM rdusers WHERE account_number = $1",
        [account_number],
      );
      if (userQuery.rows.length > 0) {
        const { fullname, email } = userQuery.rows[0];
        sendNomineeAddedEmail(email, fullname, name, account_number);
      }
    } catch (emailErr) {
      console.error("Failed to send nominee email:", emailErr);
    }

    // ✅ ONE response only
    return res.status(201).json({
      message: "Nominee added successfully",
      user: nominee.rows[0],
    });
  } catch (error) {
    console.error("Error in the addNomine controller", error);

    // ⚠️ safety check (important)
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
};

// Start Rd
export const startRd = async (req, res) => {
  try {
    //  Get Account number form params
    const { account_number } = req.params;
    const {
      rd_total_amount,
      rd_start_date,
      monthly_installment_day,
      duration_months,
    } = req.body;

    //  Check all field Shouldbe feild

    if (
      !rd_total_amount ||
      !rd_start_date ||
      !monthly_installment_day ||
      !duration_months
    ) {
      return res.status(400).json({ message: "All field should be required" });
    }
    //  Genrate RD number for the rd
    //   Check user have howmany rd right now

    let count = await pool.query(
      "SELECT COUNT(*) AS rd_count FROM rd_accounts WHERE account_number = $1",
      [account_number],
    );

    const newcount = parseInt(count.rows[0].rd_count);

    //  Call function for rd number
    const rd_number = generateRdNumber(account_number, newcount);

    //  Now calculate mounthly installments
    if (duration_months === 0) {
      return res
        .status(400)
        .json({ message: "Duration for Rd should not zero" });
    }
    let installment_amount = rd_total_amount / duration_months;

    //  Now we get id from the for db
    count = await pool.query(
      "select id from rdusers where  account_number = $1",
      [account_number],
    );
    const rduser_id = parseInt(count.rows[0].id);
    // Insert into DB
    const saveToDb = await pool.query(
      "Insert into rd_accounts (rd_total_amount,rd_start_date,monthly_installment_day,duration_months,rd_number,installment_amount,account_number ) values ($1,$2,$3,$4,$5,$6,$7) RETURNING * ",
      [
        rd_total_amount,
        rd_start_date,
        monthly_installment_day,
        duration_months,
        rd_number,
        installment_amount,
        account_number,
      ],
    );
    //  Check data is Inserted or not in db
    if (!(saveToDb.rowCount > 0)) {
      return res.status(500).json("Probleam in backend to insert data in db");
    }

    // Send Email Notification
    try {
      const userQuery = await pool.query(
        "SELECT fullname, email FROM rdusers WHERE account_number = $1",
        [account_number],
      );
      if (userQuery.rows.length > 0) {
        const { fullname, email } = userQuery.rows[0];
        sendRdStartedEmail(
          email,
          fullname,
          rd_number,
          rd_total_amount,
          installment_amount,
          duration_months,
          account_number,
        );
      }
    } catch (emailErr) {
      console.error("Failed to send RD start email:", emailErr);
    }

    //  final Respone whene all things are fine

    return res.status(200).json({
      message: "user is register sucesfully rd ",
      user: saveToDb.rows[0],
    });
  } catch (error) {
    console.log("Error in start rd controller ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Check uses
export const checkUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // 🔍 Check user in DB
    const result = await pool.query(
      "SELECT account_number FROM rdusers WHERE email = $1",
      [email],
    );

    if (result.rowCount === 0) {
      return res.status(200).json({
        isRegistered: false,
      });
    }

    // ✅ USER REGISTERED
    const { account_number } = result.rows[0];

    return res.status(200).json({
      isRegistered: true,
      accountNumber: account_number,
    });
  } catch (error) {
    console.error("Error in the checkUser", error.message);

    // ⚠️ important: only ONE response
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// check Nominee
export const checkNominee = async (req, res) => {
  const { accountNumber } = req.params;

  //   Check account number or not
  if (!accountNumber) {
    return res.status(400).json({ message: "Invalid user" });
  }

  //  Find user with account number

  const user = await pool.query(
    "select nominee_id from rdusers where account_number=$1",
    [accountNumber],
  );

  //  Check out put
  if (!(user.rowCount > 0)) {
    return res
      .status(400)
      .json({ message: "User is not exist with given params" });
  }

  //  Final respone
  return res
    .status(200)
    .json({ message: "User added nominee", user: user.rows[0] });
};

// RD Information
export const rdInfromation = async (req, res) => {
  try {
    const { account_number } = req.params;

    //   Check account number is present or not
    if (!account_number) {
      return res.status(400).json({ message: "User is invalid" });
    }

    //  Check in DB
    const result = await pool.query(
      "select * from rd_accounts where account_number = $1 ",
      [account_number],
    );

    //  Check result
    if (result.rowCount === 0) {
      return res.status(200).json({ message: "User not started rd till now" });
    }

    //  Now we give final respones to the user
    return res
      .status(200)
      .json({ message: "User information for Rd ", data: result.rows });
  } catch (error) {
    console.log("Error in the  RdInformation controller ", error.message);
    res.status(500).json({ message: "Internal server error is occured" });
  }
};

export const closeRdAccount = async (req, res) => {
  try {
    const { account_number } = req.params;

    if (!account_number) {
      return res.status(400).json({ message: "Invalid user" });
    }

    // Get RD details
    const rdQuery = await pool.query(
      "SELECT * FROM rd_accounts WHERE account_number = $1",
      [account_number],
    );

    if (rdQuery.rows.length === 0) {
      return res.status(404).json({ message: "No RD account found" });
    }

    const rd = rdQuery.rows[0];
    const {
      rd_total_amount,
      paid_till_amount,
      duration_months,
      installment_amount,
    } = rd;

    // Check completion status
    const expectedTotal = parseFloat(rd_total_amount);
    const paidAmount = parseFloat(paid_till_amount || 0);

    let refundAmount = 0;
    let message = "";

    // Assuming completion if paid amount is close to total (or logic based on duration)
    // Here logic: if paid < expectedTotal, it is premature closure.
    if (paidAmount < expectedTotal) {
      // 50% refund logic
      refundAmount = paidAmount * 0.5;
      message = "Premature Closure: 50% of paid amount refunded.";
    } else {
      // Maturity logic: Original + 14%
      refundAmount = expectedTotal + expectedTotal * 0.14;
      message = "Maturity Reached: Total Amount + 14% Interest refunded.";
    }

    return res.status(200).json({
      message: "RD Closure Calculation",
      closureDetails: {
        account_number,
        status: paidAmount < expectedTotal ? "Premature" : "Mature",
        total_paid: paidAmount,
        refund_amount: refundAmount,
        note: message,
      },
    });
  } catch (error) {
    console.log("Error in closeRdAccount:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const payBackstatus = async (req, res) => {
  try {
    const { account_number } = req.params;

    //  Check account number
    if (!account_number) {
      return res.status(400).json({ message: "Invalid request from User" });
    }

    // find user rd
    const result = await pool.query(
      "SELECT * FROM rd_accounts WHERE account_number= $1",
      [account_number],
    );

    //   Check result from db
    if (!result.rows) {
      return res.status(500).json({ message: "Something broken internally" });
    }

    //  final response to users
    return res
      .status(200)
      .json({ message: "Users data is this ..", data: result.rows });
  } catch (error) {
    console.log("Error in the payBack controller", error.message);
    return res.status(500).json({ message: "Somethings wents wrongs" });
  }
};
