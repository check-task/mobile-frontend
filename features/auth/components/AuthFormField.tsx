import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { Input, type InputProps } from "@/components/common/Input/Input";
import { cn } from "@/lib/utils";

type AuthFormFieldProps = {
  label: string;
  required?: boolean;
  children: ReactNode;
  message?: ReactNode;
};

export function AuthFormField({
  label,
  required = false,
  children,
  message,
}: AuthFormFieldProps) {
  return (
    <View className="gap-2">
      <View className="gap-3">
        <View className="h-[21px] flex-row items-center gap-0.5">
          {required ? (
            <Text className="w-2 pt-0.5 text-center text-primary text-b-02-m">
              *
            </Text>
          ) : null}
          <Text className="text-gray-900 text-b-02-r">{label}</Text>
        </View>
        {children}
      </View>
      {message}
    </View>
  );
}

export type FieldMessageTone = "error" | "success";

const MESSAGE_CLASS_BY_TONE: Record<FieldMessageTone, string> = {
  error: "text-sub-01",
  success: "text-primary",
};

type FieldMessageProps = {
  tone: FieldMessageTone;
  children: string;
};

// 입력 결과 문구
export function FieldMessage({ tone, children }: FieldMessageProps) {
  return (
    <Text className={cn("text-b-04-r", MESSAGE_CLASS_BY_TONE[tone])}>
      {children}
    </Text>
  );
}

// 피그마의 입력 완료 상태; 값이 입력된 상태에서는 포커스가 없어도 진한 테두리를 유지함
export function AuthInput(props: InputProps) {
  return (
    <Input
      {...props}
      className={cn(
        props.value.length > 0 && "border-gray-400",
        props.className
      )}
    />
  );
}
