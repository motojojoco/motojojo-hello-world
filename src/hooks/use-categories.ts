import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { 
  getCategories, 
  getCategoryById, 
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory,
  subscribeToCategories,
  Category,
  CreateCategoryData,
  UpdateCategoryData
} from '@/services/categoryService';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Hook for fetching all categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching a single category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching a single category by name
export const useCategoryByName = (name: string) => {
  return useQuery({
    queryKey: [...categoryKeys.details(), 'name', name],
    queryFn: () => getCategoryByName(name),
    enabled: !!name,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for real-time categories with mutations
export const useCategoriesRealtime = () => {
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch categories
  const { data: categories = [], isLoading, error, refetch } = useCategories();

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isSubscribed) {
      const subscription = subscribeToCategories((payload) => {
        console.log('Category change detected:', payload);
        
        // Invalidate and refetch categories
        queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        
        // If it's a specific category update, invalidate that too
        if (payload.new?.id) {
          queryClient.invalidateQueries({ 
            queryKey: categoryKeys.detail(payload.new.id) 
          });
        }
      });

      setIsSubscribed(true);

      return () => {
        subscription.unsubscribe();
        setIsSubscribed(false);
      };
    }
  }, [queryClient, isSubscribed]);

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });

  return {
    categories,
    isLoading,
    error,
    refetch,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
    createError: createCategoryMutation.error,
    updateError: updateCategoryMutation.error,
    deleteError: deleteCategoryMutation.error,
  };
}; 