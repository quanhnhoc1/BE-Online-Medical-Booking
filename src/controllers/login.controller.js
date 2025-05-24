const getAllUsers = require("../services/getAllUsers.services");
function login(req, res) {
  return res.send("Login successful");
}

async function getUser(req, res) {
  try {
    const result = await getAllUsers.getAllUsers();
    return res.send(result);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { login, getUser };
