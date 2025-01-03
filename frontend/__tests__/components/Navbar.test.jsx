import Navbar from './components/Navbar';

describe('Navbar Component', () => {
  test('renders navbar links', () => {
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    // Add specific tests for your navbar links
    // Example:
    // expect(screen.getByText('Home')).toBeInTheDocument();
    // expect(screen.getByText('Doctors')).toBeInTheDocument();
  });
});