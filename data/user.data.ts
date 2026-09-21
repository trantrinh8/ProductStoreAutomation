export interface UserCredentialData {
  username: string;
  password: string;
}

export interface GeneratedUserData {
  prefix: string;
  password: string;
}

export const GeneratedValidUser: GeneratedUserData = {
  prefix: "auto_user",
  password: "P@ssw0rd123!",
};

export const DuplicateUser: GeneratedUserData = {
  prefix: "duplicate",
  password: "P@ssw0rd123!",
};

export const WrongPasswordUser: GeneratedUserData = {
  prefix: "wrong_password",
  password: "P@ssw0rd123!",
};

export const UnknownUser: GeneratedUserData = {
  prefix: "unknown",
  password: "any-password",
};

export const BlankUsernameUser: UserCredentialData = {
  username: "",
  password: "P@ssw0rd123!",
};

export const BlankPasswordUser: GeneratedUserData = {
  prefix: "blank_password",
  password: "",
};

export const LongUsernameUser: GeneratedUserData = {
  prefix: "long",
  password: "P@ssw0rd123!",
};

export const SpecialCharacterUser: GeneratedUserData = {
  prefix: "special_!@$",
  password: "P@ssw0rd123!",
};
