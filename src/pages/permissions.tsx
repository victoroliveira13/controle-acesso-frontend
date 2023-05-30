import Head from 'next/head';
import { AuthContext } from '../contexts/AuthContext';
import { useContext, useEffect, useState} from 'react';
import { api } from '../services/api';
import { parseCookies } from 'nookies';
import { GetServerSideProps } from 'next';

import Header from "../components/Header";

export default function Permissions(){
  const { user } = useContext(AuthContext);

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
        
            <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-4 ml-11">Permissions</h1>
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
                          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-right">
                            Description
                          </th>
                        </tr>
                      </thead>
                      {permissions?.length > 0 ? (
                        <tbody>
                          {permissions?.map((permission) => (
                            <tr className="bg-gray-100 border-b">
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {permission.name}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-right">
                                {permission.description}
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
