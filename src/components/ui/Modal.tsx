import { ReactNode, useEffect, useRef, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  x: number;
  y: number;
  title: string;
  onClose?: () => void;
  children: ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  x,
  y,
  title,
  children,
}: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [pos, setPos] = useState({ left: x, top: y });

  useEffect(() => {
    // Grabbing a reference to the modal in question
    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Open modal when `isOpen` changes to true
    isOpen ? modalElement.showPopover() : modalElement.hidePopover();
  }, [isOpen]);

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;

    const { offsetWidth, offsetHeight } = el;
    let newLeft = x;
    let newTop = y;

    // Adjust if near edges
    if (x + offsetWidth > window.innerWidth)
      newLeft = window.innerWidth - offsetWidth - 10;
    if (y + offsetHeight > window.innerHeight)
      newTop = window.innerHeight - offsetHeight - 10;

    setPos({ left: newLeft, top: newTop });
  }, [x, y]);

  // close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  return (
    <dialog
      ref={modalRef}
      className="z-50 rounded-lg p-4 bg-white border shadow-xl text-sm"
      onKeyDown={handleKeyDown}
      style={{
        position: "absolute",
        left: pos.left,
        top: pos.top,
      }}
      popover="auto"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800 mr-6">{title}</h3>
        <button
          className="text-md text-gray-600 cursor-pointer hover:text-black"
          onClick={handleCloseModal}
        >
          ✕
        </button>
      </div>

      {children}
    </dialog>
  );
};
