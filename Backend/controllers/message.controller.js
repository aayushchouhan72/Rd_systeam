import Message from "../model/chat.models.js";
import pool from "../config/sql_connetdb.js";

export const getMessage = async (req, res) => {
  try {
    const { userEmail } = req.params;
    //    Check email is exist or not
    if (!userEmail) {
      return res.status(400).json({ Message: "Somthing went wrong" });
    }

    //    Check valid email

    const user = await pool.query("select email from users where email=$1", [
      userEmail,
    ]);

    if (user.rowCount === 0) {
      return res.status(400).json({ Message: "Invalid User" });
    }

    // now find get all messages

    const messages = await Message.find().sort({ createdAt: 1 });
    return res
      .status(200)
      .json({ Message: "Data is this ", messages: messages });
  } catch (error) {
    console.log("Error get message controller", error.message);
    res.status(500).json({ Message: "Internal server error is occured" });
  }
};
