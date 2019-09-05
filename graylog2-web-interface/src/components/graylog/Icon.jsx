import React from 'react';
import PropTypes from 'prop-types';

import 'font-awesome/css/font-awesome.css';

const Icon = ({
  className,
  flip,
  fullWidth,
  inverse,
  name,
  pulse,
  rotate,
  size,
  spin,
  stack,
  ...props
}) => {
  const cleanIconName = name.replace(/^fa-/, ''); // remove "fa-" prefix if it exists

  return (
    <i className={`
         fa
         fa-${cleanIconName}
         ${flip && `fa-flip-${flip}`}
         ${fullWidth && 'fa-fw'}
         ${inverse && 'fa-inverse'}
         ${pulse && 'fa-pulse'}
         ${rotate && `fa-rotate-${rotate}`}
         ${size && `fa-${size}`}
         ${spin && 'fa-spin'}
         ${stack && `fa-stack-${stack}`}
         ${className}
       `}
       {...props} />
  );
};

Icon.propTypes = {
  className: PropTypes.string,
  flip: PropTypes.oneOf(['horizontal', 'vertical']),
  fullWidth: PropTypes.bool,
  inverse: PropTypes.bool,
  name: PropTypes.string.isRequired,
  pulse: PropTypes.bool,
  rotate: PropTypes.oneOf(['90', '180', '270']),
  size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
  spin: PropTypes.bool,
  stack: PropTypes.oneOf(['1x', '2x']),
};

Icon.defaultProps = {
  className: undefined,
  flip: undefined,
  fullWidth: false,
  inverse: false,
  pulse: false,
  rotate: undefined,
  size: undefined,
  spin: false,
  stack: undefined,
};

export default Icon;
