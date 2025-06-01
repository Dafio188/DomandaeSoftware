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

const mockAuthContextAdmin = {
  user: { username: 'admin' },
  role: 'admin',
  logoutUser: jest.fn(),
};

// Wrapper per i test con Router e Context
const TestWrapper = ({ children, authValue = mockAuthContext, location = '/' }) => {
  // Mock di useLocation
  const mockLocation = { pathname: location };
  
  return (
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        {children}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

// Mock di react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => jest.fn(),
}));

describe('UnifiedNavbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
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
      expect(logo).toHaveAttribute('src', expect.stringContaining('logo'));
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

    test('mostra menu specifico per admin', () => {
      render(
        <TestWrapper authValue={mockAuthContextAdmin}>
          <UnifiedNavbar />
        </TestWrapper>
      );

      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
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

      // Verifica che il dropdown sia aperto
      await waitFor(() => {
        expect(screen.getByText('Impostazioni')).toBeInTheDocument();
      });

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

    test('chiude il menu mobile quando si clicca di nuovo sul toggle', async () => {
      render(
        <TestWrapper>
          <UnifiedNavbar />
        </TestWrapper>
      );

      const mobileToggle = screen.getByLabelText('Toggle menu');
      
      // Apri menu
      fireEvent.click(mobileToggle);
      await waitFor(() => {
        expect(document.querySelector('.mobile-menu-overlay.active')).toBeInTheDocument();
      });

      // Chiudi menu
      fireEvent.click(mobileToggle);
      await waitFor(() => {
        expect(document.querySelector('.mobile-menu-overlay.active')).not.toBeInTheDocument();
      });
    });
  });

  describe('Auto-hide functionality', () => {
    test('nasconde la navbar quando si scrolla giù', async () => {
      render(
        <TestWrapper>
          <UnifiedNavbar autoHide={true} />
        </TestWrapper>
      );

      const navbar = document.querySelector('.unified-navbar');
      expect(navbar).not.toHaveClass('navbar-hidden');

      // Simula scroll verso il basso
      Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
      fireEvent.scroll(window);

      await waitFor(() => {
        expect(navbar).toHaveClass('navbar-hidden');
      });
    });

    test('mostra la navbar quando si scrolla su', async () => {
      render(
        <TestWrapper>
          <UnifiedNavbar autoHide={true} />
        </TestWrapper>
      );

      // Simula scroll giù poi su
      Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
      fireEvent.scroll(window);

      await waitFor(() => {
        const navbar = document.querySelector('.unified-navbar');
        expect(navbar).toHaveClass('navbar-hidden');
      });

      // Scroll verso l'alto
      Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
      fireEvent.scroll(window);

      await waitFor(() => {
        const navbar = document.querySelector('.unified-navbar');
        expect(navbar).not.toHaveClass('navbar-hidden');
      });
    });

    test('non nasconde la navbar se autoHide è false', async () => {
      render(
        <TestWrapper>
          <UnifiedNavbar autoHide={false} />
        </TestWrapper>
      );

      // Simula scroll verso il basso
      Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
      fireEvent.scroll(window);

      await waitFor(() => {
        const navbar = document.querySelector('.unified-navbar');
        expect(navbar).not.toHaveClass('navbar-hidden');
      });
    });
  });

  describe('Varianti navbar', () => {
    test('applica la classe transparent sulla homepage', () => {
      // Mock useLocation per homepage
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useLocation: () => ({ pathname: '/' }),
      }));

      render(
        <TestWrapper location="/">
          <UnifiedNavbar />
        </TestWrapper>
      );

      const navbar = document.querySelector('.unified-navbar');
      expect(navbar).toHaveClass('navbar-transparent');
    });

    test('applica la classe solid su altre pagine', () => {
      // Mock useLocation per altre pagine
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useLocation: () => ({ pathname: '/chi-siamo' }),
      }));

      render(
        <TestWrapper location="/chi-siamo">
          <UnifiedNavbar />
        </TestWrapper>
      );

      const navbar = document.querySelector('.unified-navbar');
      expect(navbar).toHaveClass('navbar-solid');
    });
  });

  describe('Accessibilità', () => {
    test('ha attributi ARIA corretti', () => {
      render(
        <TestWrapper>
          <UnifiedNavbar />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', expect.any(String));

      const mobileToggle = screen.getByLabelText('Toggle menu');
      expect(mobileToggle).toHaveAttribute('aria-expanded');
    });

    test('supporta navigazione da tastiera', () => {
      render(
        <TestWrapper authValue={mockAuthContextLoggedIn}>
          <UnifiedNavbar />
        </TestWrapper>
      );

      const userButton = screen.getByRole('button', { name: /testuser/i });
      
      // Test focus
      userButton.focus();
      expect(document.activeElement).toBe(userButton);

      // Test Enter key
      fireEvent.keyDown(userButton, { key: 'Enter', code: 'Enter' });
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    test('nasconde menu desktop su mobile', () => {
      // Mock window.innerWidth per mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <UnifiedNavbar />
        </TestWrapper>
      );

      const desktopMenu = document.querySelector('.navbar-nav');
      expect(desktopMenu).toHaveClass('d-none', 'd-lg-flex');
    });
  });
}); 