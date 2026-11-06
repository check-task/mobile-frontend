import { Text, View } from "react-native";

import { Cancel, Check } from "@/components/icons";
import { cn } from "@/lib/utils";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 20;
//ASCII 특수문자(!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~)만 인정
const SPECIAL_CHARACTER_PATTERN = /[!-/:-@[-`{-~]/;

export function getPasswordChecks(password: string) {
  return {
    length:
      password.length >= PASSWORD_MIN_LENGTH &&
      password.length <= PASSWORD_MAX_LENGTH,
    specialCharacter: SPECIAL_CHARACTER_PATTERN.test(password),
  };
}

export function isValidPassword(password: string) {
  const checks = getPasswordChecks(password);
  return checks.length && checks.specialCharacter;
}

type CriterionState = "default" | "met" | "unmet";

const TEXT_CLASS_BY_STATE: Record<CriterionState, string> = {
  default: "text-gray-600",
  met: "text-primary",
  unmet: "text-sub-01",
};

type PasswordCriteriaProps = {
  password: string;
};

// 비밀번호 조건(길이, 특수문자) 충족 여부
export function PasswordCriteria({ password }: PasswordCriteriaProps) {
  const checks = getPasswordChecks(password);
  const isEmpty = password.length === 0;

  const criteria = [
    {
      label: `${PASSWORD_MIN_LENGTH}자 이상, ${PASSWORD_MAX_LENGTH}자 이하`,
      state: getCriterionState(isEmpty, checks.length),
      showCheck: isEmpty || checks.length,
    },
    {
      label: "특수문자",
      state: getCriterionState(isEmpty, checks.specialCharacter),
      showCheck: !isEmpty && checks.specialCharacter,
    },
  ];

  return (
    <View className="flex-row items-center gap-1">
      {criteria.map(({ label, state, showCheck }) => {
        const className = TEXT_CLASS_BY_STATE[state];
        return (
          <View key={label} className="flex-row items-center">
            <Text className={cn("text-b-04-r", className)}>{label}</Text>
            {showCheck ? (
              <Check variant="sm" className={className} />
            ) : (
              <Cancel variant="sm" className={className} />
            )}
          </View>
        );
      })}
    </View>
  );
}

function getCriterionState(isEmpty: boolean, isMet: boolean): CriterionState {
  if (isEmpty) return "default";
  return isMet ? "met" : "unmet";
}
