"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

type Props = {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  onConfirm: () => void;
  value: string;
  setValue: (value: string) => void;
};

export default function CustomModal({
  openModal,
  setOpenModal,
  onConfirm,
  value,
  setValue,
}: Props) {
  return (
    <Dialog open={openModal} onClose={setOpenModal} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-surface text-left shadow-xl transition-all ...">
          <div className="px-6 pt-5 pb-4">
            <DialogTitle className="text-base font-semibold text-foreground">
              Give yourself a name
            </DialogTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Please be respectful. There are kids.
            </p>

            <div className="mt-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-foreground"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter your username"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-surface-muted disabled:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border bg-surface-muted px-6 py-3 sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 sm:w-auto"
            >
              Continue
            </button>
            <button
              type="button"
              data-autofocus
              onClick={() => setOpenModal(false)}
              className="inline-flex w-full justify-center rounded-md bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-surface-muted sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
