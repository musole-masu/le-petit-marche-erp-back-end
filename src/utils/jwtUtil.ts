import jwt from "jsonwebtoken";
import { IUserPayload } from "../interfaces/userPayload";

export class JsonWebTokenUtil {
  static signJwt(userPayload: IUserPayload) {
    const token = jwt.sign(userPayload, process.env.JWT_KEY!, {
      expiresIn: "5h",
    });
    return token;
  }
  static verifyJwt(token: any) {
    const userPayload = jwt.verify(token, process.env.JWT_KEY!) as IUserPayload;
    return userPayload;
  }
}
