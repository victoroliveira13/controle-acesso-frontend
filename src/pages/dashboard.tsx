import { useContext, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { GetServerSideProps } from 'next';

import Header from '../components/Header';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(()=> {
    api.get('/users').then(response => console.log(response.data));
  }, []);

  return (
    <div>
      <Header />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Bem vindo, {user?.username}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
          </div>
          {/* /End replace */}
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
