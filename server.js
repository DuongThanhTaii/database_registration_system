const express = require("express");
const cors = require("cors");
const app = express();
const systemRoutes = require("./routes/systemRoutes");
const classRoutes = require("./routes/classRoutes");
const lecturerRoutes = require("./routes/lecturerRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const surveyRoutes = require("./routes/surveyRoutes");

// Use routes
app.use("/api/surveys", surveyRoutes);

//System
app.use("/api/system", systemRoutes);

//Lớp học phần
app.use("/api/classes", classRoutes);

//Giảng viên
app.use("/api/lecturers", lecturerRoutes);

//Sinh viên đăng ký
app.use("/api/registration", registrationRoutes);

//Admin report
app.use("/api/admin", adminRoutes);

//Thời khóa biểu
app.use("/api/timetable", timetableRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy trên port ${PORT}`);
});
