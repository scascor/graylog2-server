import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Col } from 'react-bootstrap';
import moment from 'moment';

import { Spinner } from 'components/common';
import WidgetHeader from 'components/widgets/WidgetHeader';

import { widgetDefinition } from 'enterprise/logic/Widget';
import ViewsActions from 'enterprise/actions/ViewsActions';

import WidgetGrid from 'enterprise/components/WidgetGrid';
import SideBar from 'enterprise/components/SideBar';
import { AddWidgetButton, FieldList } from 'enterprise/components/sidebar/index';
import MessageList from 'enterprise/components/widgets/MessageList';

import style from 'pages/ShowDashboardPage.css';

const _onPositionsChange = (positions, view) => {
  const newPositions = {};
  positions.forEach(({ col, height, row, width, id }) => {
    newPositions[id] = { col, height, row, width };
  });
  const updatedView = new Immutable.Map(view).set('positions', newPositions);
  ViewsActions.update(updatedView.get('id'), updatedView);
};

const _renderWidgetGrid = (widgetDefs, widgetMapping, searchTypes, view, fields) => {
  const widgets = {};
  const data = {};

  widgetDefs.forEach((widgetDef) => {
    const widget = Object.assign({}, widgetDef.toJS());
    const widgetType = widgetDefinition(widget.type);
    const dataTransformer = widgetType.searchResultTransformer || (x => x);
    const widgetData = (widgetMapping[widgetDef.get('id')] || []).map(searchTypeId => searchTypes[searchTypeId]);
    if (widgetData) {
      widgets[widget.id] = widget;
      data[widget.id] = dataTransformer(widgetData, widgetDef.toJS());
    }
  });
  const config = { widgets, data, positions: view.get('positions') };
  return <WidgetGrid fields={fields} locked={false} widgets={config} onPositionsChange={positions => _onPositionsChange(positions, view)} />;
};

const _extractMessages = (searchTypes) => {
  return new Immutable.Map(searchTypes).find(searchType => searchType.type.toLocaleUpperCase() === 'MESSAGES');
};

const Query = ({ fields, onToggleMessages, showMessages, results, view, widgetMapping, widgets, query }) => {
  if (results) {
    const widgetGrid = _renderWidgetGrid(widgets, widgetMapping, results.searchTypes, view, fields);
    const queryId = query.get('id');
    const selectedFields = query.get('fields');
    const messages = _extractMessages(results.searchTypes);
    const calculatedAt = moment().toISOString();
    return (
      <span>
        <Col md={2} style={{ paddingLeft: 0, paddingRight: 10 }}>
          <AddWidgetButton viewId={view.get('id')} queryId={queryId} />
          <SideBar>
            <FieldList queryId={queryId}
                       selectedFields={selectedFields}
                       fields={fields} />
          </SideBar>
        </Col>
        <Col md={10}>
          {widgetGrid}
          <div className="dashboard" style={{ marginLeft: -20 }}>
            <div className={style.widgetContainer}>
              <div className="widget">
                <span style={{ fontSize: 10 }} onClick={onToggleMessages}><i className="fa fa-bars pull-right" /></span>
                {showMessages ? <WidgetHeader title="Messages" calculatedAt={calculatedAt} /> : <span style={{ fontSize: 12 }}>Messages</span>}
                {showMessages && <MessageList config={{ pageSize: 100 }} data={messages} /> }
              </div>
            </div>
          </div>
        </Col>
      </span>
    );
  }

  return <Spinner />;
};

Query.propTypes = {
  fields: PropTypes.object.isRequired,
  onToggleMessages: PropTypes.func.isRequired,
  results: PropTypes.object.isRequired,
  showMessages: PropTypes.bool.isRequired,
  view: PropTypes.object.isRequired,
  widgetMapping: PropTypes.object.isRequired,
  widgets: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
};

export default Query;
