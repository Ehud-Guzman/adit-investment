// src/components/ui/select.jsx
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

export function Select({
  value,
  onChange,
  children,
  className = "",
  disabled = false
}) {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={`relative ${className}`}>{children}</div>
    </Listbox>
  );
}

export function SelectTrigger({ children, className = "" }) {
  return (
    <Listbox.Button
      className={`relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${className}`}
    >
      {children}
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
      </span>
    </Listbox.Button>
  );
}

export function SelectValue({ placeholder }) {
  return (
    <span className="block truncate capitalize text-gray-800">{placeholder}</span>
  );
}

export function SelectContent({ children }) {
  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options
        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        {children}
      </Listbox.Options>
    </Transition>
  );
}

export function SelectItem({ children, value, className = "" }) {
  return (
    <Listbox.Option
      className={({ active }) =>
        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
          active ? "bg-blue-100 text-blue-900" : "text-gray-900"
        } ${className}`
      }
      value={value}
    >
      {({ selected }) => (
        <>
          <span
            className={`block truncate capitalize ${
              selected ? "font-medium" : "font-normal"
            }`}
          >
            {children}
          </span>
          {selected && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
              <CheckIcon className="h-5 w-5" />
            </span>
          )}
        </>
      )}
    </Listbox.Option>
  );
}
