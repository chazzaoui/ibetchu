import { Global } from "@emotion/react";
import React from "react";

const Fonts = () => (
  <Global
    styles={`
     @font-face {
    font-family: "Recoleta-Bold";
    src: url("../../public/fonts/Recoleta-Bold.ttf") format("truetype");
}

@font-face {
    font-family: "Inter-SemiBold";
    src: url("../../public/fonts/Inter-SemiBold.ttf") format("truetype");
}

@font-face {
    font-family: "Recoleta-SemiBold";
    src: url("../../public/fonts/Recoleta-SemiBold.ttf") format("truetype");
}

@font-face {
    font-family: "Inter-Regular";
    src: url("../../public/fonts/Inter-Regular.ttf") format("truetype");
}
      `}
  />
);

export default Fonts;
