import {useState} from 'react';

import useValidateRepository from '@hooks/useValidateRepository';

import {Branch, Path, Repository, SecretFormItem} from '@molecules';

import {useValidateRepositoryMutation} from '@services/repository';

import {useClusterDetailsPick} from '@store/clusterDetails';

import {StyledFormSpace} from '../TestConfigurationForm.styled';
import {Props} from '../utils';

const GitFormFields: React.FC<Partial<Props>> = props => {
  const {executorType, getFieldValue} = props as Pick<Props, 'executorType' | 'getFieldValue'>;

  const [validationState, setValidationState] = useState<any>({message: ''});

  const [validateRepository] = useValidateRepositoryMutation();

  const {disableSecretCreation} = useClusterDetailsPick('disableSecretCreation');

  useValidateRepository(getFieldValue, setValidationState, validateRepository);

  return (
    <StyledFormSpace size={24} direction="vertical">
      <Repository message={validationState.message} status={validationState.uri} />
      <SecretFormItem
        message={validationState.message}
        status={validationState.token}
        name="token"
        label="Git Token"
        disabled={disableSecretCreation}
      />
      <SecretFormItem
        message={validationState.message}
        status={validationState.username}
        name="username"
        label="Git Username"
        disabled={disableSecretCreation}
      />
      <Branch message={validationState.message} status={validationState.branch} />
      <Path testType={executorType} message={validationState.message} status={validationState.path} />
    </StyledFormSpace>
  );
};

export default GitFormFields;
