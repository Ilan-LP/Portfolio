import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/useTheme.tsx';
import { router } from '@/router.tsx';
import { Particles } from '@/components/index.ts';

export default function App() {
    return (
        <ThemeProvider>
            {/*<RetroGrid/>*/}
            <Particles/>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

