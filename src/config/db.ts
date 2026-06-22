import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    // console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:2017/audit_logs');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error}`);
    process.exit(1);
  }
};