import server from "./app.js";
import connectDB from "./db/connection.js";

(async () => {
  try {
    await connectDB();
    server.on("error", (err) => console.log(err));
    server.listen(process.env.PORT, () => {
      console.log(`server is listening is port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
