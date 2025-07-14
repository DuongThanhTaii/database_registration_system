const RegistrationModel = require("../models/registrationModel");

const registerCourse = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    const result = await RegistrationModel.register(studentId, classId);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: "Không thể đăng ký lớp học phần",
      error: err.message,
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const history = await RegistrationModel.getHistory(studentId);
    res.json({ studentId, history });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không thể lấy lịch sử", error: err.message });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const { studentId, classId } = req.body;
    const result = await RegistrationModel.cancelRegistration(
      studentId,
      classId
    );
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Không thể hủy đăng ký", error: err.message });
  }
};

const getTuition = async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await RegistrationModel.calculateTuition(studentId);
    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không thể tính học phí", error: err.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { studentId } = req.body;

    const result = await RegistrationModel.markAsPaid(studentId);
    res.json({ message: "Xác nhận thanh toán thành công", result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Xác nhận thanh toán thất bại", error: err.message });
  }
};

module.exports = {
  registerCourse,
  getHistory,
  cancelRegistration,
  getTuition,
  confirmPayment,
};
