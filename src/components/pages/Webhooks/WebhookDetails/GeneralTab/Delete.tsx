import {FC, useContext} from 'react';

import {Form} from 'antd';

import {ModalContext} from '@contexts';

import {ConfigurationCard, DeleteEntityModal} from '@molecules';

import {useDeleteWebhookMutation} from '@services/webhooks';

import WebhookDetailsContext from '../WebhookDetailsContext';

const Delete: FC = () => {
  const {webhooksDetails} = useContext(WebhookDetailsContext);
  const {setModalConfig, setModalOpen} = useContext(ModalContext);

  const onConfirm = async () => {
    setModalOpen(true);
    setModalConfig({
      width: 550,
      title: 'Delete?',
      content: (
        <DeleteEntityModal
          name={webhooksDetails?.name ?? ''}
          idToDelete={webhooksDetails?.name}
          defaultStackRoute="/webhooks"
          useDeleteMutation={useDeleteWebhookMutation}
          entityLabel="webhook"
        />
      ),
    });
  };

  return (
    <Form name="webhook-delete-form">
      <ConfigurationCard
        title="Delete this webhook"
        description="This notification will be permanently deleted. All your automation linked to this notification will fail from here on and you need to adapt them manually. This action is irreversible and can not be undone."
        onConfirm={onConfirm}
        isWarning
        confirmButtonText="Delete"
        forceEnableButtons
      />
    </Form>
  );
};

export default Delete;
