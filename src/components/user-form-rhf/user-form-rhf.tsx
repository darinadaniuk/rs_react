'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useMemo, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Checkbox, Upload, Radio, TextField } from '@rs-react/components';
import { EMAIL_REGEX, NAME_REGEX } from '@rs-react/constants';
import { useCountryStore, usePhotoStore, useUserStore } from '@rs-react/store';

import { strongPw, GENDERS } from './user-form-rhf.const';

type RHFRegistrationFormProps = {
  onValidityChangeAction?: (valid: boolean) => void;
  onSubmitRefAction?: (submit: () => void) => void;
};

export function UserFormRHF({
  onValidityChangeAction,
  onSubmitRefAction,
}: RHFRegistrationFormProps) {
  const t = useTranslations('userForm');

  const countries = useCountryStore((s) => s.countries);
  const photoBase64 = usePhotoStore((s) => s.base64);
  const saveBase64 = usePhotoStore((s) => s.saveBase64);
  const saveUser = useUserStore((s) => s.save);

  const Schema = useMemo(
    () =>
      z
        .object({
          name: z
            .string()
            .min(1, t('errors.nameInvalid'))
            .regex(NAME_REGEX, t('errors.nameInvalid')),
          age: z.coerce
            .number()
            .refine(Number.isFinite, { message: t('errors.ageRequired') })
            .min(0, t('errors.ageNegative')),
          email: z
            .string()
            .min(1, t('errors.emailInvalid'))
            .regex(EMAIL_REGEX, t('errors.emailInvalid')),
          password: z
            .string()
            .min(1, t('errors.passwordRequired'))
            .refine(strongPw, t('errors.passwordWeak')),
          confirm: z.string(),
          gender: z.string().refine((v) => (GENDERS as readonly string[]).includes(v), {
            message: t('errors.genderRequired'),
          }),
          country: z
            .string()
            .optional()
            .refine((v) => !v || countries.includes(v), t('errors.countryInvalid')),
          tc: z.boolean().refine(Boolean, { message: t('errors.tcRequired') }),
        })
        .refine((data) => data.password === data.confirm, {
          path: ['confirm'],
          message: t('errors.confirmMismatch'),
        }),
    [countries, t],
  );

  type FormSchema = typeof Schema;
  type FormInputs = z.input<FormSchema>;
  type FormValues = z.output<FormSchema>;

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormInputs, unknown, FormValues>({
    resolver: zodResolver(Schema),
    mode: 'onChange',
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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const pictureBase64 =
      photoBase64 && !photoBase64.startsWith('data:')
        ? `${photoBase64.startsWith('iVBORw0K') ? 'data:image/png;base64,' : 'data:image/jpeg;base64,'}${photoBase64}`
        : (photoBase64 ?? null);

    saveUser({
      name: data.name,
      age: data.age,
      email: data.email,
      password: data.password,
      gender: data.gender as 'female' | 'male' | 'other',
      country: data.country || undefined,
      tc: data.tc,
      pictureBase64,
    });
  };

  useEffect(() => {
    const submitFn = () => handleSubmit(onSubmit)();
    onSubmitRefAction?.(submitFn);
  }, [handleSubmit, onSubmitRefAction, onSubmit]);

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
              label={t('fields.name.label')}
              placeholder={t('fields.name.placeholder')}
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
              label={t('fields.age.label')}
              placeholder={t('fields.age.placeholder')}
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
              label={t('fields.email.label')}
              placeholder={t('fields.email.placeholder')}
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
              label={t('fields.password.label')}
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
              label={t('fields.confirm.label')}
              placeholder={t('fields.confirm.placeholder')}
              value={(field.value as string) ?? ''}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="form-row">
        <span>{t('fields.gender.label')}</span>
        <Controller
          name="gender"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <div className="radio-group">
                <Radio
                  name={field.name}
                  value="female"
                  label={t('fields.gender.options.female')}
                  checked={field.value === 'female'}
                  onChange={field.onChange}
                />
                <Radio
                  name={field.name}
                  value="male"
                  label={t('fields.gender.options.male')}
                  checked={field.value === 'male'}
                  onChange={field.onChange}
                />
                <Radio
                  name={field.name}
                  value="other"
                  label={t('fields.gender.options.other')}
                  checked={field.value === 'other'}
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
              label={t('fields.country.label')}
              placeholder={t('fields.country.placeholder')}
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
          error={errors.root?.message as string | undefined}
          onError={(msg) => {
            if (msg) setError('root', { type: 'manual', message: msg });
            else clearErrors('root');
          }}
          onValidFile={({ base64 }) => {
            saveBase64(base64);
            clearErrors('root');
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
                label={t('fields.tc.label')}
                checked={!!field.value}
                onChange={field.onChange}
                required
              />
              <div className="field-msg">{fieldState.error?.message ?? '\u00A0'}</div>
            </>
          )}
        />
      </div>
    </form>
  );
}
