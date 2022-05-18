import { render, screen } from '@testing-library/react';
import App from './App';

test('renders create new person heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/create new person/i);
  expect(headingElement).toBeInTheDocument();
});
