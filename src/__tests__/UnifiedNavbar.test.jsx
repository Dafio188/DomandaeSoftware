import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import UnifiedNavbar from '../components/UnifiedNavbar';

// Mock del contesto Auth
const mockAuthContext = {
  user: null,
  role: null,
  logoutUser: jest.fn(),
};

const mockAuthContextLoggedIn = {
  user: { username: 'testuser' },
  role: 'cliente',
  logoutUser: jest.fn(),
};

// Wrapper per i test con Router e Context
const TestWrapper = ({ children, authValue = mockAuthContext }) => (
  <BrowserRouter>
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  </BrowserRouter>
);

describe('UnifiedNavbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering base', () => {
    test('renderizza la navbar correttamente', () => {
      render(
        <TestWrapper>
          <UnifiedNavbar />
        </TestWrapper>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('mostra il logo TechnoBridge', () => {
      render(
        <TestWrapper>
          <UnifiedNavbar />
        </TestWrapper>
      );

      const logo = screen.getByAltText('TechnoBridge');
      expect(logo).toBeInTheDocument();
    });

    test('mostra i link di navigazione per utenti non autenticati', () => {
      render(
        <TestWrapper>
          <UnifiedNavbar />
        </TestWrapper>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Chi Siamo')).toBeInTheDocument();
      expect(screen.getByText('Scopo del Sito')).toBeInTheDocument();
      expect(screen.getByText('FAQ & Supporto')).toBeInTheDocument();
      expect(screen.getByText('Contatti')).toBeInTheDocument();
      expect(screen.getByText('Prodotti')).toBeInTheDocument();
    });

    test('mostra i pulsanti Login e Registrati per utenti non autenticati', () => {
      render(
        <TestWrapper>
          <UnifiedNavbar />
        </TestWrapper>
      );

      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Registrati')).toBeInTheDocument();
    });
  });

  describe('Utente autenticato', () => {
    test('mostra il menu utente per utenti autenticati', () => {
      render(
        <TestWrapper authValue={mockAuthContextLoggedIn}>
          <UnifiedNavbar />
        </TestWrapper>
      );

      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('cliente')).toBeInTheDocument();
    });

    test('mostra i link dashboard per utenti autenticati', () => {
      render(
        <TestWrapper authValue={mockAuthContextLoggedIn}>
          <UnifiedNavbar />
        </TestWrapper>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('I Miei Progetti')).toBeInTheDocument();
    });

    test('non mostra i pulsanti Login/Registrati per utenti autenticati', () => {
      render(
        <TestWrapper authValue={mockAuthContextLoggedIn}>
          <UnifiedNavbar />
        </TestWrapper>
      );

      expect(screen.queryByText('Login')).not.toBeInTheDocument();
      expect(screen.queryByText('Registrati')).not.toBeInTheDocument();
    });
  });

  describe('Dropdown utente', () => {
    test('apre il dropdown quando si clicca sul pulsante utente', async () => {
      render(
        <TestWrapper authValue={mockAuthContextLoggedIn}>
          <UnifiedNavbar />
        </TestWrapper>
      );

      const userButton = screen.getByRole('button', { name: /testuser/i });
      fireEvent.click(userButton);

      await waitFor(() => {
        expect(screen.getByText('Impostazioni')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });

    test('chiude il dropdown quando si clicca fuori', async () => {
      render(
        <TestWrapper authValue={mockAuthContextLoggedIn}>
          <UnifiedNavbar />
        </TestWrapper>
      );

      const userButton = screen.getByRole('button', { name: /testuser/i });
      fireEvent.click(userButton);

      // Clicca fuori dal dropdown
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(screen.queryByText('Impostazioni')).not.toBeInTheDocument();
      });
    });

    test('esegue il logout quando si clicca su Logout', async () => {
      render(
        <TestWrapper authValue={mockAuthContextLoggedIn}>
          <UnifiedNavbar />
        </TestWrapper>
      );

      const userButton = screen.getByRole('button', { name: /testuser/i });
      fireEvent.click(userButton);

      await waitFor(() => {
        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);
      });

      expect(mockAuthContextLoggedIn.logoutUser).toHaveBeenCalled();
    });
  });

  describe('Menu mobile', () => {
    test('mostra il pulsante menu mobile', () => {
      render(
        <TestWrapper>
          <UnifiedNavbar />
        </TestWrapper>
      );

      const mobileToggle = screen.getByLabelText('Toggle menu');
      expect(mobileToggle).toBeInTheDocument();
    });

    test('apre il menu mobile quando si clicca sul toggle', async () => {
      render(
        <TestWrapper>
          <UnifiedNavbar />
        </TestWrapper>
      );

      const mobileToggle = screen.getByLabelText('Toggle menu');
      fireEvent.click(mobileToggle);

      await waitFor(() => {
        const mobileMenu = document.querySelector('.mobile-menu-overlay.active');
        expect(mobileMenu).toBeInTheDocument();
      });
    });
  });

  describe('Auto-hide functionality', () => {
    test('nasconde la navbar quando autoHide è true e si scrolla giù', async () => {
      render(
        <TestWrapper>
          <UnifiedNavbar autoHide={true} />
        </TestWrapper>
      );

      // Simula scroll verso il basso
      Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
      fireEvent.scroll(window);

      await waitFor(() => {
        const navbar = document.querySelector('.unified-navbar');
        expect(navbar).toHaveClass('navbar-hidden');
      });
    });
  });

  describe('Varianti navbar', () => {
    test('applica la classe transparent sulla homepage', () => {
      // Mock di useLocation per simulare homepage
      jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useLocation: () => ({ pathname: '/' }),
      }));

      render(
        <TestWrapper>
          <UnifiedNavbar />
        </TestWrapper>
      );

      const navbar = document.querySelector('.unified-navbar');
      expect(navbar).toHaveClass('navbar-transparent');
    });
  });
}); 