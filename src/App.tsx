import './App.css';
import { useState } from 'react';
import Form from './components/Forms/FormControled/Form';
import FormUncontrolled from './components/Forms/FormUncontrolled/FormUncontrolled';
import Modal from './components/Modal/Modal';
import UserProfile from './components/UserProfile/UserProfile';

function App() {
  const [openControlled, setOpenControlled] = useState(false);
  const [openUncontrolled, setOpenUncontrolled] = useState(false);

  return (
    <main className="appShell">
      <section className="heroSection" aria-labelledby="app-title">
        <p className="eyebrow">React forms playground</p>
        <h1 id="app-title">Choose a form flow</h1>
        <p className="heroText">
          Compare controlled and uncontrolled forms, submit user data, and
          preview the saved profile in one workspace.
        </p>
      </section>

      <section className="contentGrid" aria-label="Form options">
        <article className="infoCard">
          <span className="cardBadge">01</span>
          <h2>Controlled Form</h2>
          <p>
            Form state is managed by React, so every field update is visible and
            easy to validate.
          </p>
          <button
            className="formButton"
            onClick={() => setOpenControlled(true)}
            disabled={openControlled || openUncontrolled}
          >
            Open Controlled
          </button>
        </article>

        <article className="infoCard accentCard">
          <span className="cardBadge">02</span>
          <h2>Uncontrolled Form</h2>
          <p>
            Fields rely on refs and browser state, which keeps the form simple
            and lightweight.
          </p>
          <button
            className="formButton"
            onClick={() => setOpenUncontrolled(true)}
            disabled={openControlled || openUncontrolled}
          >
            Open Uncontrolled
          </button>
        </article>
      </section>

      {!openControlled && !openUncontrolled && (
        <section className="profileSection" aria-label="Saved user profile">
          <UserProfile />
        </section>
      )}

      <Modal isOpen={openControlled} onClose={() => setOpenControlled(false)}>
        <Form onClose={() => setOpenControlled(false)} />
      </Modal>

      <Modal
        isOpen={openUncontrolled}
        onClose={() => setOpenUncontrolled(false)}
      >
        <FormUncontrolled onClose={() => setOpenUncontrolled(false)} />
      </Modal>
    </main>
  );
}

export default App;
