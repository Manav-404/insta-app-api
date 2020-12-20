require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/Auth");
const profileRoutes = require("./routes/Profile");
const postsRoutes = require("./routes/Post");
const notificationRoutes = require("./routes/Notification");

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch(() => console.log("ERROR DB CONNECTION"));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", postsRoutes);
app.use("/api", notificationRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App is running on ${port}..`);
});
