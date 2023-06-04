import { PencilIcon, TrashIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function PermissionsTable({ openModal, permissions }) {

  return (
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
        <tbody>
          {permissions?.length > 0 ? (
            permissions.map((permission, index) => (
              <tr className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} key={permission.id}>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{permission.name}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{permission.description}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-end">
                    <button className="bg-yellow-300 hover:bg-yellow-400 text-white font-bold py-2 px-4 mr-1 rounded-md flex items-center justify-center">
                      <PencilIcon className="h-5 w-5" onClick={() => openModal({ isAddMode: false, isPermission: true, row: permission })} />
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center">
                      <TrashIcon className="h-5 w-5" onClick={() => openModal({ isAddMode: false, isPermission: true, row: permission, isDelete: true })}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-sm text-gray-900 px-6 py-4 text-center">There are no permissions.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
