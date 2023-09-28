"use client";
import { useParams } from "next/navigation";

export const ProfileUsername = () => {
  const params = useParams();

  return <>{params.username}</>;
};
