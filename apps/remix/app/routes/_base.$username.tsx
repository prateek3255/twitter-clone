import React from "react";
import {
  Link,
  useLoaderData,
  Form,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
  Outlet,
  useLocation,
  useActionData,
} from "@remix-run/react";
import { type LoaderArgs, json, type ActionArgs, redirect } from "@remix-run/node";
import { FloatingInput, FloatingTextArea } from "ui";
import {
  getCurrentLoggedInUser,
  getUserProfile,
  saveProfile,
  toggleFollowUser,
} from "~/utils/user.server";
import { DEFAULT_PROFILE_IMAGE } from "~/constants/user";
import { BackButton } from "~/components/BackButton";
import { ButtonOrLink } from "~/components/ButtonOrLink";
import { DialogWithClose } from "~/components/DialogWithClose";

export const loader = async ({ request, params }: LoaderArgs) => {
  const [user, currentLoggedInUser] = await Promise.all([
    getUserProfile(params.username as string, request),
    getCurrentLoggedInUser(request),
  ]);

  if (!user) {
    throw json(
      { error: "User not found", username: params.username },
      { status: 404 }
    );
  }
  return json({ user, currentLoggedInUser }, { status: 200 });
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const profileUserId = form.get("profileUserId")?.toString() ?? "";
  const action = form.get("_action")?.toString() ?? "";

  if (action === "follow" || action === "unfollow") {
    return await toggleFollowUser({
      userId: profileUserId,
      isFollowing: action === "follow",
      request,
    });
  }

  if (action === "update-profile") {
    const name = form.get("name")?.toString() ?? "";
    const username = form.get("username")?.toString() ?? "";
    const bio = form.get("bio")?.toString() ?? "";

    const response = await saveProfile(request, {
      name,
      username,
      bio,
    });

    if ("success" in response && !response.success) {
      return json(
        {
          success: false,
          fields: {
            name,
            username,
            bio,
          },
          fieldErrors: {
            name: null,
            username:
              response.error === "username_already_taken"
                ? "Username already taken"
                : null,
            bio: null,
          },
        },
        {
          status: 400,
        }
      );
    }
    if ("success" in response && response.success && response.shouldRedirect) {
      return redirect(`/${username}`, 302);
    }
  }

  return json({ success: true }, { status: 200 });
};

export default function Profile() {
  const { user, currentLoggedInUser } = useLoaderData<typeof loader>();
  const isLoggedInUserFollowingProfile =
    user?.followers?.find(({ id }) => id === currentLoggedInUser?.id) !==
    undefined;
  const isCurrentUser = currentLoggedInUser?.username === user?.username;

  return (
    <>
      {/* Header */}
      <div className="h-14 w-full px-4 flex gap-5 items-center">
        <BackButton />
        <div className="flex flex-col">
          <span className="text-white text-xl font-bold">
            {user?.name ?? user?.username ?? "Profile"}
          </span>

          <span className="text-gray-500 text-sm">
            {user._count.tweets} Tweets
          </span>
        </div>
      </div>
      {/* Cover Image */}
      <div className="max-w-[600px] w-full h-[200px] bg-gradient-to-r from-cyan-500 to-blue-500" />

      <div className="relative pt-3 px-4">
        <div className="absolute top-[-67px] left-4">
          {/* Profile Image */}
          <img
            src={user?.profileImage ?? DEFAULT_PROFILE_IMAGE}
            className="rounded-full object-contain max-h-[134px] border-4 border-solid border-black"
            width={134}
            height={134}
            alt={`${user.username}'s avatar`}
          />
        </div>
        <div className=" h-[67px] flex w-full justify-end items-start">
          {isCurrentUser ? (
            <EditProfile
              username={user.username}
              bio={user.bio}
              name={user.name}
            />
          ) : (
            <FollowButton
              profileUserId={user.id}
              isFollowing={isLoggedInUserFollowingProfile}
            />
          )}
        </div>
        {/* Name */}
        <div className="flex flex-col mb-3">
          <span className="text-white text-xl font-extrabold">
            {user?.name}
          </span>

          <span className="text-gray-500 text-sm">@{user.username}</span>
        </div>
        {user && <UserProfileDetails userProfile={user} />}
      </div>
      <Outlet />
    </>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();

  console.log(error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <>
        <div className="h-14 w-full px-4 flex gap-5 items-center">
          <BackButton />
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold">Profile</span>
          </div>
        </div>

        <div className="max-w-[600px] w-full h-[200px] bg-gray-700" />

        <div className="relative pt-3 px-4">
          <div className="absolute top-[-67px] left-4">
            <div className="rounded-full bg-gray-800 h-[134px] w-[134px] border-4 border-solid border-black" />
          </div>
          <div className="h-[67px]" />
          <div className="flex flex-col mb-3">
            <span className="text-white text-xl font-extrabold">
              @{error.data.username}
            </span>
          </div>

          <div className="flex flex-col gap-2 max-w-[330px] mx-auto mt-16">
            <span className="text-white text-3xl font-extrabold">
              This account doesn’t exist
            </span>
            <span className="text-gray-500 text-sm">
              Try searching for another.
            </span>
          </div>
        </div>
      </>
    );
  }

  throw error;
};

