export const NAME_REGEX = /^\p{Lu}\p{L}*$/u;
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const hasNumber = (s: string) => /\d/.test(s);
export const hasUpper = (s: string) => /[A-Z]/.test(s);
export const hasLower = (s: string) => /[a-z]/.test(s);
export const hasSpecial = (s: string) => /[^A-Za-z0-9]/.test(s);

export const passwordRequirements = (pw: string) => {
  return {
    number: hasNumber(pw),
    upper: hasUpper(pw),
    lower: hasLower(pw),
    special: hasSpecial(pw),
  };
};
