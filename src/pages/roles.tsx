import { GetServerSideProps } from "next";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { parseCookies } from "nookies";
import { api } from "../services/api";
import Head from "next/head";

import Header from "../components/Header";

export default function Roles() {
  const { user } = useContext(AuthContext);

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    api.get('/roles')
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  return (
    <>
      <Head>
        <title>Roles</title>
      </Head>

      <Header />

      <div>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg auto">
        
            <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-4 ml-11">Roles</h1>
            <div className="flex flex-col">
              <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-white border-b">
                        <tr>
                          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            Role
                          </th>
                          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-right">
                            Description
                          </th>
                        </tr>
                      </thead>
                      {roles?.length > 0 ? (
                        <tbody>
                          {roles?.map((role, index) => (
                            <tr className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} key={role.id}>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {role.name}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-right">
                                {role.description}
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
  
    const hasUserPermission = user.permissions.some(permission => permission.name === 'list_role');
    
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
  