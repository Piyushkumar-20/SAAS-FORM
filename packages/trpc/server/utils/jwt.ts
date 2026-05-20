import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const signToken = async (userId: string): Promise<string> => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT Secret not defined");
  }
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
  return token;
};

const verifyToken = async (token: string): Promise<{ userId: string }> => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT Secret not defined");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

const hashPassword = async (password: string): Promise<string> => {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  const isMatch = bcrypt.compare(password, hash);
  return isMatch;
};

export { signToken, verifyToken, hashPassword, comparePassword };
