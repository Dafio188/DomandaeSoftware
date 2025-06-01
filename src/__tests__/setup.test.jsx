import { render, screen } from '@testing-library/react';

// Test semplice per verificare che Jest funzioni
describe('Test Setup', () => {
  test('Jest è configurato correttamente', () => {
    const testElement = document.createElement('div');
    testElement.textContent = 'Test funzionante';
    document.body.appendChild(testElement);
    
    expect(testElement.textContent).toBe('Test funzionante');
  });

  test('React Testing Library funziona', () => {
    const TestComponent = () => <div>Hello Test</div>;
    
    render(<TestComponent />);
    
    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });
}); 