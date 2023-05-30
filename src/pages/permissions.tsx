import Head from 'next/head';
import { AuthContext } from '../contexts/AuthContext';
import { useContext, useEffect, useState} from 'react';
import { api } from '../services/api';
import { parseCookies } from 'nookies';
import { GetServerSideProps } from 'next';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';

import Header from "../components/Header";

export default function Permissions(){
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {setIsModalOpen(true);};
  const closeModal = () => {setIsModalOpen(false);};

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    api.get('/permissions')
      .then(response => {
        setPermissions(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  return (
    <>
      <Head>
        <title>Permissions</title>
      </Head>

      <Header />

      <div>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg auto">
        
            <div className="flex justify-between items-center py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-4 ml-4">
                Permissions
              </h1>

              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center"
                onClick={openModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11 9V4a1 1 0 0 0-2 0v5H4a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5z" clipRule="evenodd" />
                </svg>
                Adicionar
              </button>
            </div>
            {/* Modal Add Permission */}
            {isModalOpen && (
              <>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="absolute bg-white rounded-md p-4 w-80">
                    {/* Conteúdo do modal */}
                    <h2 className="text-lg font-bold mb-2">Adicionar Permission</h2>
                    <form> 
                      <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="Nome da permission"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                          Description
                        </label>
                        <input
                          id="description"
                          name="description"
                          type="text"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="Descrição da permission"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mr-2"
                          type="submit"
                        >
                          Adicionar
                        </button>
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
                          onClick={closeModal}
                        >
                          Fechar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="fixed inset-0 bg-black opacity-25 z-40" onClick={closeModal}></div>
              </>
            )}

            <div className="flex flex-col">
              <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-white border-b">
                        <tr>
                          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            Permission
                          </th>
                          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                            Description
                          </th>
                          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-right">
                            Action
                          </th>
                        </tr>
                      </thead>
                      {permissions?.length > 0 ? (
                        <tbody>
                          {permissions?.map((permission, index) => (
                            <tr className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} key={permission.id}>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {permission.name}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
                                {permission.description}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <div className="flex justify-end">
                                  <button className="bg-yellow-300 hover:bg-yellow-400 text-white font-bold py-2 px-4 mr-1 rounded-md flex items-center justify-center">
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center">
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td colSpan={3} className="text-sm text-gray-900 px-6 py-4 text-center">
                              There are no roles.
                            </td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>

            </div>
          </div>
          {/* /End replace */}
        </div>
      </main>
    </div>

    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
    const response = await api.get(`user/${token}`);
    const user = response.data;
  
    const hasUserPermission = user.permissions.some(permission => permission.name === 'list_permission');
    
    if (!hasUserPermission) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }

    return {
      props: {}
    }
  } catch (error) {
    console.error(error.message);

    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }
};
