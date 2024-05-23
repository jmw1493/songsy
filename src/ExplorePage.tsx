import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useState } from "react";

function ExplorePage() {
  const [sliderValue, setSliderValue] = useState(0);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  return (
    <div>
      <section>
        <Box sx={{ width: 200 }}>
          <Slider value={sliderValue} onChange={handleSliderChange} />
        </Box>
      </section>
    </div>
  );
}

export default ExplorePage;
