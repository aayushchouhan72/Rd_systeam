import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("DataBase is connected ", mongoose.connection.readyState);
  } catch (error) {
    throw new error();
    console.log("Error in connection DB", error.message);
  }
};
