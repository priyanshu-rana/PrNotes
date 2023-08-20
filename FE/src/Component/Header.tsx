import { FC, memo } from "react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {};

const Header: FC<HeaderProps> = (props) => {
  const naviagate = useNavigate();
  return (
    <div className="flex justify-between">
      <h1 className="text-xl md:text-3xl text-violet-200 font-bold">
        PR's NotesApp
      </h1>
      <button
        className="text-xl md:text-3xl text-violet-200 font-bold"
        onClick={() => {
          localStorage.removeItem("login");
          naviagate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

Header.defaultProps = {};

export default memo(Header);
