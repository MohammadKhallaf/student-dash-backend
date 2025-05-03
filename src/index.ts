import app from "./app/app";
import { mongoUrl, port } from "./config";
import { connectMongoDB } from "./db/dbConnect";

if (process.env.VERCEL !== "1") {
  (async () => {
    try {
      if (mongoUrl) {
        console.log("Database is connecting...");
        await connectMongoDB(mongoUrl);
        app.listen(port, () => {
          console.log(`Server is running at ${port}`);
        });
      } else {
        console.error("MongoDB URL is not defined.");
      }
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      process.exit(1);
    }
  })();
}

export default app;
