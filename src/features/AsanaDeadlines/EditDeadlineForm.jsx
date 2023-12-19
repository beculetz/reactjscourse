import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Modal, Form } from 'react-bootstrap';
import { boolean, date, number, object, string, mixed } from 'yup';
import { useEffect, useState, useRef } from 'react';

import { useAsanaApi } from '../../hooks/useAsanaApi';
import { AsanaUsersCombobox } from './AsanaUsersCombobox';

const deadlineSchema = object().shape({
  name: string().required('Please provide a deadline name').min(4,'Name must be atleast 4 characters long.'),
  due_on: string().required('Please provide a due on date.'),
  assignee: string().required("Please assign to a user."),
  completed: boolean().optional(),
  html_notes: string().required('Please provide a description.').min(5),
});

function findAsanaUserObjByGid(arrUs, usName) {
    return arrUs.find((element) => {
      return element.name.toLowerCase() === usName.toLowerCase();
    })
  }


export function EditDeadlineForm( { editDeadline, deadline, handleCloseVEA, asanaToken }) {

    const { get: getAsanaUsers } = useAsanaApi('users');
    const [asanaUsers, setAsanaUsers] = useState(null);
    const [selectedAsanaUser, setSelectedAsanaUser] = useState(deadline.assignee[0].gid);

    useEffect(() => {
            async function getDataAsanaUsers() {
                const dataAsanaUsers = await getAsanaUsers(null, null, { accessToken: asanaToken });
                setAsanaUsers(dataAsanaUsers.data);
            }

            getDataAsanaUsers(); //.then((dataAsanaUsers) => setAsanaUsers(dataAsanaUsers))
    }, []);
    
    const { assignee, days_remaining, thumb, ...defaultDeadline } = deadline;
    defaultDeadline.html_notes = deadline.html_notes.replace(/<[^>]+>/g, '');
    //defaultDeadline.assignee = deadline.assignee[0].gid; 
    //console.log('defaultDeadline ',defaultDeadline);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: defaultDeadline,
        resolver: yupResolver(deadlineSchema),
    });

    const handleChange = e => {
        console.log('e.target.value ',e.target.value);        
        setSelectedAsanaUser(e.target.value);
    };

    const checkboxRef = useRef(null);

    async function onSubmit(values) {

        values.html_notes = '<body>'+values.html_notes+'</body>';
        values.completed = checkboxRef.current.checked;

        const { thumb, days_remaining,  ...dataForTask } = values;

        let dataForTasksJS = {};
        dataForTasksJS.data = dataForTask;
  
        const res = await editDeadline(deadline.id, JSON.stringify(dataForTasksJS), { accessToken: asanaToken });
        if (res) {
            handleCloseVEA();
        }
  
      }

    return (
        <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
            <input type="text" className="form-control" id="name" aria-describedby="name" placeholder="Enter Deadline Name" {...register('name')}/>
            {errors.name && (
                <p className="fieldError">{errors.name.message}</p>
            )}
        </div>
        <div className="form-group mt-3">
            <input type="date" className="form-control" id="due_on" aria-describedby="due_on" placeholder="Enter Due On Date" {...register('due_on')}/>
            {errors.due_on && (
                <p className="fieldError">{errors.due_on.message}</p>
            )}
        </div>
        <div className="form-group mt-3">
            <AsanaUsersCombobox asanaUsers={asanaUsers} selectedAsanaUser={selectedAsanaUser} {...{ register, handleChange, errors }} />
        </div>
        <div className="form-group mt-3">
            <label>Completed <Form.Check ref={checkboxRef}
                name="completed"
                type='checkbox'
                id='completed'
                defaultChecked={deadline.completed}
            />
            </label>
        </div>
        <div className="form-group mt-3">
            <textarea id="html_notes" className="form-control" aria-describedby="html_notes" placeholder="Enter a description" {...register('html_notes')} />
            {errors.html_notes && (
                <p className="fieldError">
                {errors.html_notes.message}
                </p>
            )}
        </div>
        <button type="submit" className="btn btn-success mt-4">Edit Deadline</button>
        </form>
        </Modal.Body>
    );
}
