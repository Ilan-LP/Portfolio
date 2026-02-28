import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/useTheme.tsx';
import { router } from '@/router.tsx';

export default function App() {
    return (
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

