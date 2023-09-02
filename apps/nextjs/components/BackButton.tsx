'use client';
import { BackButton as BackButtonIcon } from "ui/icons";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
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
