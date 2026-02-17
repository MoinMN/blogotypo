"use client";

import AlertBox from "@components/Alert";
import ModalBox from "@components/Modal";
import { createContext, useContext, useState, useCallback } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  // ALERT STATE
  const [alertState, setAlertState] = useState({
    show: false,
    variant: "success",
    header: "",
    dismissible: true,
    position: "top-right-with-space",
  });

  // MODAL STATE
  const [modalState, setModalState] = useState({
    show: false,
    title: "",
    body: "",
    actionBtn: "",
    actionBtnVariant: "primary",
    confirmAction: null,
  });

  // 🔔 SHOW ALERT
  const showAlert = useCallback(
    (message, variant = "success", position = "top-right-with-space", dismissible = true) => {
      setAlertState({
        show: true,
        header: message,
        variant,
        dismissible,
        position,
      });
    }, []);

  // 📦 SHOW MODAL
  const showModal = useCallback((config) => {
    setModalState({
      show: true,
      ...config,
    });
  }, []);

  const hideModal = () => {
    setModalState((prev) => ({ ...prev, show: false }));
  };

  return (
    <UIContext.Provider value={{ showAlert, showModal }}>
      {children}

      {/* GLOBAL ALERT */}
      <AlertBox
        show={alertState.show}
        setShow={(val) =>
          setAlertState((prev) => ({ ...prev, show: val }))
        }
        variant={alertState.variant}
        dismissible={alertState.dismissible}
        header={alertState.header}
        position={alertState.position}
      />

      {/* GLOBAL MODAL */}
      <ModalBox
        showModal={modalState.show}
        setShowModal={hideModal}
        title={modalState.title}
        body={modalState.body}
        actionBtn={modalState.actionBtn}
        actionBtnVariant={modalState.actionBtnVariant}
        confirmAction={async () => {
          if (modalState.confirmAction) {
            await modalState.confirmAction();
          }
          hideModal();
        }}
      />
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
