export function AsanaUsersCombobox({asanaUsers, selectedAsanaUser, register, handleChange, errors}) {
    
    if (!asanaUsers) {
        return null;
    }

    return (
        <>
        <select className='form-select' name="assignee" defaultValue={selectedAsanaUser} onChange={handleChange} {...register('assignee')}>
                <option>Assign to a person</option>
                {asanaUsers.map((us) =>
                    <option key={us.gid} value={us.gid}>{us.name}</option>
                )};
            </select>
            {errors.assignee && (
                <p className="fieldError">{errors.assignee.message}</p>
            )}
        </>
    )
}