import { SongCreateForm } from "./ui-components";
import { AuthUser } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import MySongs from "./MySongs";
import { useState } from "react";

type ProfilePageProps = {
  user: AuthUser | undefined;
};

function ProfilePage({ user }: ProfilePageProps) {
  const [page, setPage] = useState("upload-song");
  return (
    <div>
      <button
        onClick={() =>
          setPage(page === "upload-song" ? "my-songs" : "upload-song")
        }
      >
        {page === "upload-song" ? "My Songs →" : "Upload Song →"}
      </button>
      <br />
      <br />
      <br />
      {page == "upload-song" ? (
        <div>
          <h2>Upload song</h2>
          <SongCreateForm />
        </div>
      ) : (
        <MySongs user={user} />
      )}
    </div>
  );
}

export default ProfilePage;
