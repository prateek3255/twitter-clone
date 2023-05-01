import { BackButton } from "ui/icons";

export default function Profile() {
  return (
    <div className="w-full max-w-2xl">
      <div className="h-14 w-full px-4 flex items-center">
        <div className=" min-w-[56px] flex items-center">
          <button className="text-white p-2 rounded-full hover:bg-gray-100/10">
            <BackButton aria-label="Go back" />
          </button>
        </div>
        <div className="flex flex-col">
            <span className="text-white text-xl font-bold">Prateek Surana</span>
            <span className="text-gray-500 text-sm">1,153 Tweets</span>
          </div>
      </div>
    </div>
  );
}
