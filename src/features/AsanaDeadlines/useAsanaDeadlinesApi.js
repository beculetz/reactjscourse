import { useEffect, useState } from 'react';
import { useAsanaApi } from '../../hooks/useAsanaApi';
import { useAuthContext } from '../Auth/AuthContext';

export function useAsanaDeadlinesApi(deadlinesProjId, deadlineId = 0, searchStrDL, searStrATT, asanaToken, shouldRequestOnLoad = true) {
  const [data, setData] = useState(null);
  const [attachments, setAttachments] = useState(null);
  const { accessToken } = useAuthContext();

  const { get: getDeadlines } = useAsanaApi(`projects/${deadlinesProjId}/tasks`);
  const { get: getImgs } = useAsanaApi('attachments');
  const { post, patch, remove } = useAsanaApi('tasks');

  useEffect(() => {
    async function getData() {
      const data = await getDeadlines(searchStrDL, null, { accessToken: asanaToken });
      setData(data);

      if (deadlinesProjId) {
        const promises = [];
        const taskids = [];
        for (let i = 0; i < data.data.length; i++) {
          const element = data.data[i];
          //console.log('taskdata : '+element.gid+', entity : '+entity+', searStrATT: '+searStrATT+', asanaToken: '+asanaToken);
          promises.push(getImgs(`parent=${element.gid}&${searStrATT}`, null, { accessToken: asanaToken }));
          taskids.push(element.gid);
          //console.log('promises[entity] : '+promises[entity]);
        }

        //console.log('promises : '+JSON.stringify(promises));

        const newAttOBJ = {};
        const newAttachments = [];
        
          const dataAtt = await Promise.all(promises);
          for (let j = 0; j < dataAtt.length; j++) {
            const element = dataAtt[j];
            //console.log('element : '+JSON.stringify(element.data));
            element.data[0].taskgid = taskids[j];
            newAttachments.push(element.data[0]);
            //console.log('newAttachments : '+JSON.stringify(newAttachments));
          }
          setAttachments(newAttachments);

        
      }
    }

    if (shouldRequestOnLoad) {
      getData();
    }
  }, [deadlinesProjId, getDeadlines, shouldRequestOnLoad]);

  function deleteDeadline(deadlineId) {
    return remove(deadlineId, { accessToken: asanaToken });
  }

  function addDeadline(body) {
    return post(body, { accessToken: asanaToken });
  }

  function editDeadline(deadlineId, body) {
    return patch(deadlineId, body, { accessToken: asanaToken });
  }

  return { data, attachments, deleteDeadline, addDeadline, editDeadline };
}
