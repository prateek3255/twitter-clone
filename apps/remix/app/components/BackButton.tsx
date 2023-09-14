import { useNavigate } from "@remix-run/react";
import { BackButton as BackButtonIcon } from "ui";

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={goBack}
      aria-label="Go back"
      className="text-white p-2 rounded-full hover:bg-gray-100/10"
    >
      <BackButtonIcon />
    </button>
  );
};

export { BackButton };
