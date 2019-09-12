import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

// TODO: make `teinte` a dynamic set of colors
import { teinte, lighten, darken, opposite } from './index';

const ThemeColor = createContext();
export const useTheme = () => useContext(ThemeColor);

const GraylogThemeProvider = ({ children }) => {
  return (
    <ThemeColor.Provider value={{ colors: teinte, utility: { lighten, darken, opposite } }}>
      {/* NOTE: mode can be `teinte` or `noire` and will eventually need to come from User Preferences */}
      <ThemeProvider theme={{ mode: 'teinte' }}>
        {children}
      </ThemeProvider>
    </ThemeColor.Provider>
  );
};

GraylogThemeProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

export default GraylogThemeProvider;
