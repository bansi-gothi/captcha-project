import React from "react";

import ImageCaptcha from "./component/ImageCaptcha";
import TextBasedCaptcha from "./component/TextCaptcha";

const App = () => {
  return (
    <div className="captch-wrapper">
      <ImageCaptcha />
      <TextBasedCaptcha />
    </div>
  );
};
export default App;
