import { SongCreateForm } from "./ui-components";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import MySongs from "./MySongs";
import { useState } from "react";

function ProfilePage() {
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
        <MySongs />
      )}
    </div>
  );
}

export default ProfilePage;
