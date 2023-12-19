import { Modal,Button } from 'react-bootstrap';

export function DeleteDeadline({ deadlineID, onSuccessfulDelete, closeDeleteModal }) {
    return (
        <>
          <Modal.Body>
          <div className="container">
            <div className="row"><h5>Are you sure you want to delete deadline?<br />This action is irreversible.</h5></div>
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => onSuccessfulDelete(deadlineID)}>Yes</Button>{' '}
            <Button variant="danger" onClick={() => closeDeleteModal(null)}>No</Button>{' '}        
          </Modal.Footer>
        </>
    );
  }