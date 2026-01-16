import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../../model/user.model.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Thiếu credential từ Google' });
    }

    // Xác minh ID token từ Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Tìm user trong DB
    let user = await User.findOne({ email });
    if (!user) {
      // Nếu chưa có thì tạo mới
      user = await User.create({
        email,
        name,
        googleId,
        avatar: picture,
      });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log(user);
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Xác thực Google thất bại' });
  }
};
