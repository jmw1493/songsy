import { useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { AuthUser } from "aws-amplify/auth";
// import ProfilePage from "./ProfilePage";
import ExplorePage from "./ExplorePage";
import SongCreateForm from "./ui-components/SongCreateForm";
import MySongs from "./MySongs";
import LikedSongsPage from "./LikedSongsPage";
import "./App.css";
import AccountPage from "./AccountPage";

enum Pages {
  UploadSong = "Upload Song",
  MySongs = "My Songs",
  LikedSongs = "Liked Songs",
  Explore = "Explore",
  Account = "Account",
}

function App() {
  const [page, setPage] = useState(Pages.UploadSong);

  const uploadSongPage = (
    <div>
      <h2>Upload song</h2>
      <SongCreateForm />
    </div>
  );

  function renderComponent(
    user: AuthUser | undefined,
    // eslint-disable-next-line
    signOut: ((data?: any | undefined) => void) | undefined
  ): JSX.Element {
    switch (page) {
      case Pages.UploadSong:
        return uploadSongPage;
      case Pages.MySongs:
        return <MySongs user={user} />;
      case Pages.LikedSongs:
        return <LikedSongsPage />;
      case Pages.Explore:
        return <ExplorePage user={user} />;
      case Pages.Account:
        return <AccountPage signOut={signOut} />;
      default:
        return uploadSongPage;
    }
  }

  return (
    <Authenticator>
      {({ user, signOut }) => (
        <div>
          <header>
            <span className="logo">Songzy</span>
          </header>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginTop: "40px",
              }}
            >
              {Object.values(Pages).map((pageName) => (
                <button
                  key={pageName}
                  className={page === pageName ? "selected" : ""}
                  onClick={() => {
                    ``;
                    if (page !== pageName) {
                      setPage(pageName);
                    }
                  }}
                >
                  {pageName}
                </button>
              ))}
            </nav>
            <main>{renderComponent(user, signOut)}</main>
          </div>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
