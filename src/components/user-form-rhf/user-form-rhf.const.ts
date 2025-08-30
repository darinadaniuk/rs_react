import { hasLower, hasNumber, hasSpecial, hasUpper } from '@rs-react/constants';

export const strongPw = (pw: string) =>
  hasNumber(pw) && hasUpper(pw) && hasLower(pw) && hasSpecial(pw);
export const GENDERS = ['female', 'male', 'other'] as const;
