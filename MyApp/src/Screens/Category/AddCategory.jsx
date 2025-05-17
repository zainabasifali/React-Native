import React, { useContext } from 'react';
import { ScrollView } from 'react-native';
import Header from '../../Components/Header';
import CategoryForm from '../../Components/CategoryForm';
import { AuthContext } from '../../Context/AuthContext';
import Toast from '../../Components/Toast';
import useToast from "../../hooks/useToast";

const AddCategory = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const { toast, showToast, hideToast } = useToast();

  const handleAddCategory = async ({ name, image }) => {
    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('categoryPicture', {
        uri: image,
        type: 'image/jpeg',
        name: `${Date.now()}_category.jpg`,
      });
    }
    try {
      const res = await fetch('http://192.168.100.8:3000/api/categories/addCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Added Category Successfully", 'success');
        setTimeout(() => {
          navigation.navigate('Home')
        }, 1000);
      } else {
         showToast(data.message, 'error');
      }
    } catch (error) {
       showToast('Something went wrong. Please try again later', 'error');
    }
  };

  return (
    <ScrollView>
      <Header navigation={navigation} textMain="Add Category" textSub="Add a new Category" />
      <CategoryForm onSubmit={handleAddCategory} submitButtonText="Add" />
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={hideToast}
      />
    </ScrollView>
  );
};

export default AddCategory;
