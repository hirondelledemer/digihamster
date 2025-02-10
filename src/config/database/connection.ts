import mongoose from "mongoose";

export async function connect() {
  try {
    const mongoUri =
      process.env.NODE_ENV === "development"
        ? process.env.MONGO_URI_DEV!
        : process.env.MONGO_URI!;
    mongoose.connect(mongoUri);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      // eslint-disable-next-line no-console
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      // eslint-disable-next-line no-console
      console.log("MongoDB connection error" + err);
      process.exit();
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
