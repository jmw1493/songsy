import { useEffect, useRef, useState } from "react";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { AuthUser } from "aws-amplify/auth";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import "./ExplorePage.css";
import SongModal from "./SongModal";

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
  const [currentSong, setCurrentSong] = useState<Schema["Song"]["type"] | null>(
    null
  );
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

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

  function oneImagePerRow(): boolean {
    const imgPx = getImgPx();
    const gap = getGap();
    const imgSize = imgPx + gap;
    const padding = 40;
    const numOfHorizontalImages = Math.round(
      (window.innerWidth - padding) / imgSize
    );
    return numOfHorizontalImages === 1;
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

  function handleSongHover(
    song: Schema["Song"]["type"],
    event: React.MouseEvent<HTMLDivElement>
  ) {
    const rect = event.currentTarget.getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect();

    const gridRectTop = gridRect?.top || 0;
    const gridRectLeft = gridRect?.left || 0;

    let top = rect.top - gridRectTop;
    let left = rect.right - gridRectLeft;

    if (oneImagePerRow()) {
      left = gridRectLeft;
    } else {
      // Adjust position if the song is near the edge
      const widthOfModal = 340;
      const heightOfModal = 170;
      if (gridRect && left + widthOfModal > gridRect.right) {
        left = rect.left + window.scrollX - gridRectLeft - widthOfModal; // Adjust left position
      }
      if (gridRect && top + heightOfModal > window.innerHeight) {
        top = top - heightOfModal; // Adjust top position
      }
    }

    setModalPosition({ top, left });
    setCurrentSong(song);
  }

  return (
    <div
    // className={currentSong ? "overlay" : ""}
    >
      <h2>Explore</h2>
      <section className="slider-container">
        <Box sx={{ width: 200 }}>
          <Slider value={sliderValue} onChange={handleSliderChange} />
        </Box>
      </section>
      <div
        className="songs-grid"
        ref={gridRef}
        style={{
          gap: getGap(),
        }}
      >
        {songs.map((song) => {
          const size = getImgPx();
          return (
            <div
              key={song.id}
              onMouseOver={(e) => handleSongHover(song, e)}
              onMouseLeave={() => {
                setCurrentSong(null);
              }}
            >
              {currentSong && currentSong.id === song.id && (
                <SongModal
                  song={currentSong}
                  position={modalPosition}
                  userId={user?.userId}
                />
              )}
              <StorageImage
                alt=""
                path={song.coverArtUrl}
                style={{
                  width: size,
                  height: size,
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExplorePage;
