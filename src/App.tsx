import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { useState } from "react";
import ProfilePage from "./ProfilePage";

function App() {
  const [page, setPage] = useState("profile");
  return (
    <Authenticator>
      {({ signOut }) => (
        <div>
          <header>
            <span className="logo">Songzy</span>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() =>
                  setPage(page === "profile" ? "explore" : "profile")
                }
              >
                {page === "profile" ? "Explore →" : "Profile →"}
              </button>
              <button onClick={signOut}>Sign out</button>
            </div>
          </header>
          <main>{page === "profile" ? <ProfilePage /> : <div></div>}</main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
