import Modal from 'react-bootstrap/Modal';

// 更灵活的 ModalInfo 组件
function ModalInfo({ title, children, show, handleClose }) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    );
  }
  

export default ModalInfo;
