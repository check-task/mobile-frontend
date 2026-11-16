import { View } from "react-native";

import { AddItemButton } from "./AddItemButton";
import type { ResourceDraftItem } from "../api/taskForm.types";
import { TaskFormField } from "./TaskFormField";
import { ResourceItem } from "./ResourceItem";

export type TaskResourceSectionProps = {
  resources: readonly ResourceDraftItem[];
  /** 자료를 누르면 수정, 인자 없이 부르면 추가 */
  onOpenModal: (target?: ResourceDraftItem) => void;
  onRemove: (resource: ResourceDraftItem) => void;
};

export function TaskResourceSection({
  resources,
  onOpenModal,
  onRemove,
}: TaskResourceSectionProps) {
  return (
    <TaskFormField label="자료">
      {resources.length > 0 ? (
        <View className="gap-2">
          {resources.map((resource) => (
            <ResourceItem
              key={resource.id}
              title={resource.name || resource.path}
              link={resource.path}
              onEdit={() => onOpenModal(resource)}
              onDelete={() => onRemove(resource)}
            />
          ))}
        </View>
      ) : null}
      <AddItemButton label="자료 추가" onPress={() => onOpenModal()} />
    </TaskFormField>
  );
}
