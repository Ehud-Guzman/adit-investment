import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSetting,
  updateSetting,
  deleteSetting,
} from "@/services/api/settingsApi";
import { toastGuard } from "@/utils/toastControl";
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

  const {
    mutate: mutateCreateSetting,
    isLoading: isCreating,
  } = useMutation({
    mutationFn: createSetting,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries(["settings"]);
      toastGuard.once(
        `setting-create-${variables?.key || Date.now()}`,
        "✅ Setting created successfully",
        "success"
      );
    },
    onError: (err) => {
      toastGuard.once(
        "setting-create-fail",
        err?.response?.data?.message || "❌ Failed to create setting",
        "error"
      );
    },
  });

  const {
    mutate: mutateUpdateSetting,
    isLoading: isUpdating,
  } = useMutation({
    mutationFn: updateSetting,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries(["settings"]);
      toastGuard.once(
        `setting-update-${variables?.id || Date.now()}`,
        "✅ Setting updated successfully",
        "success"
      );
    },
    onError: (err) => {
      toastGuard.once(
        "setting-update-fail",
        err?.response?.data?.message || "❌ Failed to update setting",
        "error"
      );
    },
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: deleteSetting,
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries(["settings"]);
      toastGuard.once(
        `setting-delete-${id}`,
        "🗑️ Setting deleted",
        "success"
      );
    },
    onError: (err) => {
      toastGuard.once(
        "setting-delete-fail",
        err?.response?.data?.message || "❌ Failed to delete setting",
        "error"
      );
    },
  });

  return {
    mutateCreate: mutateCreateSetting,
    mutateUpdate: mutateUpdateSetting,
    handleEdit,
    handleDelete,
    isLoading: isCreating || isUpdating,
  };
};
