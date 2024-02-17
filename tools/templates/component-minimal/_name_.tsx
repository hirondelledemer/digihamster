import React, { FC } from 'react';
import style from './_name_.module.scss';

export interface _name_Props {
  testId?: string;
}

const _name_: FC<_name_Props> = ({ testId }): JSX.Element => {
  return <div data-testid={testId}>_name_</div>;
};

export default _name_;
