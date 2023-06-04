import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";

import { api } from "../services/api";
import Header from "../components/Header";
import ModalCrudAcl from "../components/ModalCrudAcl";
import PermissionsTable from "../components/PermissionsTable";

type ModalData = {
  isAddMode: boolean;
  isPermission: boolean;
  row?: any;
  isDelete?: boolean;
};

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({ isAddMode: true, isPermission: true});
  const [selectedRow, setSelectedRow] = useState(null);

  const openModal = ({ isAddMode, isPermission, row = null, isDelete = false }: ModalData) => {
    setModalData({ isAddMode, isPermission, isDelete }); 
    setSelectedRow(row);
    setShowModal(true);
  };
  

  const closeModal = () => {
    setSelectedRow(null);
    setShowModal(false);
  };

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
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg auto">
                {/* Modal */}
                <ModalCrudAcl
                  isOpen={showModal}
                  onClose={closeModal}
                  isAddMode={modalData.isAddMode}
                  isPermission={modalData.isPermission}
                  isDelete={modalData.isDelete}
                  row={selectedRow}
                  setPermissions={setPermissions}
                />
                
                <div className="flex justify-between items-center py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-4 ml-4">
                    Permissions
                  </h1>

                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center"
                    onClick={() => openModal({ isAddMode: true, isPermission: true })}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M11 4h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3V2a1 1 0 0 1 2 0v2zM9 6V4H6v13h9V4h-3v2a1 1 0 0 1-2 0zm7-2H4v15a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4zm-7 7h2v2h-2v-2zm0-4h2v3h-2V7z" />
                    </svg>
                    Add Permission
                  </button>
                </div>

                <PermissionsTable openModal={openModal} permissions={permissions} />
    
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