const FollowButton = ({
  isFollowing,
  profileUserId,
}: {
  isFollowing: boolean;
  profileUserId: string;
}) => {
  const [isHoveringOnFollowing, setIsHoveringOnFollowing] =
    React.useState(false);
  const navigation = useNavigation();

  return (
    <Form method="post">
      <input type="hidden" name="profileUserId" value={profileUserId} />
      {isFollowing ? (
        <ButtonOrLink
          variant={isHoveringOnFollowing ? "tertiary-danger" : "tertiary"}
          onMouseEnter={() => setIsHoveringOnFollowing(true)}
          onMouseLeave={() => setIsHoveringOnFollowing(false)}
          name="_action"
          value="unfollow"
          type="submit"
          disabled={navigation.state === "submitting"}
        >
          {isHoveringOnFollowing ? "Unfollow" : "Following"}
        </ButtonOrLink>
      ) : (
        <ButtonOrLink
          variant="secondary"
          name="_action"
          value="follow"
          type="submit"
          disabled={navigation.state === "submitting"}
        >
          Follow
        </ButtonOrLink>
      )}
    </Form>
  );
};

const FollowCount = ({ count, label }: { count: number; label: string }) => (
  <a href="#" className="hover:underline decoration-white">
    <span className="text-white font-bold text-sm">{count} </span>
    <span className="text-gray-500 text-sm">{label}</span>
  </a>
);

const TabItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
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

type UserProfile = Omit<
  NonNullable<Awaited<ReturnType<typeof getUserProfile>>>,
  "createdAt"
>;

const UserProfileDetails = ({ userProfile }: { userProfile: UserProfile }) => {
  return (
    <>
      {/* Bio */}
      <div>
        <span className="text-white text-sm">{userProfile.bio}</span>
      </div>
      {/* Follower/Following count */}
      <div className="flex gap-5 mt-3">
        <FollowCount count={userProfile._count.following} label="Following" />
        <FollowCount count={userProfile._count.followers} label="Followers" />
      </div>
      {/** Tab bars */}
      <div
        role="tablist"
        className="flex mt-3 border-b border-solid border-gray-700 mx-[-16px]"
      >
        <TabItem href={`/${userProfile.username}`}>Tweets</TabItem>
        <TabItem href={`/${userProfile.username}/replies`}>Replies</TabItem>
        <TabItem href={`/${userProfile.username}/likes`}>Likes</TabItem>
      </div>
    </>
  );
};

const EditProfile = ({
  username,
  name,
  bio,
}: {
  username: string;
  name?: string | null;
  bio?: string | null;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const actionData = useActionData<
    | { success: true }
    | {
        success: false;
        fields: {
          name: string;
          username: string;
          bio: string;
        };
        fieldErrors: {
          name: string | null;
          username: string | null;
          bio: string | null;
        };
      }
  >();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  React.useEffect(() => {
    if (!isLoading && actionData?.success !== false) {
      closeModal();
    }
  }, [isLoading, actionData?.success]);

  return (
    <>
      <ButtonOrLink onClick={openModal} variant="tertiary">
        Edit profile
      </ButtonOrLink>
      <DialogWithClose
        isOpen={isOpen}
        closeModal={closeModal}
        initialFocus={inputRef}
        title="Edit profile"
        isTitleVisible
      >
        <Form method="post" className="flex flex-col gap-5 pt-5 pb-2 px-4">
          <FloatingInput
            autoFocus
            label="Name"
            id="name"
            name="name"
            required
            placeholder="John"
            maxLength={40}
            ref={inputRef}
            defaultValue={
              actionData?.success === false
                ? actionData?.fields?.name ?? ""
                : name ?? ""
            }
          />
          <FloatingInput
            label="Username"
            id="username"
            name="username"
            placeholder="johndoe"
            minLength={2}
            maxLength={15}
            pattern="^[a-zA-Z0-9_]{1,15}$"
            required
            defaultValue={
              actionData?.success === false
                ? actionData?.fields?.username ?? ""
                : username ?? ""
            }
            error={
              actionData?.success === false
                ? actionData?.fieldErrors?.username ?? undefined
                : undefined
            }
            aria-invalid={Boolean(
              actionData?.success === false
                ? actionData?.fieldErrors?.username
                : undefined
            )}
            aria-errormessage={
              actionData?.success === false
                ? actionData?.fieldErrors?.username ?? undefined
                : undefined
            }
          />
          <FloatingTextArea
            label="Bio"
            id="bio"
            name="bio"
            maxLength={160}
            placeholder="I'm John..."
            defaultValue={
              actionData?.success === false
                ? actionData?.fields?.bio ?? ""
                : bio ?? ""
            }
          />
          <div className="flex justify-end">
            <ButtonOrLink
              variant="primary"
              size="small"
              type="submit"
              name="_action"
              value="update-profile"
              disabled={isLoading}
            >
              Save
            </ButtonOrLink>
          </div>
        </Form>
      </DialogWithClose>
    </>
  );
};
