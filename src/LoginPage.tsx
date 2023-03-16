import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AES, enc } from "crypto-js";
import storage from "./storage";
import { v4 as uuid } from "uuid";
import { UserData } from "./types";
import { auth, provider, db } from "./db";
import { signInWithPopup } from "firebase/auth";
import styles from "./LoginPage.module.css";
import NotesPage from "./NotesPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const PASSPHRASE_STORAGE_KEY = "passphrase";

type Props = {
  setUserData: (userData: UserData) => void;
};

function LoginPage({ setUserData }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isVisible, setVisible] = useState(false);

  const state = {
    button: "loginWithPassword",
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (state.button === "loginWithGoogle") {
      // console.log("Button 2 clicked!");

      signInWithPopup(auth, provider).then((data) => {
        const userEmail = data.user.email.split("@").shift();

        setUserEmail(userEmail);

        const passphrase = uuid();

        storage.set(
          `${userEmail}:${PASSPHRASE_STORAGE_KEY}`,
          AES.encrypt(passphrase, userEmail).toString()
        );

        const creds = AES.encrypt(passphrase, userEmail).toString();
        const key = `${userEmail}:${PASSPHRASE_STORAGE_KEY}`;

        db.ref(`creds/${key}`).set({ creds });
        setUserData({ username: userEmail, passphrase });

        localStorage.setItem("email", userEmail);

        return;
      });
    } else {
      // if (state.button === "loginWithPassword") {
      // console.log("Button 1 clicked!");

      // const encryptedPassphrase = storage.get<string | undefined>(
      //   `${username}:${PASSPHRASE_STORAGE_KEY}`
      // );

      try {
        const snapshot = await db.ref("/creds").get();

        if (snapshot.exists()) {
          let encryptedPassphrase = "";

          const data = snapshot.val();

          for (let key in data) {
            if (key.split(":").shift() === username) {
              encryptedPassphrase = data[key].creds;
            }
          }

          if (!encryptedPassphrase) {
            const passphrase = uuid();

            storage.set(
              `${username}:${PASSPHRASE_STORAGE_KEY}`,
              AES.encrypt(passphrase, password).toString()
            );

            const creds = AES.encrypt(passphrase, password).toString();
            const key = `${username}:${PASSPHRASE_STORAGE_KEY}`;

            db.ref(`creds/${key}`).set({ creds });
            setUserData({ username, passphrase });

            return;
          }

          const passphrase = AES.decrypt(
            encryptedPassphrase,
            password
          ).toString(enc.Utf8);

          if (passphrase) {
            setUserData({ username, passphrase });
          } else {
            setErrorText("Invalid credentials for existing user");
          }
        } else {
          console.log("NO DATA");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setVisible(!isVisible);
  };

  useEffect(() => {
    if (localStorage.getItem("email"))
      setUserEmail(localStorage.getItem("email"));
  });

  return (
    <div className={styles.pageContainer}>
      {/* {userEmail ? (
        <NotesPage userData={{ username: "name", passhphrase: "phrase" }} />
      ) : ( */}
      <form className={styles.loginContainer} onSubmit={handleSubmit}>
        <span className={styles.errorText}>{errorText}</span>
        <label>
          <div className={styles.labelText}>Username</div>
          <input
            name="username"
            type="text"
            className={styles.textField}
            onChange={handleChangeUsername}
            value={username}
            required
          />
        </label>

        <label>
          <div className={styles.passwordFieldWrapper}>
            <div className={styles.labelText}>Password</div>
            <input
              name="password"
              type={!isVisible ? "password" : "text"}
              className={styles.textField}
              onChange={handleChangePassword}
              value={password}
              required
              onClick={() => (state.button = "loginWithPassword")}
            />

            <span
              className={styles.visibilityIcon}
              onClick={togglePasswordVisibility}>
              {isVisible ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>
          </div>
        </label>

        <button type="submit" className={styles.button}>
          Login
        </button>

        {/* <span className={styles.labelText} style={{ textAlign: "center" }}>
          or
        </span> */}

        {/* <button
          className={styles.loginWithGoogleBtn}
          type="submit"
          onClick={() => (state.button = "loginWithGoogle")}> */}
        {/* <FontAwesomeIcon icon={faGoogle} />  */}
        {/* Sign in with Google
        </button> */}
      </form>
      {/* )} */}
    </div>
  );
}

export default LoginPage;
