import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from 'components/graylog';

const SearchButton = ({ running, disabled }) => (
  <Button type="submit" bsStyle={running ? 'warning' : 'success'} disabled={disabled} className="pull-left search-button-execute">
    <Icon name={running ? 'spinner' : 'search'} spin={running} pulse={running} fullWidth={running} />
  </Button>
);

SearchButton.defaultProps = {
  running: false,
  disabled: false,
};

SearchButton.propTypes = {
  running: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default SearchButton;
