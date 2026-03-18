export const PASSWORD_REGEX =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+/;

export const PHONE_REGEX = /^(?:\+234|0)[7-9][0-1]\d{8}$/;

export const USERNAME_REGEX =
  /^(?=.{1,255}$)(?!.*[._-]{2})[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/;

export const URL_REGEX = /https?:\/\/[^\s<>"')\]]+/gi;
