import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import pool from "../config/sql_connetdb.js";
import { isStrongPassword } from "../lib/passwordStrength.js";
import generateToken from "../lib/tokenGenrator.js";
import { sendMail } from "../utils/sendVerificationEmail.js";
import cloudinary from "../config/Cloudinary.js";
import { runInContext } from "vm";

//  Login Logic
export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // ✅ email OR phone + password
    if ((!email && !phone) || !password) {
      return res.status(400).json({
        message: "Email or phone and password required",
      });
    }

    const result = await pool.query(
      "SELECT name, phone, email, password FROM users WHERE phone=$1 OR email=$2",
      [phone || null, email || null],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    return generateToken(user, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

//  Signup
export const signup = async (req, res) => {
  try {
    const { name, password, email, phone } = req.body;

    //   Check all fileds are not empty
    if (!name || !password || !email || !phone) {
      return res.status(400).json({
        message: "ALL fileds are to required",
      });
    }

    //  Check password Lenght
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password lenght should be geater then 8 and less than 15",
      });
    }

    //  Check Password strength

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 1 uppercase, 1 lowercase, 1 digit, 1 symbol and minimum 8 characters",
      });
    }

    // Check user exist email or not
    const checkEmail = await pool.query(
      "SELECT email from users where email=$1",
      [email],
    );

    if (checkEmail.rows.length > 0) {
      return res.status(400).json({
        message: "All ready user Exist with this Give email",
      });
    }

    // Check user Phone email or not
    const checkPhone = await pool.query(
      "SELECT email from users where phone=$1",
      [phone],
    );
    if (checkPhone.rows.length > 0) {
      return res.status(400).json({
        message: "All ready user Exist with this Give Phone number",
      });
    }

    //  Hassed password
    const salt = await bcrypt.genSalt(10);
    const hassedPassword = await bcrypt.hash(password, salt);

    //  Email verification token
    const emailVerficationToken = crypto.randomBytes(32).toString("hex");

    //now save to db
    const response = await pool.query(
      "INSERT INTO users(name,password,phone,email,email_token) VALUES ($1,$2,$3,$4,$5) RETURNING name,password,phone,email,email_token",
      [name, hassedPassword, phone, email, emailVerficationToken],
    );

    //  SET COOKIES
    generateToken(response.rows[0], res);

    //  Email verification from here
    const link = `${process.env.BASE_URL}/api/auth/verify/${emailVerficationToken}`;
    await sendMail(link, email);

    //  Get data with out password
    const userResult = await pool.query(
      "SELECT name, email, phone FROM users WHERE email = $1",
      [response.rows[0].email],
    );
    //  SEND SUCCESS RESPONSE TO USER
    return res.status(201).json({
      message: "Signup Succesfully",
      data: userResult.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

//  Logout
export const logout = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: true, // true in production (https)
        sameSite: "strict",
      })
      .status(200)
      .json({
        message: "Logged out sucessfully",
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

//  Check is authenticated or not
export const check = async (req, res) => {
  try {
    const token = req.cookies.tok;

    //  check token is present or not
    if (!token) {
      res.status(400).json({
        message: "you are not looged in",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const findUser = await pool.query(
      "SELECT name,phone,email FROM users where email=$1",
      [decode.email],
    );
    // console.log(findUser);
    res.status(200).json({ data: findUser.rows[0], message: "User has token" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error.message);
  }
};

//  Email verify
export const verifyEmail = async (req, res) => {
  try {
    //  Get token from params
    const { token } = req.params;

    //  now get token  search token in db
    const result = await pool.query(
      `
         UPDATE users
         SET is_verified = true,
         email_token = NULL
         WHERE email_token = $1
         RETURNING email, is_verified
        `,
      [token],
    );

    if (result.rows.length === 0) {
      return res.status(400).send("Invalid or expired token");
    }
    res.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(
      "Internal server error in verify mail contoller",
      error.message,
    );
  }
};

//  Get Profile data form backend
export const profileData = async (req, res) => {
  try {
    const { email } = req.params;

    //   Check user email
    if (!email) {
      return res.status(400).json({ message: "Invalid User" });
    }

    //  Search in data Base
    const response = await pool.query(
      "SELECT u.name, u.phone, u.email, u.is_verified, u.profileurl, r.account_number FROM users u LEFT JOIN rdusers r ON u.email = r.email WHERE u.email = $1",
      [email],
    );

    if (!response.rows[0]) {
      return res.status(400).json({ message: "Invalid user" });
    }

    //  Final respone
    return res
      .status(200)
      .json({ user: response.rows[0], message: "User data is this" });
  } catch (error) {
    console.log("Error in the profiledata controller", error.message);
    return res.status(500).json({ message: "Something Wents Wrong" });
  }
};

//  Edit profileap
export const updateprofileData = async (req, res) => {
  try {
    const dataArr = req.body;
    const { email } = req.params;

    if (!Array.isArray(dataArr)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const name = dataArr?.[0]?.[1];
    const phone = dataArr?.[1]?.[1];
    const imageBase64 = dataArr?.[2]?.[1];

    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64);

      await pool.query(
        "UPDATE users SET profileurl=$1, name=$2, phone=$3 WHERE email=$4",
        [uploadResponse.secure_url, name, phone, email],
      );

      return res.status(200).json({ message: "Profile updated successfully" });
    }

    const result = await pool.query(
      "SELECT name, phone FROM users WHERE email=$1",
      [email],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    if (result.rows[0].name !== name) {
      await pool.query("UPDATE users SET name=$1 WHERE email=$2", [
        name,
        email,
      ]);
    }

    if (result.rows[0].phone !== phone) {
      await pool.query("UPDATE users SET phone=$1 WHERE email=$2", [
        phone,
        email,
      ]);
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log("error in update profile controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//  Get nominee data
export const getNomineeData = async (req, res) => {
  try {
    const { account_number } = req.user;

    if (!account_number) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const result = await pool.query(
      `
      SELECT 
        rd.account_number,
        no.name,
        no.adharno,
        no.panno,
        no.address,
        no.contact
      FROM rdusers rd
      LEFT JOIN nominee no ON no.id = rd.nominee_id
      WHERE rd.account_number = $1
      `,
      [account_number],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).json({
      data: result.rows[0], // may contain nulls
      message: "Nominee data fetched successfully",
    });
  } catch (error) {
    console.error("Error in getNomineeData:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//  Edit Nominee
export const editNomineeData = async (req, res) => {
  try {
    const { name, contact, panno, adharno, address } = req.body;
    const { email } = req.params;
    if (!name || !contact || !panno || !adharno || !address) {
      return res.status(400).json("Invalid Request from user");
    }

    //  update user in the db
    const result = await pool.query(
      "UPDATE nominee n SET name=$1, contact=$2, address=$3, panno=$4, adharno=$5 FROM rdusers r WHERE r.nominee_id=n.id AND r.email=$6 RETURNING n.*",
      [name, contact, panno, adharno, address, email],
    );

    //  Check result
    if (result.rows[0] > 0) {
      return res.status(400).json({ message: "probleam in db" });
    }

    //  final response to the user
    return res
      .status(200)
      .json({ message: "changes done", data: result.rows[0] });
  } catch (error) {
    console.log("Error in update nominee controller", error.message);
    return res.status(500).json({ message: "Somthing went wrong" });
  }
};
