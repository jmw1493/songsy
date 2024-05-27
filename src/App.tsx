import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { AuthUser } from "aws-amplify/auth";
// import ProfilePage from "./ProfilePage";
import ExplorePage from "./ExplorePage";
import MySongs from "./MySongs";
import LikedSongsPage from "./LikedSongsPage";
import "./App.css";
import AccountPage from "./AccountPage";
import Nav from "./Nav";
import { Pages } from "./constants";
import UploadSongPage from "./UploadSongPage";

function App() {
  const [page, setPage] = useState(Pages.UploadSong);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function renderComponent(
    user: AuthUser | undefined,
    // eslint-disable-next-line
    signOut: ((data?: any | undefined) => void) | undefined
  ): JSX.Element {
    switch (page) {
      case Pages.UploadSong:
        return <UploadSongPage />;
      case Pages.MySongs:
        return <MySongs user={user} />;
      case Pages.LikedSongs:
        return <LikedSongsPage />;
      case Pages.Explore:
        return <ExplorePage user={user} />;
      case Pages.Account:
        return <AccountPage signOut={signOut} />;
      default:
        return <UploadSongPage />;
    }
  }

  return (
    <Authenticator
      components={{
        Header() {
          return (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className="logo auth">Songzy</div>
            </div>
          );
        },
      }}
    >
      {({ user, signOut }) => (
        <div style={{ height: "100vh" }}>
          <div
            style={
              isMobile
                ? { height: "100%" }
                : { display: "flex", alignItems: "stretch", height: "100%" }
            }
          >
            <Nav page={page} setPage={setPage} isMobile={isMobile} />
            <main>{renderComponent(user, signOut)}</main>
          </div>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
