import Modal from "./Modal";
import "./ConfirmModal.css";

function ConfirmModal({ title, message, confirmLabel = "Confirm", danger, onConfirm, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div className="confirm-modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-modal-actions">
          <button className="confirm-cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className={"confirm-ok-btn" + (danger ? " confirm-ok-danger" : "")}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;