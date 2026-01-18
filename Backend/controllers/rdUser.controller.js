import pool from "../config/sql_connetdb.js";
import {
  generateAccountNumber,
  generateRdNumber,
} from "../lib/NumberGenrates.js";
import { rdRegisterUserMail } from "../utils/sendVerificationEmail.js";

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
    // ✅ Safety check
    // if (!req.body) {
    //   return res.status(400).json({
    //     message: "Request body is missing",
    //   });
    // }

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
