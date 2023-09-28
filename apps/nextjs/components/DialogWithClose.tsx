"use client";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Cross } from "ui/icons";

export const DialogWithClose = ({
  isOpen,
  closeModal,
  initialFocus,
  children,
  title,
  isTitleVisible = false,
}: {
  isOpen: boolean;
  closeModal: () => void;
  initialFocus: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  title: string;
  isTitleVisible?: boolean;
}) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={closeModal}
        initialFocus={initialFocus}
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
          <div className="flex h-full items-start justify-center sm:pt-8 sm:p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full sm:h-auto max-w-xl transform overflow-hidden sm:rounded-2xl bg-black p-4 text-left align-middle shadow-xl transition-all">
                <div className="flex gap-4 items-center">
                  <button
                    className="text-white p-2 rounded-full hover:bg-gray-100/10"
                    onClick={closeModal}
                  >
                    <Cross />
                    <span className="sr-only">Close</span>
                  </button>
                  <Dialog.Title
                    className={
                      isTitleVisible
                        ? `font-bold text-white text-xl`
                        : "sr-only"
                    }
                  >
                    {title}
                  </Dialog.Title>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
