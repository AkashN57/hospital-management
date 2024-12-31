import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ className = '', children, variant = 'default', ...props }) => {
  const variantStyles = {
    default: 'bg-gray-50 text-gray-900 border-gray-200',
    destructive: 'bg-red-50 text-red-900 border-red-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    success: 'bg-green-50 text-green-900 border-green-200'
  };

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertTitle = ({ className = '', children, ...props }) => {
  return (
    <h5
      className={`mb-1 font-medium leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h5>
  );
};

const AlertDescription = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Alert.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'destructive', 'warning', 'success'])
};

AlertTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

AlertDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Alert.defaultProps = {
  className: '',
  variant: 'default'
};

AlertTitle.defaultProps = {
  className: ''
};

AlertDescription.defaultProps = {
  className: ''
};

export { Alert, AlertTitle, AlertDescription };