import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";

import { api } from "../services/api";
import Header from "../components/Header";
import ModalCrudAcl from "../components/ModalCrudAcl";
import RolesTable from "../components/RolesTable";

type Role = {
  name: string;
  description: string;
}

type ModalData = {
  isAddMode: boolean;
  isPermission: boolean;
}

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({ isAddMode: true, isPermission: true });
  const [selectedRow, setSelectedRow] = useState<Role | null>(null);

  useEffect(() => {
    api.get('/roles')
      .then(response => setRoles(response.data))
      .catch(error => console.error(error));
  }, []);

  const openModal = (isAddMode: boolean, isPermission: boolean, row: Role | null = null) => {
    setModalData({ isAddMode, isPermission });
    setSelectedRow(row);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedRow(null);
    setShowModal(false);
  };

  return (
    <>
      <Head>
        <title>Roles</title>
      </Head>

      <Header />

      <div>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg auto">
                <ModalCrudAcl
                  isOpen={showModal}
                  onClose={closeModal}
                  isAddMode={modalData.isAddMode}
                  isPermission={modalData.isPermission}
                  row={selectedRow}
                />

                <div className="flex justify-between items-center py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-4 ml-4">Roles</h1>

                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center"
                    onClick={() => openModal(true, false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11 9V4a1 1 0 0 0-2 0v5H4a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5z" clipRule="evenodd" />
                    </svg>
                    Adicionar
                  </button>
                </div>

                <div className="flex flex-col">
                  <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
                    <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                      <RolesTable roles={roles} openModal={openModal} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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