import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSetting, updateSetting, deleteSetting } from "@/services/api/settingsApi";
import { safeToast } from "@/utils/toastManager";
import { useGlobalModal } from "@/hooks/useGlobalModal";

export const useSettingMutations = () => {
  const queryClient = useQueryClient();
  const { openModal } = useGlobalModal();

  const handleEdit = (setting) => {
    openModal({ type: "edit", payload: setting });
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;
    mutateDelete(id);
  };

  const { mutate: mutateCreate, isLoading: isCreating } = useMutation({
    mutationFn: createSetting,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["settings"]);
      safeToast("Setting created");
    },
    onError: () => safeToast("Failed to create setting", "error"),
  });

  const { mutate: mutateUpdate, isLoading: isUpdating } = useMutation({
    mutationFn: updateSetting,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["settings"]);
      safeToast("Setting updated");
    },
    onError: () => safeToast("Failed to update setting", "error"),
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: deleteSetting,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["settings"]);
      safeToast("Setting deleted");
    },
    onError: () => safeToast("Failed to delete setting", "error"),
  });

  return {
    mutateCreate,
    mutateUpdate,
    handleEdit,
    handleDelete,
    isLoading: isCreating || isUpdating,
  };
};
