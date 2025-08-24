'use client';

import { useTranslations } from 'next-intl';
import React, { useRef, useState, useImperativeHandle } from 'react';

import { useCountryStore, usePhotoStore, useUserStore, type UserData } from '@rs-react/store';
import { Checkbox, Upload, Radio, TextField } from '@rs-react/components';

import './user-form-uncontrolled.css';
import { EMAIL_REGEX, NAME_REGEX, passwordRequirements } from '@rs-react/constants';

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
  const t = useTranslations('userForm');

  const countries = useCountryStore((store) => store.countries);
  const savePhoto = usePhotoStore((store) => store.saveBase64);
  const clearPhoto = usePhotoStore((store) => store.clear);
  const saveUser = useUserStore((store) => store.save);
  const resetUser = useUserStore((store) => store.reset);

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
      nextErrors.name = t('errors.nameInvalid');
    }

    if (!age) {
      nextErrors.age = t('errors.ageRequired');
    } else if (Number(age) < 0) {
      nextErrors.age = t('errors.ageNegative');
    }

    if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = t('errors.emailInvalid');
    }

    const req = passwordRequirements(pwd);
    if (!pwd) {
      nextErrors.password = t('errors.passwordRequired');
    } else if (!(req.number && req.upper && req.lower && req.special)) {
      nextErrors.password = t('errors.passwordWeak');
    }

    if (pwd !== confirm) {
      nextErrors.confirm = t('errors.confirmMismatch');
    }

    if (!gender) {
      nextErrors.gender = t('errors.genderRequired');
    }

    if (!tcChecked) {
      nextErrors.tc = t('errors.tcRequired');
    }

    if (country && !countries.includes(country)) {
      nextErrors.country = t('errors.countryInvalid');
    }

    return nextErrors;
  };

  function validate(): boolean {
    const nextErrors = collectErrors();
    setErrors(nextErrors);
    const valid = Object.keys(nextErrors).length === 0;
    onValidityChange?.(valid);
    return valid;
  }

  function onSubmitInternal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());

    const pictureBase64 = usePhotoStore.getState().base64 ?? null;

    const payload: UserData = {
      name: String(raw.name ?? ''),
      age: Number(raw.age ?? 0),
      email: String(raw.email ?? ''),
      password: String(raw.password ?? ''),
      gender: gender as UserData['gender'],
      country: raw.country ? String(raw.country) : undefined,
      tc: tcChecked,
      pictureBase64,
    };

    saveUser(payload);
    onSubmit?.(raw);
  }

  function onReset() {
    formRef.current?.reset();
    setErrors({});
    clearPhoto();
    setTcChecked(false);
    setGender('');
    onValidityChange?.(false);
    resetUser();
  }

  function onAnyInput() {
    const valid = Object.keys(collectErrors()).length === 0;
    onValidityChange?.(valid);
  }

  useImperativeHandle(ref, () => ({
    validate,
    submit: () => {
      if (validate()) {
        formRef.current?.requestSubmit();
      }
    },
  }));

  return (
    <form
      id="uncontrolled-form"
      ref={formRef}
      onSubmit={onSubmitInternal}
      onReset={onReset}
      onInput={onAnyInput}
      aria-label={t('aria.formLabel')}
    >
      <div className="form-row">
        <TextField
          ref={nameRef}
          name="name"
          label={t('fields.name.label')}
          placeholder={t('fields.name.placeholder')}
          error={errors.name}
        />
      </div>

      <div className="form-row">
        <TextField
          ref={ageRef}
          name="age"
          type="number"
          label={t('fields.age.label')}
          placeholder={t('fields.age.placeholder')}
          error={errors.age}
        />
      </div>

      <div className="form-row">
        <TextField
          ref={emailRef}
          name="email"
          type="email"
          label={t('fields.email.label')}
          placeholder={t('fields.email.placeholder')}
          error={errors.email}
        />
      </div>

      <div className="form-row">
        <TextField
          ref={pwdRef}
          name="password"
          type="password"
          label={t('fields.password.label')}
          placeholder={t('fields.password.placeholder')}
          error={errors.password}
        />
      </div>

      <div className="form-row">
        <TextField
          ref={confirmRef}
          name="confirm"
          type="password"
          label={t('fields.confirm.label')}
          placeholder={t('fields.confirm.placeholder')}
          error={errors.confirm}
        />
      </div>

      <div className="form-row radio">
        <p className="radio-label">{t('fields.gender.label')}</p>
        <div className="radio-group">
          <Radio
            name="gender"
            value="female"
            label={t('fields.gender.options.female')}
            checked={gender === 'female'}
            onChange={setGender}
          />
          <Radio
            name="gender"
            value="male"
            label={t('fields.gender.options.male')}
            checked={gender === 'male'}
            onChange={setGender}
          />
          <Radio
            name="gender"
            value="other"
            label={t('fields.gender.options.other')}
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
          label={t('fields.country.label')}
          placeholder={t('fields.country.placeholder')}
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
          hint={t('fields.picture.hint')}
          error={errors.file}
          onError={(msg) => {
            setErrors((e) => {
              const next = { ...e };
              if (msg) {
                next.file = t('errors.file', { msg });
              } else {
                delete next.file;
              }
              return next;
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
          label={t('fields.tc.label')}
          checked={tcChecked}
          onChange={setTcChecked}
          required
        />
        {errors.tc && <p className="validation-error">{errors.tc}</p>}
      </div>
    </form>
  );
});
