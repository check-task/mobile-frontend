export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;
//ASCII 특수문자(!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~)만 인정
const SPECIAL_CHARACTER_PATTERN = /[!-/:-@[-`{-~]/;

export function getPasswordChecks(password: string) {
  return {
    length:
      password.length >= PASSWORD_MIN_LENGTH &&
      password.length <= PASSWORD_MAX_LENGTH,
    specialCharacter: SPECIAL_CHARACTER_PATTERN.test(password),
  };
}

export function isValidPassword(password: string) {
  const checks = getPasswordChecks(password);
  return checks.length && checks.specialCharacter;
}
