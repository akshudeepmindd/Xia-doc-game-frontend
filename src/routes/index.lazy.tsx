import http from '@/services';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

const HomeComponent = () => {
  useEffect(() => {
    async function fetchApiHealth() {
      try {
        const response = await http.get('/health');
        console.log(response.data);
      } catch (error: unknown) {
        console.error(error);
      }
    }

    fetchApiHealth();
  }, []);
  return <div>Hello /</div>;
};

export const Route = createLazyFileRoute('/')({
  component: HomeComponent,
});
