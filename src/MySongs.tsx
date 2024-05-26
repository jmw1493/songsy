import { useEffect, useState } from "react";
// import { StorageImage } from "@aws-amplify/ui-react-storage";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
// import { getUrl } from "aws-amplify/storage";
import { AuthUser } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import SongWithPlaceholder from "./SongWithPlaceholder";
import { CircularProgress } from "@mui/material";
import "./MySongs.css";

const client = generateClient<Schema>();

type MySongsProps = {
  user: AuthUser | undefined;
};

function MySongs({ user }: MySongsProps) {
  const [songs, setSongs] = useState<Array<Schema["Song"]["type"]>>([]);
  const [retrievingSongs, setRetrievingSongs] = useState<boolean>(true);

  useEffect(() => {
    client.models.Song.observeQuery({
      filter: {
        owner: {
          contains: user?.userId, // "eq" didn't work
        },
      },
    }).subscribe({
      next: (data) => {
        const sortedSongs = data.items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSongs(sortedSongs);
        setRetrievingSongs(false);
      },
    });
  }, [user]);

  return (
    <div className="my-songs-container">
      <h2>My Songs</h2>
      <br />
      <br />
      {retrievingSongs ? (
        <CircularProgress />
      ) : songs.length > 0 ? (
        songs.map((song) => {
          return <SongWithPlaceholder key={song.id} song={song} />;
        })
      ) : (
        <div>
          <p>You don't have any songs.</p>
        </div>
      )}
    </div>
  );
}

export default MySongs;
