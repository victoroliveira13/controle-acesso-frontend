import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ModalCrudAcl({ isOpen, onClose, isAddMode, isPermission, row }) {
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

  async function handleModal(data) {
    console.log(data)
  }

  const title = isAddMode ? 'Adicionar' : 'Editar';
  const itemType = isPermission ? 'Permission' : 'Role';

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute bg-white rounded-md p-4 w-80">
              <h2 className="text-lg font-bold mb-2">{`${title} ${itemType}`}</h2>
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
            </div>
          </div>
          <div className="fixed inset-0 bg-black opacity-25 z-40" onClick={onClose}></div>
        </>
      )}
    </>
  );
}
