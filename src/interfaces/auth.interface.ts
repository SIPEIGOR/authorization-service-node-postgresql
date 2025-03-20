export interface RegisterUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface ChangePasswordDTO {
  email: string;
  oldPassword: string;
  newPassword: string;
}
