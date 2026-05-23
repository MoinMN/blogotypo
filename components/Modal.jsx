"use client";

import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const VARIANT = {
  danger: { icon: "fa-solid fa-triangle-exclamation", iconBg: "bg-rose-100 dark:bg-rose-500/10", iconColor: "text-rose-500 dark:text-rose-400", btn: "bg-rose-500 hover:bg-rose-600 shadow-rose-200 dark:shadow-none" },
  success: { icon: "fa-solid fa-circle-check", iconBg: "bg-emerald-100 dark:bg-emerald-500/10", iconColor: "text-emerald-500 dark:text-emerald-400", btn: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 dark:shadow-none" },
  warning: { icon: "fa-solid fa-circle-exclamation", iconBg: "bg-amber-100 dark:bg-amber-500/10", iconColor: "text-amber-500 dark:text-amber-400", btn: "bg-amber-500 hover:bg-amber-600 shadow-amber-200 dark:shadow-none" },
  default: { icon: "fa-solid fa-circle-info", iconBg: "bg-indigo-100 dark:bg-indigo-500/10", iconColor: "text-indigo-500 dark:text-indigo-400", btn: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-200 dark:shadow-none" },
};

const ModalBox = ({ showModal, setShowModal, title, body, confirmAction, actionBtn, actionBtnVariant }) => {
  const handleClose = () => setShowModal(false);
  const v = VARIANT[actionBtnVariant] || VARIANT.default;

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
      contentClassName="!bg-gray-100 dark:!bg-[#0f0f22] !border !border-gray-200 dark:!border-gray-100/[0.08] !rounded-2xl !shadow-xl overflow-hidden"
    >
      <Modal.Body className="p-5">
        <div className="flex flex-col items-center text-center gap-3">

          {/* Icon */}
          <div className={`w-11 h-11 rounded-xl ${v.iconBg} flex items-center justify-center flex-shrink-0`}>
            <i className={`${v.icon} ${v.iconColor} text-lg`} />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <h6
              className="text-sm font-bold text-gray-900 dark:text-gray-100 m-0"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {title}
            </h6>
            <p className="text-xs text-gray-500 dark:text-gray-400 m-0 leading-relaxed max-w-[240px]">
              {body}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full pt-1">
            <button
              onClick={handleClose}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-gray-100/5 hover:bg-gray-200 dark:hover:bg-gray-100/10 border border-gray-200 dark:border-gray-100/[0.08] text-gray-600 dark:text-gray-300 transition-all duration-150"
            >
              Cancel
            </button>
            <button
              onClick={() => { confirmAction?.(); handleClose(); }}
              className={`flex-1 px-3 py-2 text-xs font-semibold rounded-xl text-gray-100 shadow-sm transition-all duration-150 ${v.btn}`}
            >
              {actionBtn || "Confirm"}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalBox;