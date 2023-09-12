import { Spinner } from "ui";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
