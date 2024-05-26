import { SongCreateForm } from "./ui-components";
import { AuthUser } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import MySongs from "./MySongs";
import { useState } from "react";
import LikedSongsPage from "./LikedSongsPage";

type ProfilePageProps = {
  user: AuthUser | undefined;
};

enum PageNames {
  UploadSong = "Upload Song",
  MySongs = "My Songs",
  LikedSongs = "Liked Songs",
}

function ProfilePage({ user }: ProfilePageProps) {
  const [page, setPage] = useState(PageNames.UploadSong);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {Object.values(PageNames).map((pageName) => (
          <button
            key={pageName}
            className={page === pageName ? "selected" : ""}
            onClick={() => {
              if (page !== pageName) {
                setPage(pageName);
              }
            }}
          >
            {pageName}
          </button>
        ))}
      </div>
      <br />
      <br />
      <br />
      {page == PageNames.UploadSong ? (
        <div>
          <h2>Upload song</h2>
          <SongCreateForm />
        </div>
      ) : page == PageNames.MySongs ? (
        <MySongs user={user} />
      ) : (
        <LikedSongsPage />
      )}
    </div>
  );
}

export default ProfilePage;
