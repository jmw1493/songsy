import { useEffect, useState } from "react";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import "./ExplorePage.css";

const client = generateClient<Schema>();

function ExplorePage() {
  const [sliderValue, setSliderValue] = useState(0);
  const [songs, setSongs] = useState<Array<Schema["Song"]["type"]>>([]);

  useEffect(() => {
    client.models.Song.observeQuery().subscribe({
      next: (data) => setSongs([...data.items]),
    });
  }, []);

  useEffect(() => {
    // fetch more songs based on slider value
    console.log("getNumOfImagesToDisplay", getNumOfImagesToDisplay());
  }, [sliderValue]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
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
    const numOfHorizontalImages =
      Math.round(window.innerWidth - padding) / imgSize;
    const numOfVerticalImages =
      Math.round(window.innerHeight - padding) / imgSize;
    return numOfHorizontalImages * numOfVerticalImages;
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
              // className="image"
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
