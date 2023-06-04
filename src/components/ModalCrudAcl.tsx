import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';

interface ModalCrudAclProps {
  isOpen: boolean;
  onClose: () => void;
  isAddMode: boolean;
  isPermission: boolean;
  isDelete: boolean;
  row: any;
  setPermissions: any;
}

export default function ModalCrudAcl({
  isOpen,
  onClose,
  isAddMode,
  isPermission,
  isDelete,
  row,
  setPermissions
}: ModalCrudAclProps) {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (!isAddMode && row) {
      setValue('name', row.name);
      setValue('description', row.description);
    } else {
      setValue('name', '');
      setValue('description', '');
    }
  }, [isAddMode, row, setValue]);

  const title = isDelete ? 'Exluir' : isAddMode ? 'Adicionar' : 'Editar';
  const itemType = isPermission ? 'Permission' : 'Role';

  const handleModal = async (data: any) => {
    try {
      const dataRequest = {
        name: data.name,
        description: data.description,
      };
  
      if (isPermission && isAddMode) {
        const response = await api.post('/permissions', dataRequest);
      }
      else if (isPermission && !isAddMode) {
        const response = await api.put(`/permissions/${row.id}`, dataRequest);
      }

      api.get('/permissions').then(response => setPermissions(response.data));

    } catch (error) {
      console.error(error);
    }
  
    onClose();
  };
  
  const handleDelete = async () => {
    try {
      await api.delete(`/permissions/${row.id}`);
      api.get('/permissions').then(response => setPermissions(response.data));
    } catch (error) {
      console.error(error);
    }

    onClose();
  };

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute bg-white rounded-md p-4 w-80">
              <h2 className="text-lg font-bold mb-2">{`${title} ${itemType}`}</h2>
              {isDelete ? (
                <>  
                  <form onSubmit={handleSubmit(handleDelete)}>
                    <div className="mb-4">
                      <input
                        value={row?.name || ''}
                        className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${!isAddMode && 'bg-gray-200'}`}
                        disabled
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        value={row?.description || ''}
                        className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${!isAddMode && 'bg-gray-200'}`}
                        disabled
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mr-2"
                        type="submit"
                      >
                        {title}
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
                        onClick={onClose}
                      >
                        Fechar
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <form onSubmit={handleSubmit(handleModal)}>
                  <div className="mb-4">
                    <input
                      {...register('name')}
                      id="name"
                      name="name"
                      type="text"
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Nome"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      {...register('description')}
                      id="description"
                      name="description"
                      type="text"
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Descrição"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mr-2"
                      type="submit"
                    >
                      {title}
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
                      onClick={onClose}
                    >
                      Fechar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className="fixed inset-0 bg-black opacity-25 z-40" onClick={onClose}></div>
        </>
      )}
    </>
  );
}
function onSubmitSuccess() {
  throw new Error('Function not implemented.');
}

