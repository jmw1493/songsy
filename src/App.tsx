import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { useState } from "react";
import ProfilePage from "./ProfilePage";
import ExplorePage from "./ExplorePage";

function App() {
  const [page, setPage] = useState("profile");
  return (
    <Authenticator>
      {({ signOut, user }) => (
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
          <main>
            {page === "profile" ? (
              <ProfilePage user={user} />
            ) : (
              <ExplorePage user={user} />
            )}
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
