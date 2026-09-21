export interface LoginAttemptData {
  password: string;
  expectedMessage: string;
}

export const InvalidPasswordLogin: LoginAttemptData = {
  password: "wrong-password",
  expectedMessage: "Wrong password",
};

export const UnknownUserLogin: LoginAttemptData = {
  password: "any-password",
  expectedMessage: "User does not exist",
};

export const RequiredCredentialsAlert = "Please fill out Username and Password";

export const DuplicateUserAlert = "This user already exist";

export const SuccessfulOrDuplicateSignupPattern = /Sign up successful|This user already exist/;
