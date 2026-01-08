import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra có header Authorization không
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Thiếu token hoặc định dạng sai' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Xác minh token với JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lưu thông tin user vào request
    req.user = decoded;

    // Cho phép đi tiếp
    next();
  } catch (err) {
    console.error('JWT verify error:', err);
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
