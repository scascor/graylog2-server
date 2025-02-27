// @flow strict
import * as Immutable from 'immutable';

import ViewState from 'views/logic/views/ViewState';
import SearchActions from 'views/actions/SearchActions';
import Search from 'views/logic/search/Search';
import Query from 'views/logic/queries/Query';
import View from 'views/logic/views/View';
import mockAction from 'helpers/mocking/MockAction';
import AggregationWidget from '../logic/aggregationbuilder/AggregationWidget';
import { ViewActions, ViewStore } from './ViewStore';
import { ViewManagementActions } from './ViewManagementStore';

jest.mock('views/actions/SearchActions');
jest.mock('views/logic/Widgets', () => ({
  widgetDefinition: () => ({
    searchTypes: () => [],
  }),
  resultHistogram: () => ({}),
  allMessagesTable: () => ({}),
}));
jest.mock('logic/rest/FetchProvider', () => jest.fn(() => Promise.resolve()));

describe('ViewStore', () => {
  const dummySearch = Search.create()
    .toBuilder()
    .queries([
      Query.builder().id('firstQueryId').build(),
      Query.builder().id('secondQueryId').build(),
    ])
    .build();
  const dummyView = View.builder().search(dummySearch).build();
  it('.load should select first query if activeQuery is not set', () => ViewActions.load(dummyView)
    .then(state => expect(state.activeQuery).toBe('firstQueryId')));
  it('.load should select activeQuery if it is set and present in view', () => ViewActions.selectQuery('secondQueryId')
    .then(() => ViewActions.load(dummyView))
    .then(state => expect(state.activeQuery).toBe('secondQueryId')));
  it('.load should select first query if activeQuery is set but not present in view', () => ViewActions.selectQuery('nonExistingQueryId')
    .then(() => ViewActions.load(dummyView))
    .then(state => expect(state.activeQuery).toBe('firstQueryId')));
  describe('maintains dirty flag:', () => {
    beforeEach(() => {
      SearchActions.create = mockAction(jest.fn(s => Promise.resolve({ search: s })));
    });
    it('resets dirty flag when an existing view is updated', () => {
      const search = Search.create();
      const newView = View.builder().newId().search(search).build();
      return ViewActions.load(newView)
        .then(() => ViewActions.description('My view!'))
        .then(({ view }) => {
          const state = ViewStore.getInitialState();
          expect(state.dirty).toEqual(true);
          return ViewManagementActions.update(view);
        })
        .then(() => {
          const state = ViewStore.getInitialState();
          expect(state.dirty).toEqual(false);
        });
    });
    it('sets dirty flag to false when creating a view', () => {
      return ViewActions.create(View.Type.Dashboard)
        .then(({ dirty }) => expect(dirty).toBeFalsy());
    });
  });

  describe('search recreation:', () => {
    let search: Search;
    let view: View;
    beforeEach(() => {
      SearchActions.create = mockAction(jest.fn(s => Promise.resolve({ search: s })));

      search = Search.create()
        .toBuilder()
        .queries([Query.builder().id('firstQueryId').build()])
        .build();
      view = View.create()
        .toBuilder()
        .state(Immutable.fromJS({ firstQueryId: ViewState.create() }))
        .search(search)
        .build();
      return ViewActions.load(view);
    });
    it('should create search when view is created', () => ViewActions.create(View.Type.Dashboard)
      .then(() => expect(SearchActions.create).toHaveBeenCalled()));
    it('should create search when state is updated', () => {
      const newState = Immutable.fromJS({
        firstQueryId: ViewState.create()
          .toBuilder()
          .widgets(Immutable.fromJS([AggregationWidget.builder().build()]))
          .build(),
      });

      return ViewActions.state(newState)
        .then(() => expect(SearchActions.create).toHaveBeenCalled());
    });
    it('should not recreate search when state is updated to identical state', () => ViewActions.state(view.state)
      .then(() => expect(SearchActions.create).not.toHaveBeenCalled()));
    it('should create search when search is replaced', () => {
      const newSearch = search.toBuilder().newId().build();
      return ViewActions.search(newSearch)
        .then(() => expect(SearchActions.create).toHaveBeenCalled());
    });
  });
});
