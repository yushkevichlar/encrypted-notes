import { useState } from "react";
import LoginPage from "./components/Login/LoginPage";
import NotesPage from "./components/Notes/NotesPage/NotesPage";
import { UserData } from "./types";

function App() {
  const [userData, setUserData] = useState<UserData>();

  return userData ? (
    <NotesPage userData={userData} />
  ) : (
    <LoginPage setUserData={setUserData} />
  );
}

export default App;
