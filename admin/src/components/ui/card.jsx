import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`flex flex-col space-y-1.5 p-6 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`p-6 pt-0 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Card.defaultProps = {
  className: ''
};

CardHeader.defaultProps = {
  className: ''
};

CardContent.defaultProps = {
  className: ''
};

export { Card, CardHeader, CardContent };