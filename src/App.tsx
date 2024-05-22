import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { SongCreateForm } from "./ui-components";

// import { uploadData, getUrl } from "aws-amplify/storage";

const client = generateClient<Schema>();

function App() {
  const [songs, setSongs] = useState<Array<Schema["Song"]["type"]>>([]);

  useEffect(() => {
    client.models.Song.observeQuery().subscribe({
      next: (data) => setSongs([...data.items]),
    });
  }, []);

  // async function createSong() {
  //   const response = await client.models.Song.create({
  //     title: "new song title",
  //     songUrl: "",
  //     coverArtUrl: "",
  //   });
  //   const song = response.data;
  //   if (!song) return;

  //   // Upload the Storage file:
  //   // const result = await uploadData({
  //   //   path: `images/${song.id}-${file.name}`,
  //   //   data: file,
  //   //   options: {
  //   //     contentType: "image/png", // contentType is optional
  //   //   },
  //   // }).result;
  // }

  function deleteSong(id: string) {
    client.models.Song.delete({ id });
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Welcome {user?.signInDetails?.loginId}</h1>
          <h2>Upload song</h2>
          <SongCreateForm />
          {/* <label htmlFor="">
            <span style={{ marginRight: "10px" }}>Title</span>
            <input type="text" name="" id="" />
          </label>
          <br />
          <label htmlFor="">
            <span style={{ marginRight: "10px" }}>Audio file</span>
            <input type="file" name="" id="" />
          </label>
          <br />
          <label htmlFor="">
            <span style={{ marginRight: "10px" }}>Cover art file</span>
            <input type="file" name="" id="" />
          </label>
          <br />
          <button onClick={createSong}>Upload</button> */}
          <br />
          <br />
          <h2>My songs</h2>
          <ul>
            {songs.map((song) => (
              <li key={song.id} onClick={() => deleteSong(song.id)}>
                {song.title}
              </li>
            ))}
          </ul>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
