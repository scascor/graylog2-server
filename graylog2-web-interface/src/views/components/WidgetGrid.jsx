import React from 'react';
import PropTypes from 'prop-types';
import * as Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row } from 'components/graylog';
import _ from 'lodash';

import connect from 'stores/connect';
import { AdditionalContext } from 'views/logic/ActionContext';
import CustomPropTypes from 'views/components/CustomPropTypes';
import style from 'pages/ShowDashboardPage.css';
import ReactGridContainer from 'components/common/ReactGridContainer';
import { widgetDefinition } from 'views/logic/Widgets';
import { TitlesStore, TitleTypes } from 'views/stores/TitlesStore';
import WidgetPosition from 'views/logic/widgets/WidgetPosition';
import Widget from './widgets/Widget';
import { PositionsMap, WidgetDataMap, WidgetErrorsMap, WidgetsMap } from './widgets/WidgetPropTypes';

const defaultTitleGenerator = w => `Untitled ${w.type.replace('_', ' ').split(' ').map(_.capitalize).join(' ')}`;

class WidgetGrid extends React.Component {
  static _defaultDimensions(type) {
    const widgetDef = widgetDefinition(type);
    return new WidgetPosition(1, 1, widgetDef.defaultHeight, widgetDef.defaultWidth);
  }

  static _defaultTitle(widget) {
    const widgetDef = widgetDefinition(widget.type);
    return (widgetDef.titleGenerator || defaultTitleGenerator)(widget);
  }

  static propTypes = {
    allFields: CustomPropTypes.FieldListType.isRequired,
    data: WidgetDataMap.isRequired,
    errors: WidgetErrorsMap.isRequired,
    fields: CustomPropTypes.FieldListType.isRequired,
    locked: PropTypes.bool,
    onPositionsChange: PropTypes.func.isRequired,
    positions: PositionsMap,
    staticWidgets: PropTypes.arrayOf(PropTypes.node),
    titles: ImmutablePropTypes.map.isRequired,
    widgets: WidgetsMap.isRequired,
  };

  static defaultProps = {
    locked: true,
    staticWidgets: [],
    positions: {},
  };

  state = {
    widgetDimensions: {},
  };

  _onWidgetSizeChange = (widgetId, dimensions) => {
    this.setState(({ widgetDimensions }) => ({ widgetDimensions: { ...widgetDimensions, [widgetId]: dimensions } }));
  };

  _renderWidgets = (widgets, positions, data, errors) => {
    const returnedWidgets = { positions: {}, widgets: [] };

    if (!widgets || _.isEmpty(widgets) || !data) {
      return returnedWidgets;
    }

    const onPositionsChange = (newPosition) => {
      const newPositions = Object.keys(positions).map((id) => {
        const { col, row, height, width } = positions[id]._value;
        return { id: id, col: col, row: row, height: height, width: width };
      });
      newPositions.push(newPosition);
      // eslint-disable-next-line react/destructuring-assignment
      this.props.onPositionsChange(newPositions);
    };

    Object.keys(widgets).forEach((widgetId) => {
      const widget = widgets[widgetId];
      const dataKey = widget.data || widgetId;
      const widgetData = data[dataKey];
      const widgetErrors = errors[widgetId] || [];

      returnedWidgets.positions[widgetId] = positions[widgetId] || WidgetGrid._defaultDimensions(widget.type);

      const { widgetDimensions = {} } = this.state;
      const { height, width } = widgetDimensions[widgetId] || {};

      const { fields, allFields, titles = Immutable.Map() } = this.props;

      const widgetTitle = titles.getIn([TitleTypes.Widget, widget.id], WidgetGrid._defaultTitle(widget));

      returnedWidgets.widgets.push(
        <div key={widget.id} className={style.widgetContainer}>
          <AdditionalContext.Provider value={{ widget }}>
            <Widget key={widgetId}
                    id={widgetId}
                    widget={widget}
                    data={widgetData}
                    errors={widgetErrors}
                    height={height}
                    position={returnedWidgets.positions[widgetId]}
                    width={width}
                    allFields={allFields}
                    fields={fields}
                    onPositionsChange={onPositionsChange}
                    onSizeChange={this._onWidgetSizeChange}
                    title={widgetTitle} />
          </AdditionalContext.Provider>
        </div>,
      );
    });

    return returnedWidgets;
  };

  render() {
    const { staticWidgets, data, errors, locked, onPositionsChange } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    const { widgets, positions } = this._renderWidgets(this.props.widgets, this.props.positions, data, errors);
    const grid = widgets && widgets.length > 0 ? (
      <ReactGridContainer animate={false}
                          locked={locked}
                          columns={{
                            xxl: 12,
                            xl: 12,
                            lg: 12,
                            md: 12,
                            sm: 12,
                            xs: 12,
                          }}
                          measureBeforeMount
                          onPositionsChange={onPositionsChange}
                          positions={positions}
                          useDragHandle=".widget-drag-handle">
        {widgets}
      </ReactGridContainer>
    ) : null;
    return (
      <Row>
        <div className="dashboard" style={{ marginLeft: '-20px' }}>
          {grid}
          {staticWidgets}
        </div>
      </Row>
    );
  }
}

export default connect(WidgetGrid, { titles: TitlesStore });
