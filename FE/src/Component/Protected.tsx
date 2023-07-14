import { FC, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedProps = {
  Component: any;
};

const Protected: FC<ProtectedProps> = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  useEffect(() => {
    let login = localStorage.getItem("login");
    if (!login) {
      navigate("/login-signup");
    }
  });

  return (
    <div>
      <Component />
    </div>
  );
};

Protected.defaultProps = {};

export default memo(Protected);
