import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import styles from '../Form.module.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, type FormDataFields } from '../../../validation/validation';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store/store';
import { setFormData } from '../../store/slice';
import { toBase64 } from '../../../utils/helpers';
import PasswordStrengthIndicator from '../PasswordStrengthIndicator';

type FormProps = {
  onClose?: () => void;
};

export default function Form({ onClose }: FormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormDataFields>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      age: undefined,
      eMail: '',
      gender: undefined,
      country: undefined,
    },
  });
  const dispatch = useDispatch<AppDispatch>();
  const countries = useSelector((state: RootState) => state.form.countries);
  const passwordValue = useWatch({ control, name: 'password' }) ?? '';

  const onSubmit: SubmitHandler<FormDataFields> = async (data) => {
    if (data.photo && data.photo[0]) {
      const file = data.photo[0];
      const base64 = await toBase64(file);
      dispatch(setFormData({ ...data, photo: base64 }));
    } else {
      dispatch(setFormData(data));
    }
    onClose?.();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formHook}>
      <label> Name:</label>
      <input
        type="name"
        data-testid="name"
        {...register('name')}
        placeholder="Enter your Name"
      />
      {errors.name && <p className={styles.error}>{errors.name.message}</p>}

      <label>Age:</label>
      <input
        type="number"
        data-testid="age"
        placeholder="Enter your real age (positive number)"
        {...register('age', { valueAsNumber: true })}
      />
      {errors.age && <p className={styles.error}>{errors.age.message}</p>}

      <label>E-mail:</label>
      <input
        type="email"
        data-testid="email"
        {...register('eMail')}
        placeholder="Enter your E-mail"
      />
      {errors.eMail && <p className={styles.error}>{errors.eMail.message}</p>}

      <label>Gender Selection:</label>
      <select {...register('gender')} data-testid="gender">
        <option>Select gender</option>
        <option value="female">female</option>
        <option value="male">male</option>
      </select>

      <label>Password:</label>
      <input
        type="password"
        data-testid="password"
        {...register('password')}
        placeholder="min 12 (uppercase, lowercase digit, special char)"
      />
      <PasswordStrengthIndicator password={passwordValue} />
      {errors.password && (
        <p className={styles.error}>{errors.password.message}</p>
      )}

      <label>Check Password:</label>
      <input
        type="password"
        data-testid="checkPsw"
        {...register('checkPassword')}
        placeholder="Confirm your Password"
      />
      {errors.checkPassword && (
        <p className={styles.error}>{errors.checkPassword.message}</p>
      )}

      <label>Upload Photo:</label>
      <input
        type="file"
        data-testid="photo"
        {...register('photo')}
        accept=".jpeg, .png"
      />

      <label>Accept Terms and Conditions:</label>
      <input type="checkbox" data-testid="terms" {...register('acceptTerms')} />

      <label>Country:</label>
      <input
        type="text"
        list="controlled-country-options"
        data-testid="country"
        {...register('country')}
        placeholder="Start typing country code (e.g. BY)"
      />
      <datalist id="controlled-country-options">
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </datalist>
      {errors.country && <p className={styles.error}>{errors.country.message}</p>}
      <input
        type="submit"
        data-testid="submit"
        value="Submit"
        disabled={!isValid}
      />
    </form>
  );
}
