"use client";
import { useParams } from "next/navigation";

const ProfileUsername = () => {
  const params = useParams();

  return <>{params.username}</>;
};

export { ProfileUsername };
