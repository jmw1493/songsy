import { useEffect, useState } from "react";
// import { StorageImage } from "@aws-amplify/ui-react-storage";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
// import { getUrl } from "aws-amplify/storage";
import "@aws-amplify/ui-react/styles.css";
import SongWithPlaceholder from "./SongWithPlaceholder";
import { CircularProgress } from "@mui/material";

const client = generateClient<Schema>();

function MySongs() {
  const [songs, setSongs] = useState<Array<Schema["Song"]["type"]>>([]);
  const [retrievingSongs, setRetrievingSongs] = useState<boolean>(true);
  // const [audioUrls, setAudioUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    client.models.Song.observeQuery().subscribe({
      next: (data) => {
        setSongs([...data.items]);
        setRetrievingSongs(false);
      },
    });
  }, []);

  // useEffect(() => {
  //   const fetchAudioUrls = async () => {
  //     const urls: { [key: string]: string } = {};
  //     for (const song of songs) {
  //       try {
  //         const url = await getLinkToStorageFile(song.songUrl);
  //         urls[song.id] = url;
  //       } catch (error) {
  //         console.error(
  //           "Error getting URL from S3 for song",
  //           song.title,
  //           error
  //         );
  //       }
  //     }
  //     setAudioUrls(urls);
  //   };

  //   fetchAudioUrls();
  // }, [songs]);

  // async function getLinkToStorageFile(filePath: string): Promise<string> {
  //   try {
  //     const url = await getUrl({
  //       path: filePath,
  //       options: {
  //         validateObjectExistence: false, // defaults to false
  //         expiresIn: 20, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
  //         // useAccelerateEndpoint: true, // Whether to use accelerate endpoint.
  //       },
  //     });
  //     return url.url.toString();
  //   } catch (e) {
  //     console.error("Error getting URL from S3:", e);
  //     throw new Error("Could not get URL from S3");
  //   }
  // }

  // function deleteSong(id: string) {
  //   client.models.Song.delete({ id });
  // }

  return (
    <div>
      <h2>My songs</h2>
      <br />
      {retrievingSongs ? (
        <CircularProgress />
      ) : (
        songs.map((song) => {
          return <SongWithPlaceholder key={song.id} song={song} />;
          // return (
          //   <div key={song.id} className="song-container">
          //     <StorageImage alt="" path={song.coverArtUrl} className="image" />
          //     <div className="right">
          //       <p className="title">{song.title}</p>
          //       {audioUrls[song.id] ? (
          //         <audio controls src={audioUrls[song.id]}>
          //           Your browser does not support the audio element.
          //         </audio>
          //       ) : (
          //         <p>Loading audio for {song.title}...</p>
          //       )}
          //     </div>
          //   </div>
          // );
        })
      )}
    </div>
  );
}

export default MySongs;
