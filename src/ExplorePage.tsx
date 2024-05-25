import { useEffect, useState } from "react";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { AuthUser } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import "./ExplorePage.css";

const client = generateClient<Schema>();

type ExplorePageProps = {
  user: AuthUser | undefined;
};

function ExplorePage({ user }: ExplorePageProps) {
  const [sliderValue, setSliderValue] = useState(0);
  const [songs, setSongs] = useState<Array<Schema["Song"]["type"]>>([]);
  const [oldNextToken, setOldNextToken] = useState<string | null | undefined>(
    undefined
  );
  const [numOfImagesToDisplay, setNumOfImagesToDisplay] = useState(0);

  let audio = new Audio();

  function setSongPlayingUrl(url: string) {
    audio = new Audio(url);
    audio.play();
  }

  useEffect(() => {
    fetchNewSongs();
  }, [sliderValue]);

  async function fetchNewSongs() {
    const newNumOfImagesToDisplay = getNumOfImagesToDisplay();
    if (
      oldNextToken !== null &&
      newNumOfImagesToDisplay > numOfImagesToDisplay
    ) {
      const {
        data: newSongs,
        nextToken, // Repeat this API call with the nextToken until the returned nextToken is `null`
      } = await client.models.Song.list({
        filter: {
          owner: {
            notContains: user?.userId,
          },
        },
        limit: newNumOfImagesToDisplay - numOfImagesToDisplay, // default value is 100
        nextToken: oldNextToken, // previous nextToken
      });
      setOldNextToken(nextToken);
      setNumOfImagesToDisplay(newNumOfImagesToDisplay);
      setSongs(songs.concat(newSongs));
    }
  }

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  function getImgPx(): number {
    return 300 - (sliderValue / 100) * 290;
  }

  function getGap(): number {
    return 16 - (sliderValue / 100) * 15;
  }

  function getNumOfImagesToDisplay(): number {
    const imgPx = getImgPx();
    const gap = getGap();
    const imgSize = imgPx + gap;
    const padding = 40;
    const numOfHorizontalImages = Math.round(
      (window.innerWidth - padding) / imgSize
    );
    const numOfVerticalImages = Math.round(
      (window.innerHeight - padding) / imgSize
    );
    return (
      numOfHorizontalImages * numOfVerticalImages + numOfHorizontalImages + 1
    );
  }

  async function playAudio(song: Schema["Song"]["type"]) {
    try {
      const newUrl = await getLinkToStorageFile(song.songUrl);
      setSongPlayingUrl(newUrl);
    } catch (error) {
      console.error("Error getting URL from S3 for song", song.title, error);
    }
  }

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

  return (
    <div>
      <section className="slider-container">
        <Box sx={{ width: 200 }}>
          <Slider value={sliderValue} onChange={handleSliderChange} />
        </Box>
      </section>
      <div
        className="songs-grid"
        style={{
          gap: getGap(),
        }}
      >
        {songs.map((song) => {
          const size = getImgPx();
          return (
            <StorageImage
              key={song.id}
              alt=""
              path={song.coverArtUrl}
              style={{
                width: size,
                height: size,
                objectFit: "cover",
              }}
              onMouseOver={() => {
                playAudio(song);
              }}
              onMouseLeave={() => {
                audio.pause();
              }}
            />
          );
        })}
        {/* <div key={song.id} className="song-container">
          <StorageImage alt="" path={song.coverArtUrl} className="image" />
          <div className="right">
            <p className="title">{song.title}</p>
            {audioUrls[song.id] ? (
              <audio controls src={audioUrls[song.id]}>
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p>Loading audio for {song.title}...</p>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default ExplorePage;
