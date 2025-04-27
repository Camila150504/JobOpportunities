import User from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../services/sendVerificationEmail.js";
import { sendResetPasswordEmail } from "../services/sendResetPasswordEmail.js";

const JWT_SECRET = process.env.JWT_SECRET

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};
  
export const registerUser = async (req, res) => {
  console.log("Register body: ", req.body)
  const { first_name, last_name, email, password, role, } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      companyId: null, 
      isVerfied: false
    });
    await sendVerificationEmail(newUser);
    res.status(201).json({ message: 'User created. Please Check you email to confirm.', user: newUser });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(400).json({ 
      message: 'Error creating user', 
      error: error.message,
      details: error.errors || error.stack 
    });
  }
  };

  export const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.isVerified = true;
      await user.save();
  
      res.send(`
        <html>
          <body style="text-align: center; margin-top: 100px;">
            <h1 style="color: #6c5ce7;"> Email Verified Successfully!</h1>
            <p>You can now log in to your account.</p>
          </body>
        </html>
      `);
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired token", error });
    }
  };  

export const loginUser = async (req,res) => {
  const {email, password} = req.body
  try{
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role,
          companyId: user.companyId },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Login successful', 
      token, 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      } 
    });
  }catch(error){
    res.status(500).json({ message: 'Login failed', error });
  }
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    await sendResetPasswordEmail(user);
    res.json({ message: "Reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset email", error });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.send(`
      <html>
        <body style="text-align: center; margin-top: 100px;">
          <h2>Password Reset Successful </h2>
          <p>You can now log in with your new password.</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token", error });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

