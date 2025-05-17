import React, { useState, useEffect, useContext } from 'react';
import { ScrollView } from 'react-native';
import Header from '../../Components/Header';
import CategoryForm from '../../Components/CategoryForm';
import { AuthContext } from '../../Context/AuthContext';
import Toast from '../../Components/Toast';
import useToast from "../../hooks/useToast";

const UpdateCategory = ({ navigation, route }) => {
  const { toast, showToast, hideToast } = useToast();
  const { id } = route.params;
  const { userToken } = useContext(AuthContext);
  const [categoryData, setCategoryData] = useState({ name: '', image: '' });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://192.168.100.8:3000/api/categories/aCategory/${id}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const data = await response.json();
        setCategoryData({ name: data.name, image: `http://192.168.100.8:3000/uploads/${data.picture}` });
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };
    fetchCategory();
  }, [id, userToken]);

  const handleUpdateCategory = async ({ name, image }) => {
    const formData = new FormData();
    formData.append('name', name);

    if (image && image.startsWith('file')) {
      formData.append('categoryPicture', {
        uri: image,
        type: 'image/jpeg',
        name: `${Date.now()}_category.jpg`,
      });
    }
    try {
      const res = await fetch(`http://192.168.100.8:3000/api/categories/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });
      if (res.ok) {
        showToast("Updated Category Successfully", 'success');
        setTimeout(() => {
          navigation.navigate('Home');
        }, 1000);
      } else {
        const data = await res.json();
        showToast(data.message, 'error');
      }
    } catch (error) {
       showToast('Something went wrong. Please try again later', 'error');
    }
  };

  return (
    <ScrollView>
      <Header navigation={navigation} textMain="Edit Category" textSub="Update an existing Category" />
      <CategoryForm
        initialName={categoryData?.name}
        initialImage={categoryData?.image}
        onSubmit={handleUpdateCategory}
        submitButtonText="Save"
      />
       <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={hideToast}
      />
    </ScrollView>
  );
};

export default UpdateCategory;
