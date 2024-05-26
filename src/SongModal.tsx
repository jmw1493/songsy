import { useEffect, useRef, useState } from "react";
import { getUrl } from "aws-amplify/storage";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { createLike, deleteLike } from "./ui-components/graphql/mutations";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./SongModal.css";

const client = generateClient();

type SongModalProps = {
  song: Schema["Song"]["type"];
  position: { top: number; left: number };
  userId: string | undefined;
};

function SongModal({ song, position, userId }: SongModalProps) {
  const [favorited, setFavorited] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    async function playAudio() {
      if (song && audioRef.current) {
        try {
          const newUrl = await getLinkToStorageFile(song.songUrl);
          if (isMountedRef.current && audioRef.current) {
            audioRef.current.src = newUrl;
            audioRef.current.load();
            audioRef.current.play().catch(() => {
              // ignore errors
            });
          }
        } catch (error) {
          console.error(
            "Error getting URL from S3 for song",
            song.title,
            error
          );
        }
      }
    }

    playAudio();

    return () => {
      isMountedRef.current = false;
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  });

  useEffect(() => {
    async function checkAlreadyFavorited() {
      const favoritedAlready = false; // replace with query
      setFavorited(favoritedAlready);
    }
    checkAlreadyFavorited();
  });

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

  async function likeSong() {
    try {
      const input = { songId: song.id, userId: userId };
      await client.graphql({
        query: createLike,
        variables: {
          input,
        },
      });
    } catch (e) {
      console.error("Error liking song: ", e);
    }
  }

  async function unlikeSong() {
    try {
      const input = { songId: song.id, userId: userId };
      await client.graphql({
        query: deleteLike,
        variables: {
          input,
        },
      });
    } catch (e) {
      console.error("Error liking song: ", e);
    }
  }

  if (!song) return null;

  return (
    <div
      className="song-modal"
      style={{ top: position.top, left: position.left }}
    >
      <div className="image-container">
        <StorageImage alt="" path={song.coverArtUrl} />
      </div>
      <div className="right">
        {favorited ? (
          <FavoriteIcon onClick={unlikeSong} />
        ) : (
          <FavoriteBorderIcon onClick={likeSong} />
        )}
        <b>{song.title}</b>
        <audio ref={audioRef} controls />
      </div>
    </div>
  );
}

export default SongModal;
