import { LoadingIndicator } from "./icons";

const Spinner = () => {
  return (
    <div className="w-full py-4 px-3 flex justify-center">
      <div
        role="progressbar"
        aria-label="Loading..."
        aria-valuemax={1}
        aria-valuemin={0}
        aria-valuenow={0}
        className="w-6 h-6 animate-spin"
      >
        <LoadingIndicator />
      </div>
    </div>
  );
};

export { Spinner };
