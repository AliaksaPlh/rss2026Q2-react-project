import styles from './Form.module.css';

type PasswordStrengthIndicatorProps = {
  password: string;
};

const passwordRules = [
  {
    label: '1 number',
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    label: '1 uppercase',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: '1 lowercase',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: '1 special character',
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
];

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  return (
    <div className={styles.passwordStrength} aria-label="Password strength">
      <p>Password should contain:</p>
      <ul>
        {passwordRules.map((rule) => {
          const isMet = rule.test(password);

          return (
            <li
              key={rule.label}
              className={isMet ? styles.ruleMet : styles.ruleMissing}
            >
              <span>{isMet ? 'Met' : 'Need'}</span> {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
