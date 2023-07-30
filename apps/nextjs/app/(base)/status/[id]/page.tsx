import { BackButton } from "ui/icons";
import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";

export default async function Web() {
  return (
    <div className="w-full min-h-full max-w-[600px] border-r border-solid border-gray-700">
      {/* Header */}
      <div className="h-14 w-full px-4 flex items-center">
        <div className="min-w-[56px] flex items-center">
          <button className="text-white p-2 rounded-full hover:bg-gray-100/10">
            <BackButton aria-label="Go back" />
          </button>
        </div>
        <span className="text-white text-xl font-bold">Tweet</span>
      </div>
    </div>
  );
}
