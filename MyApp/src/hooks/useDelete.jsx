import { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

const useDelete = ({ onSuccess, baseUrl }) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteData, setDeleteData] = useState({ id: null, name: '', type: '' });
    const { userToken } = useContext(AuthContext);

    const triggerDelete = ({ id, name = '', type = '' }) => {
        setDeleteData({ id, name, type });
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        const { id, type } = deleteData;

        try {
            const url = `${baseUrl}${id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (response.ok) {
                if (onSuccess) onSuccess({ id, type });
            } else {
                console.warn(`Failed to delete ${type}:`, await response.text());
            }
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
        }

        setDeleteModalVisible(false);
        setDeleteData({ id: null, name: '', type: '' });
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false);
        setDeleteData({ id: null, name: '', type: '' });
    };

    return {
        deleteModalVisible,
        deleteData,
        triggerDelete,
        confirmDelete,
        cancelDelete,
    };
};

export default useDelete;
