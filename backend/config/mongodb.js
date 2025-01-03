import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      mongoose.connection.on("connected", () => console.log("Database Connected"));
      mongoose.connection.on("error", (err) => console.error("Database Connection Error:", err));
    }

    await mongoose.connect(process.env.MONGODB_URI);

    if (process.env.NODE_ENV !== 'test') {
      console.log("MongoDB connection established successfully.");
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'test') {
      throw error; // In test environment, throw the error instead of exiting
    } else {
      console.error("Error connecting to MongoDB:", error.message);
      process.exit(1);
    }
  }
};

export default connectDB;