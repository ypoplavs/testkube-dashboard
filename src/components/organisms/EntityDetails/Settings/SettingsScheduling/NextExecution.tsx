import {FC, useState} from 'react';
import {useInterval} from 'react-use';

import {formatDuration, intervalToDuration} from 'date-fns';

type NextExecutionProps = {
  value: string | Date;
};

export const NextExecution: FC<NextExecutionProps> = props => {
  const {value} = props;
  const [duration, setDuration] = useState('Not scheduled');

  useInterval(() => {
    if (typeof value === 'string') {
      setDuration(value);
      return;
    }

    setDuration(`in ${formatDuration(intervalToDuration({start: new Date(), end: value}))}`);
  }, 1000);

  return <>{duration}</>;
};