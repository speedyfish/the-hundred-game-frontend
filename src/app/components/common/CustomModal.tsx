"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  value: string;
  setValue: (value: string) => void;
};

export default function CustomModal({
  open,
  setOpen,
  onConfirm,
  value,
  setValue,
}: Props) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all data-closed:translate-y-2 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
        >
          {/* Content */}
          <div className="px-6 pt-5 pb-4">
            <DialogTitle className="text-base font-semibold text-gray-900">
              Give yourself a name
            </DialogTitle>

            <p className="mt-1 text-sm text-gray-500">
              Please be respectful. There are kids.
            </p>

            <div className="mt-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter your username"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50 px-6 py-3 sm:flex-row-reverse">
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
              onClick={() => setOpen(false)}
              className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
