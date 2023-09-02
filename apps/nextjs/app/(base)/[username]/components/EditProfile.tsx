"use client";
import React from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { ButtonOrLink } from "components/ButtonOrLink";
import { FloatingInput, FloatingTextArea } from "ui";
import { saveProfile } from "app/actions";
import { DialogWithClose } from "components/DialogWithClose";

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
  const [useerNameAlreadyTaken, setUserNameAlreadyTaken] =
    React.useState(false);
  const [_, startTransition] = React.useTransition();
  const inputRef = React.useRef<HTMLInputElement>(null);

  function closeModal() {
    setIsOpen(false);
    setUserNameAlreadyTaken(false);
  }

  function openModal() {
    setIsOpen(true);
  }
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
        <form
          action={(formData) => {
            startTransition(async () => {
              const res = await saveProfile(formData);
              if (
                res &&
                !res.success &&
                res.error === "username_already_taken"
              ) {
                setUserNameAlreadyTaken(true);
              } else {
                closeModal();
              }
            });
          }}
          className="flex flex-col gap-5 pt-5 pb-2 px-4"
        >
          <FloatingInput
            autoFocus
            label="Name"
            id="name"
            name="name"
            required
            placeholder="John"
            maxLength={40}
            ref={inputRef}
            defaultValue={name ?? ""}
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
            defaultValue={username ?? ""}
            error={useerNameAlreadyTaken ? "Username already taken" : undefined}
          />
          <FloatingTextArea
            label="Bio"
            id="bio"
            name="bio"
            maxLength={160}
            placeholder="I'm John..."
            defaultValue={bio ?? ""}
          />
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </DialogWithClose>
    </>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <ButtonOrLink
      variant="primary"
      size="small"
      type="submit"
      disabled={pending}
    >
      Save
    </ButtonOrLink>
  );
};

export { EditProfile };
