import { FC, memo, useState } from "react";
import ClosedEyeIcon from "../assets/ClosedEyeIcon.png";
import OpenEyeIcon from "../assets/OpenEyeIcon.png";

type PasswordInputProps = {
  value: string | number | readonly string[] | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
};

const PasswordInput: FC<PasswordInputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex relative">
      <input
        name="password"
        value={props.value}
        onChange={props.onChange}
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        className="bg-gray-200 w-full rounded py-2 px-4 mb-4 text-gray-800"
      />
      <button type="button" onClick={() => setShowPassword(!showPassword)}>
        <img
          alt="Eye Icon"
          src={showPassword ? OpenEyeIcon : ClosedEyeIcon}
          className="absolute w-6 right-2 bottom-5"
        />
      </button>
    </div>
  );
};

PasswordInput.defaultProps = {};

export default memo(PasswordInput);
