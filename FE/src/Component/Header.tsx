import { FC, memo } from "react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {};

const Header: FC<HeaderProps> = (props) => {
  const naviagate = useNavigate();
  return (
    <div className="flex justify-between">
      <h1 className="text-3xl text-white font-bold">My Awesome Notes App</h1>
      <button
        className="text-3xl text-white font-bold"
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
