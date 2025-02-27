// @flow strict
import * as React from 'react';
import { FormControl, HelpBlock } from 'components/graylog';

import FormsUtils from 'util/FormsUtils';
import type { AutoInterval, Interval } from './Interval';

import styles from './AutoTimeHistogramPivot.css';

type OnChange = (Interval) => void;

type Props = {
  interval: AutoInterval,
  onChange: OnChange,
};

// eslint-disable-next-line no-undef
const _changeScaling = (event: SyntheticInputEvent<HTMLInputElement>, interval: AutoInterval, onChange: OnChange) => {
  const scaling = 1 / FormsUtils.getValueFromInput(event.target);
  onChange({ ...interval, scaling });
};

const AutoTimeHistogramPivot = ({ interval, onChange }: Props) => (
  <React.Fragment>
    <div className={styles.alignSliderWithLabels}>
      <i className="fa fa-search-minus" style={{ lineHeight: 2, paddingRight: '0.5rem' }} />
      <FormControl type="range"
                   style={{ padding: 0, border: 0 }}
                   min={0.5}
                   max={10}
                   step={0.5}
                   value={interval.scaling ? (1 / interval.scaling) : 1.0}
                   onChange={e => _changeScaling(e, interval, onChange)} />
      <i className="fa fa-search-plus" style={{ lineHeight: 2, paddingLeft: '0.5rem' }} />
    </div>
    <div className="pull-right">Currently: {interval.scaling ? (1 / interval.scaling) : 1.0}x</div>
    <HelpBlock className={styles.helpBlock}>
      A smaller granularity leads to <strong>less</strong>, a bigger to <strong>more</strong> values.
    </HelpBlock>
  </React.Fragment>
);

export default AutoTimeHistogramPivot;
