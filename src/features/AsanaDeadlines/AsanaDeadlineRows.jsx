import React, { useState } from 'react';
import { HiCheckCircle , HiXCircle } from 'react-icons/hi2';
import styles from './AsanaDeadlines.module.css';

export function AsanaDeadlineRows({ deadlines, showViewModal, showEditModal, showDeleteModal }) {

    return (
        <>
            {deadlines.map((deadline) => (
           
                <tr key={deadline.id} className='align-middle'>
                    <td className='d-flex justify-content-center'>
                        {!deadline.thumb && <img src='./src/imgs/noimage.jpg' width='64' />}
                        {deadline.thumb && <img src={deadline.thumb} width='64' />}
                    </td>
                    <td>{deadline.name}</td>
                    <td className="text-center">{deadline.due_on}</td>
                    <td>{deadline.assignee[0].name}</td>
                    <td className="text-end"><span className={((deadline.days_remaining<0) ? styles.redDaysLeft : styles.greenDaysLeft)}>{deadline.days_remaining} days</span></td>
                    <td className="text-center">{(deadline.completed) ? <HiCheckCircle className={styles.greenCheck}  /> : <HiXCircle className={styles.redX} />}</td>
                    <td className="text-center">
                        <a href='#' onClick={() => showViewModal(deadline)} className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a>
                        <a href='#' onClick={() => showEditModal(deadline.id,deadline)} className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                        <a href='#' onClick={() => showDeleteModal(deadline.id)} className="delete" title="Delete" data-toggle="tooltip" style={{color:"crimson"}}><i className="material-icons">&#xE872;</i></a>
                    </td>
                </tr>
            ))}
        </>
    )
        
  }