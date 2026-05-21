const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {

    return res.status(401).json({
      message: "沒有 Token",
    });

  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      "secretkey"
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(403).json({
      message: "Token 無效",
    });

  }

}

module.exports = verifyToken;