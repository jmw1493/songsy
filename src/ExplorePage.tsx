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
    event: React.MouseEvent<HTMLImageElement>
  ) {
    const rect = event.currentTarget.getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect();

    // Calculate modal position
    let top = rect.top + window.scrollY;
    let left = rect.right + window.scrollX + 10;

    // Adjust position if the song is near the edge
    if (gridRect && left + 200 > gridRect.right) {
      left = rect.left + window.scrollX - 210; // Adjust left position
    }
    if (gridRect && top + 150 > gridRect.bottom) {
      top = rect.bottom + window.scrollY - 160; // Adjust top position
    }

    setModalPosition({ top, left });
    setCurrentSong(song);
  }

  return (
    <div className={currentSong ? "overlay" : ""}>
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
        {currentSong && (
          <SongModal song={currentSong} position={modalPosition} />
        )}
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
              onMouseOver={(e) => handleSongHover(song, e)}
              onMouseLeave={() => {
                setCurrentSong(null);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ExplorePage;
