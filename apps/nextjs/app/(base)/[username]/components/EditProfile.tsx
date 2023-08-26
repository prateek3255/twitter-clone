"use client";
import React from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Cross } from "ui/icons";
import { ButtonOrLink } from "components/ButtonOrLink";
import { FloatingInput } from "components/FloatingInput";
import { FloatingTextArea } from "components/FloatingTextArea";
import { saveProfile } from "app/actions";

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
      <Transition show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModal}
          initialFocus={inputRef}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#5b708366]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start mt-4 justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-black p-4 text-left align-middle shadow-xl transition-all">
                  <div className="flex gap-4 items-center">
                    <button
                      className="text-white p-2 rounded-full hover:bg-gray-100/10"
                      onClick={closeModal}
                    >
                      <Cross aria-label="Close modal" />
                    </button>
                    <Dialog.Title className="font-bold text-white text-xl">
                      Edit Profile
                    </Dialog.Title>
                  </div>
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
                      error={
                        useerNameAlreadyTaken
                          ? "Username already taken"
                          : undefined
                      }
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
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
