import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const ModalBox = ({ showModal, setShowModal, title, body, confirmAction, actionBtn, actionBtnVariant }) => {
  const handleClose = () => setShowModal(false);
  return (
    <>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className='text-xl md:text-2xl font-semibold montserrat_alternates_font'>
              {title}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span className='text-sm md:text-base'>
            {body}
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <span className='text-sm md:text-base'>
              Close
            </span>
          </Button>
          <Button variant={actionBtnVariant} onClick={confirmAction}>
            <span className='text-sm md:text-base'>
              {actionBtn}
            </span>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalBox;