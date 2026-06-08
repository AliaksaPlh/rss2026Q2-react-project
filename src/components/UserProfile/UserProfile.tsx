import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const submissions = useSelector((state: RootState) => state.form.submissions);

  if (submissions.length === 0) {
    return;
  }

  return (
    <section className={styles.profileList} aria-label="Submitted users">
      <h2>Submitted users</h2>
      <div className={styles.profileGrid}>
        {submissions.map((formData, index) => (
          <article
            key={`${formData.eMail}-${index}`}
            className={
              index === submissions.length - 1
                ? styles.userProfileUpdated
                : styles.userProfile
            }
          >
            <h3>User #{index + 1}</h3>
            {formData.photo && typeof formData.photo === 'string' && (
              <div>
                <img
                  src={formData.photo}
                  alt="User photo"
                  className={styles.photo}
                />
              </div>
            )}
            <p className={styles.userInfo}>
              <strong>Name:</strong> {formData.name}
            </p>
            <p className={styles.userInfo}>
              <strong>Age:</strong> {formData.age}
            </p>
            <p className={styles.userInfo}>
              <strong>Email:</strong> {formData.eMail}
            </p>
            <p className={styles.userInfo}>
              <strong>Gender:</strong> {formData.gender}
            </p>
            <p className={styles.userInfo}>
              <strong>Country Short Code:</strong> {formData.country}
            </p>

            <p className={styles.userInfo}>
              <strong>Password:</strong> *** (hidden)
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default UserProfile;
