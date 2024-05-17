import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("Connection to db established");
  } catch (error) {
    console.log("Error while connecting to database: ", error);
    process.exit(1);
  }
};

export default connectToDB;
