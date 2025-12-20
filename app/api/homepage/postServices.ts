
import { api } from "../axios";

// ✅ Define the Category type
export interface CategoryType {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  category_image_file?: File | null; 
  category_image_url:string;
}

// ✅ Correct PostCategory function
export const PostCategory = async (formData: FormData, token: string) => {
  if(!token) {
    throw new Error("You are not authorized to perform this action.");
  }
  try {
    const response = await api.post("/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error posting category:", error);
    throw error;
  }
};

export const UpdateCategory = async (id: string, formData: FormData, token: string) => {
  if(!token) {
    throw new Error("You are not authorized to perform this action.");
  }
  try {
    const response = await api.put(`/categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const DeleteCategory = async (id: string, token: string) => {
  if(!token) {
    throw new Error("You are not authorized to perform this action.");
  }
  const response = await api.delete(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const ToggleCategoryStatus = async (id: string, isActive: boolean, token: string) => {
  if(!token) {
    throw new Error("You are not authorized to perform this action.");
  }
  const response = await api.put(`/categories/${id}/status`, 
  { is_active: isActive },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}




export const postSubcategory = async (formData: FormData, token: string) => {
  try {
    const response = await api.post("/subcategories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating subcategory: ", error);
    throw error;
  }
}

export const updateSubcategory = async (id: string, formData: FormData, token: string) => {
  try {
    const response = await api.put(`/subcategories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating subcategory: ", error);
    throw error;
  }
}

export const deleteSubcategory = async (id: string, token: string) => {
  try {
    const response = await api.delete(`/subcategories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting subcategory: ", error);
    throw error;
  }
}

export const toggleSubcategoryStatus = async (id: string, isActive: boolean, token: string) => {
  try {
    const response = await api.put(`/subcategories/${id}/status`, 
    { is_active: isActive },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling subcategory status: ", error);
    throw error;
  }
}


// post services
export const PostService = async (formData: FormData, token: string) => {
  try {
    console.log("in PostService.ts: ", formData);
    const response = await api.post("/services", formData,{
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating service: ", error);
    throw error;
  }
}

export const UpdateService = async (id: string, formData: FormData, token: string) => {
  try {
    const response = await api.put(`/services/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating service: ", error);
    throw error;
  }
}

export const DeleteService = async (id: string, token: string) => {
  try {
    const response = await api.delete(`/services/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting service: ", error);
    throw error;
  }
}

export const ToggleServiceStatus = async (id: string, isActive: boolean, token: string) => {
  try {
    const response = await api.put(`/services/${id}/status`, 
    { is_active: isActive },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling service status: ", error);
    throw error;
  }
}

export const ToggleServiceFeatured = async (id: string, isFeatured: boolean, token: string) => {
  try {
    const response = await api.put(`/services/${id}/featured`, 
    { is_featured: isFeatured },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling service featured status: ", error);
    throw error;
  }
}

export const getCategoryServiceCount = async () => {
  try {
    const response = await api.get('/categories/with-service-count');
    return response;
  } catch (error) {
    console.error("Error getting categories: ", error);
    throw error;
  }
}

export const getSubcategoryServiceCount = async () => {
  try {
    const response = await api.get('/subcategories/with-service-count');
    return response;
  } catch (error) {
    console.error("Error getting subcategories: ", error);
    throw error;
  }
}

export const getServices = async () => {
  try {
    const response = await api.get('/services');
    return response;
  } catch (error) {
    console.error("Error getting services: ", error);
    throw error;
  }
}

export const searchServiceByQuery = async (query:string) => {
  const response = await api.get(`/search/service?q=${query}`);
  return response.data;
}



