const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {
  userRegister,
  login,
  logout,
  addLeader,
  deleteLeader,
  fetchTeamLead,
  fetchUser,
  fetchUserById,
  getUserDetails,
  fetchEscalation,
  fetchEvaluation,
  getUserEvaluationAndEscalation,
  agentNameshow,
} = require("./controller/users");
const {
  escalation,
  getFilteredEscalations,
} = require("./controller/escalation");
const { evaluation, EvaluationFromCount } = require("./controller/evaluation");
const { ppc } = require("./controller/ppc");
const { auth } = require("./middleware/auth");
const { notification, getNotification } = require("./controller/notification");
const parser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const socket = require("socket.io");
const http = require("http");
const {
  getCalendarFilterDataEscalation,
  getCalendarFilterDataEvaluation,
} = require("./controller/calendarData");

// https://bicdashboard.vercel.app
// https://qasoftwarebicom.vercel.app/
// http://localhost:3000

const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "https://qasoftwarebicom.vercel.app/",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

require("dotenv").config();
mongoose
  .connect(process.env.mongo_db_url)
  .then(() => {
    console.log("connection successfully");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.json());
app.use(parser());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/register", userRegister);
app.post("/login", login);
app.get("/getallusers", fetchUser);
app.get("/agentnameshow", agentNameshow);
app.get("/logout", auth, logout);
app.post("/createEscalation", upload.single("audio"), auth, escalation);
app.post("/createEvaluation", auth, evaluation);
app.get("/evaluationfromcount/:id", EvaluationFromCount);
app.post("/createteamLeaders", auth, addLeader);
app.post("/createppc", auth, ppc);
app.delete("/leaddelete/:id", auth, deleteLeader);
app.get("/fetchleaders", auth, fetchTeamLead);
app.get("/fetchuserbyid/:id", fetchUserById);
app.post("/getuserdata/:id/:name", auth, getUserDetails);
app.get("/notification", auth, getNotification);
app.get("/fetch-evaluation/:id", auth, fetchEvaluation);
app.get("/fetch-escalation/:id", auth, fetchEscalation);
app.get("/get-data/:id", auth, getUserEvaluationAndEscalation);
app.get("/getfilteredscalations", getFilteredEscalations);
app.get("/getuserdata/:name", auth, getUserDetails);
app.get("/getcalendarfilterdataescalation", getCalendarFilterDataEscalation);
app.get("/getcalendarfilterdataevaluation", getCalendarFilterDataEvaluation);

app.get("/audio/:filename", (req, res) => {
  20;
  const file = path.join(__dirname, "uploads", req.params.filename);
  res.setHeader("Content-Type", "audio/mpeg");
  res.sendFile(file);
});

let roomName = "notification-Room";

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    socket.username = data.username;
    socket.join(roomName);
    io.to(roomName).emit(
      "user-connect",
      data.username + "join the room" + roomName
    );
    // console.log(data.username + 'join the room' + roomName)
  });

  socket.on("sent-notification", async (data) => {
    console.log(`notification sent ${JSON.stringify(data)}`);
    try {
      const userRes = await notification(data);
      io.to(data.userRoom).emit("receive-notification", userRes);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });

  socket.on("start-message", (data) => {
    console.log(data);
  });
});

// app.post('/upload',upload.single('agentaudio'),(req,res)=>{
//     console.log(req.body);
//     console.log(req.file);
// })
app.get("/test", (req, res) => {
  res.status(202).json({ message: "test!" });
});

server.listen(8000, () => {
  console.log("server is running");
});
