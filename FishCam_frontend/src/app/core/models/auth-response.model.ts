import { UserResponse } from "./user.model";

export interface AuthResponse {
  type: string;
  token: string;
  user: UserResponse
}
