import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Modal, Form } from 'react-bootstrap';
import { boolean, date, number, object, string, mixed } from 'yup';
import { useEffect, useState } from 'react';

import { useAsanaApi } from '../../hooks/useAsanaApi';
import ImageUpload from './ImageUpload';

const MAX_FILE_SIZE = 102400; //100KB

const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

const deadlineSchema = object().shape({
    name: string().required('Please provide a deadline name').min(4,'Name must be atleast 4 characters long.'),
    due_on: string().required('Please provide a due date.'),
    assignee: string().required("Please assign to a user."),
    completed: boolean().optional(),
    html_notes: string().required('Please provide a description.').min(5),
    task_img: mixed()
        .required()
        /* .test("is-valid-type", "Not a valid image type",
        value => isValidFileType(value && value.name.toLowerCase(), "image"))
        .test("is-valid-size", "Max allowed size is 100KB",
        value => value && value.size <= MAX_FILE_SIZE), */
});

export function AddDeadlineForm( { addDeadline, handleCloseVEA, asanaToken }) {

    const projectGid = import.meta.env.VITE_ASANA_PJID;
  
    const { get: getAsanaUsers } = useAsanaApi('users');
    const [asanaUsers, setAsanaUsers] = useState(null);

    const { post: postAtt } = useAsanaApi('attachments?optfields=');

    useEffect(() => {
            async function getDataAsanaUsers() {
                const dataAsanaUsers = await getAsanaUsers(null, null, { accessToken: asanaToken });
                setAsanaUsers(dataAsanaUsers.data);
            }

            getDataAsanaUsers(); //.then((dataAsanaUsers) => setAsanaUsers(dataAsanaUsers))
    }, []);
        
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(deadlineSchema),
    });

    async function onSubmit(values) {

      values.html_notes = '<body>'+values.html_notes+'</body>';
      values.projects = [projectGid];

      const { task_img, ...dataForTask } = values;

      let dataForTasksJS = {};
      dataForTasksJS.data = dataForTask;

      const res = await addDeadline(JSON.stringify(dataForTasksJS), { accessToken: asanaToken });
    
      if (res) {
        console.log('res data gid '+res.data.gid);
        let imgparent = `${res.data.gid}`;
        
        const attData = new FormData();
        attData.append('file', task_img[0]);
        attData.append('parent',imgparent);
        attData.append('name',task_img[0].name);
        
        const resatt = await postAtt(attData, { accessToken: asanaToken });
        console.log('resatt '+JSON.stringify(resatt));

        handleCloseVEA();

      } 

      // register={register('task_img')}

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
            <select className='form-select' name="assignee" aria-label="Assign deadline to a person" {...register('assignee')}>
                <option key="0" value="">Assign to a person</option>
                {asanaUsers?.map((us) =>
                    <option key={us.gid} value={us.gid}>{us.name}</option>
                )};
            </select>
            {errors.assignee && (
                <p className="fieldError">{errors.assignee.message}</p>
            )}
        </div>
        <div className="form-group mt-3">
            <label>Completed <Form.Check
                disabled
                type='checkbox'
                id='completed'
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
        <div className="form-group mt-4">
            <ImageUpload elName="task_img" {...{register, errors}} /> 
        </div>
        <button type="submit" className="btn btn-success mt-4">Add Deadline</button>
        </form>
        </Modal.Body>
    );
}
