import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginRegister from '../components/LoginRegister';
import { useAuth } from '../features/auth/hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';

// Mock de useAuth
jest.mock('../features/auth/hooks/useAuth');

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
    BrowserRouter: ({ children }) => <div>{children}</div>,
}), { virtual: true });

describe('CP-002 - Inicio de sesión', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Verificar que un usuario confirmado puede iniciar sesión y recibe un token JWT', async () => {
        // Configuración del mock para un inicio de sesión exitoso
        const mockLogin = jest.fn().mockResolvedValue({ success: true });
        useAuth.mockReturnValue({
            isAuthenticated: false,
            login: mockLogin,
            loading: false,
        });

        render(
            <BrowserRouter>
                <LoginRegister />
            </BrowserRouter>
        );

        // Verificar que estamos en el formulario de login
        expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();

        // Simular entrada de datos
        const emailInput = screen.getByPlaceholderText(/correo/i);
        const passwordInput = screen.getByPlaceholderText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        fireEvent.change(emailInput, { target: { value: 'usuario@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Enviar formulario
        fireEvent.click(submitButton);

        // Verificar que la función login fue llamada con los datos correctos
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledTimes(1);
            expect(mockLogin).toHaveBeenCalledWith('usuario@test.com', 'password123');
        });

        // Simular que el estado de autenticación cambia a true
        useAuth.mockReturnValue({
            isAuthenticated: true,
            login: mockLogin,
            loading: false,
        });

        // Re-renderizar el componente para que el useEffect detecte el cambio
        render(
            <BrowserRouter>
                <LoginRegister />
            </BrowserRouter>
        );

        // Verificar redirección
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
        });
    });
});
