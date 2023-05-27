import { useContext, useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { AuthContext } from '../contexts/AuthContext';
import { GetServerSideProps } from 'next';

import Header from '../components/Header';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Header />
      
      <header className="bg-white shadow" >
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Bem vindo, {user?.username}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg auto">
        
            <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-4 ml-11">Suas Roles</h1>
            {/*Table Role*/}
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
                      {user?.roles.length > 0 ? (
                        <tbody>
                          {user?.roles.map((role) => (
                            <tr className="bg-gray-100 border-b">
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
                            <td colSpan={2} className="text-sm text-gray-900 px-6 py-4 text-center">
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

            <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-4 ml-11">Suas Permissions</h1>
            {/*Table Permission*/}
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
                      {user?.permissions.length > 0 ? (
                        <tbody>
                          {user?.permissions.map((permission) => (
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
                            <td colSpan={2} className="text-sm text-gray-900 px-6 py-4 text-center">
                              There are no permissions.
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
