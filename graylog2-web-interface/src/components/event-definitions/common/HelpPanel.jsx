import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';

import styles from './HelpPanel.css';

class HelpPanel extends React.Component {
  static propTypes = {
    bsStyle: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'default', 'primary']),
    children: PropTypes.node,
    className: PropTypes.string,
    collapsible: PropTypes.bool,
    header: PropTypes.node,
    title: PropTypes.string,
    defaultExpanded: PropTypes.bool,
  };

  static defaultProps = {
    bsStyle: 'info',
    children: undefined,
    className: '',
    collapsible: false,
    header: undefined,
    title: '',
    defaultExpanded: false,
  };

  render() {
    const { bsStyle, children, className, collapsible, header, title, defaultExpanded } = this.props;
    const defaultHeader = (
      <Panel.Title componentClass="h3" toggle={collapsible}>
        <i className="fa fa-info-circle" />&emsp;{title}
      </Panel.Title>
    );

    return (
      <Panel bsStyle={bsStyle}
             className={`${styles.helpPanel} ${className}`}
             defaultExpanded={defaultExpanded}>
        <Panel.Heading>
          {header || defaultHeader}
        </Panel.Heading>
        <Panel.Body collapsible={collapsible}>
          {children}
        </Panel.Body>
      </Panel>
    );
  }
}

export default HelpPanel;
