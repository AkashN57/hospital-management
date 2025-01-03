import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import App from './App';

// Mock all child components
jest.mock('./components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('./components/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('./pages/Home', () => () => <div data-testid="home">Home Page</div>);
jest.mock('./pages/Doctors', () => () => <div data-testid="doctors">Doctors Page</div>);
jest.mock('./pages/Login', () => () => <div data-testid="login">Login Page</div>);
jest.mock('./pages/ComplaintForm', () => () => <div data-testid="complaint">Complaint Page</div>);
jest.mock('./pages/About', () => () => <div data-testid="about">About Page</div>);
jest.mock('./pages/Contact', () => () => <div data-testid="contact">Contact Page</div>);
jest.mock('./pages/Appointment', () => () => <div data-testid="appointment">Appointment Page</div>);
jest.mock('./pages/MyAppointments', () => () => <div data-testid="my-appointments">My Appointments Page</div>);
jest.mock('./pages/MyProfile', () => () => <div data-testid="my-profile">My Profile Page</div>);
jest.mock('./pages/Verify', () => () => <div data-testid="verify">Verify Page</div>);

// Wrap component with router for testing
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear window.location before each test
    window.history.pushState({}, '', '/');
  });

  test('renders without crashing', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders home page by default', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  test('renders correct components for different routes', async () => {
    renderWithRouter(<App />);

    // Test each route
    const routes = [
      { path: '/', testId: 'home' },
      { path: '/doctors', testId: 'doctors' },
      { path: '/login', testId: 'login' },
      { path: '/complaint', testId: 'complaint' },
      { path: '/about', testId: 'about' },
      { path: '/contact', testId: 'contact' },
      { path: '/my-appointments', testId: 'my-appointments' },
      { path: '/my-profile', testId: 'my-profile' },
      { path: '/verify', testId: 'verify' }
    ];

    for (const route of routes) {
      // Use act to wrap navigation changes
      await act(async () => {
        window.history.pushState({}, '', route.path);
      });
      expect(screen.getByTestId(route.testId)).toBeInTheDocument();
    }
  });

  test('renders doctors page with speciality parameter', async () => {
    renderWithRouter(<App />);
    
    await act(async () => {
      window.history.pushState({}, '', '/doctors/cardiology');
    });
    expect(screen.getByTestId('doctors')).toBeInTheDocument();
  });

  test('renders appointment page with docId parameter', async () => {
    renderWithRouter(<App />);
    
    await act(async () => {
      window.history.pushState({}, '', '/appointment/123');
    });
    expect(screen.getByTestId('appointment')).toBeInTheDocument();
  });
});
describe('ToastContainer Integration', () => {
    test('renders toast container', () => {
      renderWithRouter(<App />);
      expect(document.querySelector('.Toastify')).toBeInTheDocument();
    });
  });