import FormConfirmation from "./FormConfirmation";
import SongCreateForm from "./ui-components/SongCreateForm";
import { useState } from "react";

function UploadSongPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  console.log(showConfirmation);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>Upload Song</h2>
      {showConfirmation ? (
        <FormConfirmation setShowConfirmation={setShowConfirmation} />
      ) : (
        <SongCreateForm onSuccess={() => setShowConfirmation(true)} />
      )}
    </div>
  );
}

export default UploadSongPage;
