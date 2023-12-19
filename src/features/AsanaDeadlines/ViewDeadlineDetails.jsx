import React from 'react';
import { Modal, ModalBody } from 'react-bootstrap';
import { HiCheckCircle , HiXCircle } from 'react-icons/hi2';
import styles from './AsanaDeadlines.module.css';

export function ViewDeadlineDetails( { deadline  }) {

  return (
    <>
    <Modal.Body>
    <div className='container'>
      <div className='row'>
        <div className='col-5'>
            {!deadline.thumb && <img width='300' src='./src/imgs/noimage.jpg' />}
            {deadline.thumb && <img width='300' src={deadline.thumb} />}
        </div>
        <div className='col-7'><h1>{deadline.name}</h1><p className='text-justify'>{deadline.html_notes.replace(/<[^>]+>/g, '')}</p></div>
      </div>
      <div className='row mt-4'>  
        <div className='col-3'><strong>Asignee: </strong>{deadline.assignee[0].name}</div>
        <div className='col-3'><strong>Due on: </strong>{deadline.due_on}</div>
        <div className='col-3'><strong>Days left: </strong><span className={((deadline.days_remaining<0) ? styles.redDaysLeft : styles.greenDaysLeft)}>{deadline.days_remaining} days</span></div>
        <div className='col-3'><strong>Completed: </strong>{(deadline.completed) ? <HiCheckCircle className={styles.greenCheck}  /> : <HiXCircle className={styles.redX} />}</div>
      </div>
    </div>
    </Modal.Body>
    </>
  );
}
