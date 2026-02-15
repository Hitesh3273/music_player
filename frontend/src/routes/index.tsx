import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '../pages/MainPages/HomePage';

export const Route = createFileRoute('/')({  
  component: HomePage,
});
