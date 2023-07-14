import { FC, memo } from "react";

type HomePageProps = {};

const HomePage: FC<HomePageProps> = (props) => {
  return (
    <div>
      <h1>This is home page</h1>
    </div>
  );
};

HomePage.defaultProps = {};

export default memo(HomePage);
