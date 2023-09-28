"use client";
import React from "react";
import { ButtonOrLink } from "components/ButtonOrLink";
import { toggleFollowUser } from "app/actions";

export const FollowButton = ({
  isFollowing,
  profileUserId,
}: {
  isFollowing: boolean;
  profileUserId: string;
}) => {
  const [isHoveringOnFollowing, setIsHoveringOnFollowing] =
    React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleUnfollow = () => {
    startTransition(async () => {
      await toggleFollowUser({ userId: profileUserId, isFollowing: false });
    });
  };

  if (isFollowing) {
    if (isHoveringOnFollowing) {
      return (
        <ButtonOrLink
          variant="tertiary-danger"
          onMouseLeave={() => setIsHoveringOnFollowing(false)}
          disabled={isPending}
          onClick={handleUnfollow}
        >
          Unfollow
        </ButtonOrLink>
      );
    }
    return (
      <ButtonOrLink
        variant="tertiary"
        onMouseEnter={() => setIsHoveringOnFollowing(true)}
        disabled={isPending}
        onClick={handleUnfollow}
      >
        Following
      </ButtonOrLink>
    );
  }

  return (
    <ButtonOrLink
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleFollowUser({ userId: profileUserId, isFollowing: true });
        });
      }}
      variant="secondary"
    >
      Follow
    </ButtonOrLink>
  );
};

