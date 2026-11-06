import { Text, View } from "react-native";

import { Modal } from "@/components/common/Modal/Modal";
import { cn } from "@/lib/utils";

import type {
  LegalBlock,
  LegalDocument,
  LegalListItem,
  LegalTextSize,
} from "./legalDocuments";

const TEXT_CLASS_BY_SIZE: Record<LegalTextSize, string> = {
  md: "text-calendar",
  sm: "text-calendar-2",
};

const MARKER_CLASS_BY_SIZE: Record<LegalTextSize, string> = {
  md: "w-3",
  sm: "w-[10.5px]",
};

const NESTED_LIST_CLASS_BY_SIZE: Record<LegalTextSize, string> = {
  md: "ml-3",
  sm: "ml-[10.5px]",
};

const BODY_TEXT_CLASS = "text-gray-600";

type LegalDocumentModalProps = {
  document: LegalDocument;
  onClose: () => void;
};

export function LegalDocumentModal({
  document,
  onClose,
}: LegalDocumentModalProps) {
  return (
    <Modal title={document.title} headerIcon="check" onClose={onClose}>
      <View className="gap-4 py-5">
        <Text className="text-gray-800 text-caption">{document.intro}</Text>
        <View className="gap-3">
          {document.sections.map((section) => (
            <View key={section.title}>
              <Text className={cn("text-calendar", document.headingClassName)}>
                {section.title}
              </Text>
              {section.blocks.map((block, index) => (
                <View
                  key={index}
                  className={getBlockSpacing(block, section.blocks[index - 1])}
                >
                  <LegalBlockView block={block} />
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

function getBlockSpacing(block: LegalBlock, previous?: LegalBlock) {
  if (
    block.type === "paragraph" ||
    block.type === "table" ||
    previous?.type === "table"
  ) {
    return "mt-1";
  }
  return "mt-2";
}

function LegalBlockView({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <Text className={cn("text-calendar", BODY_TEXT_CLASS)}>
          {block.text}
        </Text>
      );
    case "list":
      return (
        <LegalList
          marker={block.marker}
          items={block.items}
          size={block.size ?? "md"}
        />
      );
    case "groups":
      return (
        <View>
          {block.groups.map((group) => (
            <View key={group.title}>
              <Text
                className={cn(
                  TEXT_CLASS_BY_SIZE[block.size ?? "md"],
                  BODY_TEXT_CLASS
                )}
              >
                {group.title}
              </Text>
              <LegalList
                marker="bullet"
                items={group.bullets}
                size={block.size ?? "md"}
              />
            </View>
          ))}
        </View>
      );
    case "table":
      return <LegalTable header={block.header} rows={block.rows} />;
  }
}

type LegalListProps = {
  marker: "number" | "bullet";
  items: LegalListItem[];
  size: LegalTextSize;
};

function LegalList({ marker, items, size }: LegalListProps) {
  const textClassName = cn(TEXT_CLASS_BY_SIZE[size], BODY_TEXT_CLASS);

  return (
    <View>
      {items.map((item, index) => {
        const text = typeof item === "string" ? item : item.text;

        return (
          <View key={text}>
            <View className="flex-row">
              <Text className={cn(MARKER_CLASS_BY_SIZE[size], textClassName)}>
                {marker === "number" ? `${index + 1}.` : "•"}
              </Text>
              <Text className={cn("flex-1", textClassName)}>{text}</Text>
            </View>
            {typeof item === "string" ? null : (
              <View className={NESTED_LIST_CLASS_BY_SIZE[size]}>
                <LegalList marker="bullet" items={item.bullets} size={size} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

type LegalTableProps = {
  header: [string, string];
  rows: [string, string][];
};

const TABLE_COLUMN_CLASS = ["w-[108px]", "flex-1"] as const;

function LegalTable({ header, rows }: LegalTableProps) {
  return (
    <View>
      <View className="flex-row">
        {header.map((title, column) => (
          <View
            key={title}
            className={cn(
              "border border-gray-200 bg-gray-100 px-2 py-1",
              column > 0 && "-ml-px",
              TABLE_COLUMN_CLASS[column]
            )}
          >
            <Text className={cn("text-calendar", BODY_TEXT_CLASS)}>
              {title}
            </Text>
          </View>
        ))}
      </View>
      {rows.map((row) => (
        <View key={row[0]} className="-mt-px flex-row">
          {row.map((cell, column) => (
            <View
              key={cell}
              className={cn(
                "border border-gray-200 px-2 py-1",
                column > 0 && "-ml-px",
                TABLE_COLUMN_CLASS[column]
              )}
            >
              <Text className={cn("text-calendar-2", BODY_TEXT_CLASS)}>
                {cell}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
