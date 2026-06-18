import { UserScope } from "../../../core/models/user.model";

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'PATRON' | 'CAISSIERE' | 'ENREGISTREUR';
  password: string;
  scope: UserScope;
  defaultPoissonnerieId?: number;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'PATRON' | 'CAISSIERE' | 'ENREGISTREUR';
  password: string;
  scope: UserScope;
  defaultPoissonnerieId?: number;
}
