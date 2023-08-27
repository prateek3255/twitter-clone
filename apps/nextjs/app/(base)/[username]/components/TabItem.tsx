'use client';
import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";

const TabItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const segment = href.split("/")[2];
  const isActive = selectedLayoutSegment === segment || (segment === undefined && selectedLayoutSegment === null);

  return (
    <Link
      href={href}
      role="tab"
      aria-selected={isActive}
      className="min-w-[56px] w-full flex justify-center hover:bg-gray-100/10"
    >
      <div
        className={`py-4 text-sm relative ${
          isActive ? "font-bold text-white" : "font-semibold text-gray-500"
        }`}
      >
        {children}
        {isActive && (
          <div className="absolute bottom-0 bg-primary-blue h-1 w-full rounded-full" />
        )}
      </div>
    </Link>
  );
};

export { TabItem };
