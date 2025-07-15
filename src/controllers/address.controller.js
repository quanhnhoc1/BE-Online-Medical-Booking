const Address = require("../services/addressServices");

const getProvinces = async (req, res) => {
  try {
    const provinces = await Address.getProvinces();
    res.json(provinces);
  } catch (error) {
    console.error("Lỗi getProvinces:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getDistricts = async (req, res) => {
  const province = req.query.province;
  if (!province) return res.status(400).json({ message: "Thiếu province" });

  try {
    const districts = await Address.getDistrictsByProvince(province);
    res.json(districts);
  } catch (error) {
    console.error("Lỗi getDistricts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getWards = async (req, res) => {
  const { province, district } = req.query;
  if (!province || !district)
    return res.status(400).json({ message: "Thiếu province hoặc district" });

  try {
    const wards = await Address.getWardsByProvinceAndDistrict(
      province,
      district
    );
    res.json(wards);
  } catch (error) {
    console.error("Lỗi getWards:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProvinces,
  getDistricts,
  getWards,
};
