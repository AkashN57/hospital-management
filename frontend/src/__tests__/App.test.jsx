// src/__tests__/App.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock all child components
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../components/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('../pages/Home', () => () => <div data-testid="home">Home Page</div>);
jest.mock('../pages/Doctors', () => () => <div data-testid="doctors">Doctors Page</div>);
jest.mock('../pages/Login', () => () => <div data-testid="login">Login Page</div>);
jest.mock('../pages/ComplaintForm', () => () => <div data-testid="complaint">Complaint Page</div>);
jest.mock('../pages/About', () => () => <div data-testid="about">About Page</div>);
jest.mock('../pages/Contact', () => () => <div data-testid="contact">Contact Page</div>);
jest.mock('../pages/Appointment', () => () => <div data-testid="appointment">Appointment Page</div>);
jest.mock('../pages/MyAppointments', () => () => <div data-testid="my-appointments">My Appointments Page</div>);
jest.mock('../pages/MyProfile', () => () => <div data-testid="my-profile">My Profile Page</div>);
jest.mock('../pages/Verify', () => () => <div data-testid="verify">Verify Page</div>);

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders home page by default', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });
});