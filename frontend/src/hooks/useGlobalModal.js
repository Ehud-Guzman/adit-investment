// src/hooks/useGlobalModal.js
import { useState, useCallback } from "react";

export const useGlobalModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // e.g. "edit-setting"
  const [modalData, setModalData] = useState(null); // payload: item, ID, etc.

  const openModal = useCallback((type, data = null) => {
    setModalType(type);
    setModalData(data);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalType(null);
    setModalData(null);
  }, []);

  return {
    isOpen,
    modalType,
    modalData,
    openModal,
    closeModal,
  };
};
