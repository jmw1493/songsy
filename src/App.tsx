import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { SongCreateForm } from "./ui-components";
import { getUrl } from "aws-amplify/storage";
import "@aws-amplify/ui-react/styles.css";

// import { uploadData, getUrl } from "aws-amplify/storage";

const client = generateClient<Schema>();

function App() {
  const [songs, setSongs] = useState<Array<Schema["Song"]["type"]>>([]);
  const [audioUrls, setAudioUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    client.models.Song.observeQuery().subscribe({
      next: (data) => setSongs([...data.items]),
    });
  }, []);

  useEffect(() => {
    const fetchAudioUrls = async () => {
      const urls: { [key: string]: string } = {};
      for (const song of songs) {
        try {
          const url = await getLinkToStorageFile(song.songUrl);
          urls[song.id] = url;
        } catch (error) {
          console.error(
            "Error getting URL from S3 for song",
            song.title,
            error
          );
        }
      }
      console.log("audioUrls", urls);
      setAudioUrls(urls);
    };

    fetchAudioUrls();
  }, [songs]);

  async function getLinkToStorageFile(filePath: string): Promise<string> {
    try {
      const url = await getUrl({
        path: filePath,
        options: {
          validateObjectExistence: false, // defaults to false
          expiresIn: 20, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
          // useAccelerateEndpoint: true, // Whether to use accelerate endpoint.
        },
      });
      return url.url.toString();
    } catch (e) {
      console.error("Error getting URL from S3:", e);
      throw new Error("Could not get URL from S3");
    }
  }

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

  // function deleteSong(id: string) {
  //   client.models.Song.delete({ id });
  // }

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
          {/* <ul> */}
          {songs.map((song) => {
            return (
              // <li
              //   key={song.id}
              //   // onClick={() => deleteSong(song.id)}
              // >
              <div key={song.id}>
                <p>{song.title}</p>
                <StorageImage
                  alt=""
                  path={song.coverArtUrl}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "contain",
                    background: "black",
                  }}
                />
                {audioUrls[song.id] ? (
                  <audio controls src={audioUrls[song.id]}>
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <p>Loading audio for {song.title}...</p>
                )}
              </div>
              // </li>
            );
          })}
          {/* </ul> */}
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
