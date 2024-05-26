import { useEffect, useState } from "react";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import type { Schema } from "../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import "@aws-amplify/ui-react/styles.css";
import LazyLoad from "react-lazyload";

type ExpectedProps = {
  song: Schema["Song"]["type"];
};

const client = generateClient<Schema>();

function SongWithPlaceholder({ song }: ExpectedProps) {
  // const [imageIsLoading, setImageIsLoading] = useState<boolean>(true);
  const [audioUrl, setAudioUrl] = useState<string>("");

  useEffect(() => {
    const fetchAudioUrl = async () => {
      let url = "";
      try {
        url = await getLinkToStorageFile(song.songUrl);
      } catch (error) {
        console.error("Error getting URL from S3 for song", song.title, error);
      }
      setAudioUrl(url);
    };

    fetchAudioUrl();
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

  function deleteSong(id: string) {
    client.models.Song.delete({ id });
  }

  return (
    <div key={song.id} className="song-container">
      {/* {imageIsLoading ? (
        <div className="image-placeholder">image placeholder</div>
      ) : ( */}
      <LazyLoad height={200} offset={100} className="image-container">
        <StorageImage
          alt=""
          path={song.coverArtUrl}
          className="image"
          // onLoad={() => setImageIsLoading(false)}
        />
      </LazyLoad>
      {/* )} */}
      <div className="right">
        <button onClick={() => deleteSong(song.id)}>X</button>
        <p className="title">{song.title}</p>
        {audioUrl.length ? (
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p>Loading audio...</p>
        )}
      </div>
    </div>
  );
}

export default SongWithPlaceholder;
