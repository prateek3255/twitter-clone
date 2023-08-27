"use client";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

const NavItem = ({
  children,
  icon,
  href,
  activeIcon,
}: {
  children?: React.ReactNode;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  href: string;
}) => {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const isActive = `/${selectedLayoutSegment}` === href || (href === "/" && selectedLayoutSegment === null);
  return (
    <Link
      href={href}
      className={`flex p-3 gap-5 items-center rounded-full text-xl text-white hover:bg-gray-100/10 w-fit px-4 sm:px-3 sm:pr-5 ${isActive ? "font-bold" : ""}`}
    >
      {isActive ? activeIcon : icon}
      {children}
    </Link>
  );
};

export { NavItem };
