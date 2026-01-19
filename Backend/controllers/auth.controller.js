import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import pool from "../config/sql_connetdb.js";
import { isStrongPassword } from "../lib/passwordStrength.js";
import generateToken from "../lib/tokenGenrator.js";
import { sendMail } from "../utils/sendVerificationEmail.js";

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
