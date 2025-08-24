import React, { useRef, useState, useImperativeHandle } from 'react';

import { useCountryStore, usePhotoStore } from '@rs-react/store';
import { Checkbox, Upload, Radio, TextField } from '@rs-react/components';

import './user-form-uncontrolled.css';
import {
  EMAIL_REGEX,
  NAME_REGEX,
  passwordRequirements,
  USER_VALIDATION_MSG,
} from '@rs-react/constants';

export type UncontrolledRegistrationFormHandle = {
  validate: () => boolean;
  submit: () => void;
};

export type UncontrolledRegistrationFormProps = {
  onValidityChange?: (valid: boolean) => void;
  onSubmit?: (data: Record<string, FormDataEntryValue>) => void;
};

export const UserFormUncontrolled = React.forwardRef<
  UncontrolledRegistrationFormHandle,
  UncontrolledRegistrationFormProps
>(function UserFormUncontrolled(
  { onValidityChange, onSubmit }: UncontrolledRegistrationFormProps,
  ref,
) {
  const countries = useCountryStore((store) => store.countries);
  const savePhoto = usePhotoStore((store) => store.saveBase64);
  const clearPhoto = usePhotoStore((store) => store.clear);

  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);

  const [gender, setGender] = useState<string>('');
  const [tcChecked, setTcChecked] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const collectErrors = (): Record<string, string> => {
    const nextErrors: Record<string, string> = {};
    const name = nameRef.current?.value.trim() ?? '';
    const age = ageRef.current?.value.trim() ?? '';
    const email = emailRef.current?.value.trim() ?? '';
    const pwd = pwdRef.current?.value ?? '';
    const confirm = confirmRef.current?.value ?? '';
    const country = countryRef.current?.value.trim() ?? '';

    if (!NAME_REGEX.test(name)) {
      nextErrors.name = USER_VALIDATION_MSG.nameInvalid;
    }

    if (!age) {
      nextErrors.age = USER_VALIDATION_MSG.ageRequired;
    } else if (Number(age) < 0) {
      nextErrors.age = USER_VALIDATION_MSG.ageNegative;
    }

    if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = USER_VALIDATION_MSG.emailInvalid;
    }

    const req = passwordRequirements(pwd);
    if (!pwd) {
      nextErrors.password = USER_VALIDATION_MSG.passwordRequired;
    } else if (!(req.number && req.upper && req.lower && req.special)) {
      nextErrors.password = USER_VALIDATION_MSG.passwordWeak;
    }

    if (pwd !== confirm) {
      nextErrors.confirm = USER_VALIDATION_MSG.confirmMismatch;
    }

    if (!gender) {
      nextErrors.gender = USER_VALIDATION_MSG.genderRequired;
    }

    if (!tcChecked) {
      nextErrors.tc = USER_VALIDATION_MSG.tcRequired;
    }

    if (country && !countries.includes(country)) {
      nextErrors.country = USER_VALIDATION_MSG.countryInvalid;
    }

    return nextErrors;
  };

  function validate(): boolean {
    const nextErrors = collectErrors();
    setErrors(nextErrors);
    const ok = Object.keys(nextErrors).length === 0;
    onValidityChange?.(ok);
    return ok;
  }

  function onSubmitInternal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    onSubmit?.(data);
  }

  function onReset() {
    formRef.current?.reset();
    setErrors({});
    clearPhoto();
    setTcChecked(false);
    setGender('');
    onValidityChange?.(false);
  }

  function onAnyInput() {
    const ok = Object.keys(collectErrors()).length === 0;
    onValidityChange?.(ok);
  }

  useImperativeHandle(ref, () => ({
    validate,
    submit: () => {
      validate();
      !errors && formRef.current?.requestSubmit();
    },
  }));

  return (
    <form id="uncontrolled-form" ref={formRef} onSubmit={onSubmitInternal} onInput={onAnyInput}>
      <div className="form-row">
        <TextField
          ref={nameRef}
          name="name"
          label="Name"
          placeholder="John Doe"
          error={errors.name}
        />
      </div>

      <div className="form-row">
        <TextField
          ref={ageRef}
          name="age"
          type="number"
          label="Age"
          placeholder="30"
          error={errors.age}
        />
      </div>

      <div className="form-row">
        <TextField
          ref={emailRef}
          name="email"
          type="email"
          label="Email"
          placeholder="your_email@example.com"
          error={errors.email}
        />
      </div>

      <div className="form-row">
        <TextField
          ref={pwdRef}
          name="password"
          type="password"
          label="Password"
          error={errors.password}
        />
      </div>

      <div className="form-row">
        <TextField
          ref={confirmRef}
          name="confirm"
          type="password"
          label="Confirm Password"
          error={errors.confirm}
        />
      </div>

      <div className="form-row radio">
        <p className="radio-label">Gender</p>
        <div className="radio-group">
          <Radio
            name="gender"
            value="female"
            label="Female"
            checked={gender === 'female'}
            onChange={setGender}
          />
          <Radio
            name="gender"
            value="male"
            label="Male"
            checked={gender === 'male'}
            onChange={setGender}
          />
          <Radio
            name="gender"
            value="other"
            label="Other"
            checked={gender === 'other'}
            onChange={setGender}
          />
        </div>
        {errors.gender && <p className="validation-error">{errors.gender}</p>}
      </div>

      <div className="form-row">
        <TextField
          id="country"
          name="country"
          label="Country"
          placeholder="Start typing…"
          listId="countries-list"
          datalistOptions={countries}
          ref={countryRef}
          error={errors.country}
        />
      </div>

      <div className="form-row">
        <Upload
          id="picture"
          name="picture"
          hint="Picture PNG/JPEG, max 2MB"
          error={errors.file}
          onError={(msg) => {
            setErrors((e) => {
              const { file, ...rest } = e;
              return msg ? { ...rest, file: msg } : rest;
            });
          }}
          onValidFile={({ base64 }) => {
            savePhoto(base64);
          }}
        />
      </div>

      <div className="form-row checkbox-row">
        <Checkbox
          name="tc"
          label="Accept Terms and Conditions"
          checked={tcChecked}
          onChange={setTcChecked}
          required
        />
        {errors.tc && <p className="validation-error">{errors.tc}</p>}
      </div>
    </form>
  );
});
