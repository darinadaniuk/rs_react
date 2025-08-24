'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Checkbox, Upload, Radio, TextField } from '@rs-react/components';
import {
  EMAIL_REGEX,
  NAME_REGEX,
  passwordRequirements,
  USER_VALIDATION_MSG,
} from '@rs-react/constants';
import { useCountryStore, usePhotoStore } from '@rs-react/store';

import { strongPw, GENDERS } from './user-form-rhf.const';

type RHFRegistrationFormProps = {
  onValidityChangeAction?: (valid: boolean) => void;
  onSubmitRefAction?: (submit: () => void) => void;
};

export function UserFormRHF({
  onValidityChangeAction,
  onSubmitRefAction,
}: RHFRegistrationFormProps) {
  const countries = useCountryStore((s) => s.countries);
  const photoBase64 = usePhotoStore((s) => s.base64);
  const saveBase64 = usePhotoStore((s) => s.saveBase64);
  const clearPhoto = usePhotoStore((s) => s.clear);

  const Schema = useMemo(
    () =>
      z
        .object({
          name: z
            .string()
            .min(1, USER_VALIDATION_MSG.nameInvalid)
            .regex(NAME_REGEX, USER_VALIDATION_MSG.nameInvalid),

          age: z.coerce
            .number()
            .refine(Number.isFinite, { message: USER_VALIDATION_MSG.ageRequired })
            .min(0, USER_VALIDATION_MSG.ageNegative),

          email: z
            .string()
            .min(1, USER_VALIDATION_MSG.emailInvalid)
            .regex(EMAIL_REGEX, USER_VALIDATION_MSG.emailInvalid),

          password: z
            .string()
            .min(1, USER_VALIDATION_MSG.passwordRequired)
            .refine(strongPw, USER_VALIDATION_MSG.passwordWeak),

          confirm: z.string(),

          gender: z.string().refine((v) => (GENDERS as readonly string[]).includes(v), {
            message: USER_VALIDATION_MSG.genderRequired,
          }),

          country: z
            .string()
            .optional()
            .refine((v) => !v || countries.includes(v), USER_VALIDATION_MSG.countryInvalid),

          tc: z.boolean().refine(Boolean, { message: USER_VALIDATION_MSG.tcRequired }),
        })
        .refine((data) => data.password === data.confirm, {
          path: ['confirm'],
          message: USER_VALIDATION_MSG.confirmMismatch,
        }),
    [countries],
  );

  type FormSchema = typeof Schema;
  type FormInputs = z.input<FormSchema>;
  type FormValues = z.output<FormSchema>;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormInputs, unknown, FormValues>({
    resolver: zodResolver(Schema),
    mode: 'onChange', // live validation
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm: '',
      gender: '',
      country: '',
      tc: false,
    },
  });

  useEffect(() => {
    onValidityChangeAction?.(isValid);
  }, [isValid, onValidityChangeAction]);

  const onSubmit: SubmitHandler<FormValues> = (data, event) => {
    const formEl = (event?.target as HTMLFormElement) || undefined;
    const fd = formEl ? new FormData(formEl) : undefined;

    alert(
      'Form submitted ✅\n\n' +
        JSON.stringify(
          {
            data,
            formDataKeys: fd ? Array.from(fd.keys()) : [],
          },
          null,
          2,
        ),
    );
  };

  useEffect(() => {
    const submitFn = () => handleSubmit(onSubmit)();
    onSubmitRefAction?.(submitFn);
  }, [handleSubmit, onSubmitRefAction]);

  const pw = watch('password') ?? '';
  const reqs = passwordRequirements(pw);

  const onReset = () => {
    reset();
    clearPhoto();
    clearErrors();
  };

  const uploadHasError = Boolean(errors.root?.file?.message);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
      <div className="form-row">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              ref={field.ref}
              name="name"
              label="Name"
              placeholder="John Doe"
              value={(field.value as string) ?? ''}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="form-row">
        <Controller
          name="age"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              ref={field.ref}
              name="age"
              type="number"
              label="Age"
              placeholder="30"
              value={field.value === undefined || field.value === null ? '' : String(field.value)}
              onChange={(v) => field.onChange(v === '' ? undefined : v)}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="form-row">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              ref={field.ref}
              name="email"
              type="email"
              label="Email"
              placeholder="your_email@example.com"
              value={(field.value as string) ?? ''}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="form-row">
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              ref={field.ref}
              name="password"
              type="password"
              label="Password"
              value={(field.value as string) ?? ''}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="form-row">
        <Controller
          name="confirm"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              ref={field.ref}
              name="confirm"
              type="password"
              label="Confirm Password"
              value={(field.value as string) ?? ''}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="form-row">
        <span>Gender</span>
        <Controller
          name="gender"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <div className="radio-group">
                <Radio
                  name={field.name}
                  value="female"
                  label="Female"
                  checked={field.value === 'female'}
                  onChange={field.onChange}
                />
                <Radio
                  name={field.name}
                  value="male"
                  label="Male"
                  checked={field.value === 'male'}
                  onChange={field.onChange}
                />
                <Radio
                  name={field.name}
                  value="other"
                  label="Other"
                  checked={field.value === 'other'}
                  onChange={field.onChange}
                />
                <Radio
                  name={field.name}
                  value="prefer_not"
                  label="Prefer not to say"
                  checked={field.value === 'prefer_not'}
                  onChange={field.onChange}
                />
              </div>
              <div className="field-msg">{fieldState.error?.message ?? '\u00A0'}</div>
            </>
          )}
        />
      </div>

      <div className="form-row">
        <Controller
          name="country"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              ref={field.ref}
              id="country"
              name="country"
              label="Country"
              placeholder="Start typing…"
              listId="countries-list"
              datalistOptions={countries}
              value={(field.value as string) ?? ''}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <datalist id="countries-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div className="form-row">
        <Upload
          id="picture"
          name="picture"
          hint={
            photoBase64
              ? `Saved to Zustand (${Math.round(photoBase64.length / 1024)} KB base64)`
              : 'Picture PNG/JPEG, max 2MB'
          }
          error={errors.root?.file?.message as string | undefined}
          onError={(msg) => {
            if (msg) setError('root.file' as any, { type: 'manual', message: msg });
            else clearErrors('root.file' as any);
          }}
          onValidFile={({ base64 }) => {
            saveBase64(base64);
            clearErrors('root.file' as any);
          }}
        />
      </div>

      <div className="form-row checkbox-row">
        <Controller
          name="tc"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Checkbox
                name="tc"
                label="I accept the Terms and Conditions"
                checked={!!field.value}
                onChange={field.onChange}
                required
              />
              <div className="field-msg">{fieldState.error?.message ?? '\u00A0'}</div>
            </>
          )}
        />
      </div>

      {/* <Button onClick={onReset} text="Reset" />*/}
    </form>
  );
}
