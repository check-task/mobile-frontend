export type NoticeSection =
  //본문 첫머리의 안내 문단
  | { type: "intro"; text: string }
  //제목 아래 글머리 기호 목록
  | { type: "list"; heading: string; items: readonly string[] }
  //제목 아래 소제목별 글머리 기호 목록
  | {
      type: "groups";
      heading: string;
      groups: readonly { heading: string; items: readonly string[] }[];
    }
  //제목 아래 문단
  | { type: "text"; heading: string; text: string };

export type Notice = {
  id: string;
  title: string;
  sections: readonly NoticeSection[];
  //본문 아래 작은 글씨로 덧붙이는 문구. 비어 있으면 그리지 않는다
  closing: string;
  date: string;
};

const INTRO_NEW_FEATURES =
  "CHECKTASK(채택) 서비스에 새로운 기능이 추가됐어요! 👏";
const UPDATES_HEADING = "🔔 주요 업데이트";
const FEEDBACK_HEADING = "📬 문의 및 피드백";
const FEEDBACK_TEXT =
  "기능 추가 요청이나 문의사항은 인스타그램 (@checktask_) DM으로 보내주세요.";

//웹(frontend constants/notices.ts)과 같은 내용. 공지사항 API가 추가되면 서버 데이터로 교체
export const NOTICES: readonly Notice[] = [
  {
    id: "4",
    title: "📢 3차 릴리즈 안내",
    sections: [
      { type: "intro", text: INTRO_NEW_FEATURES },
      {
        type: "groups",
        heading: UPDATES_HEADING,
        groups: [
          {
            heading: "날짜를 지정하지 않는 기능이 추가됐어요.",
            items: [
              "할 일은 맞는데 마감기한이 아직 정해지지 않은 일을 어떻게 해야될 지 곤란하셨나요?",
              "이제부터 날짜 '지정안함' 기능을 이용해 관리해보세요.",
              "홈 화면에서 지정안함 TASK를 달력으로 옮겨 쉽게 날짜를 정할 수 있어요.",
            ],
          },
          {
            heading: "팀원 프로필을 확인할 수 있어요.",
            items: [
              "프로필 이미지, 닉네임, 전화번호, 이메일 정보를 확인해 팀원을 구분하고, 연락을 취하세요.",
              "전화번호를 공개하고 싶지 않으면 번호를 삭제해주세요.",
            ],
          },
          {
            heading: "담당자를 여러명 설정할 수 있어요.",
            items: [
              "세부 TASK의 담당자를 한 명만 선택할 수 있었는데, 이제는 여러명으로 설정할 수 있게 됐어요.",
              "협업하기 더 쉬운 환경을 위해 발전하려고 노력하고 있어요.",
            ],
          },
        ],
      },
    ],
    closing:
      "앞으로도 더 좋은 서비스를 위해 업데이트를 진행 할 예정이에요. 서비스를 주변에 많이 알려준다면 채택 팀에게 큰 힘이 됩니다!\n다음 릴리즈 때 봐요! 👋",
    date: "2026.08.19",
  },
  {
    id: "3",
    title: "📢 2차 릴리즈 안내",
    sections: [
      { type: "intro", text: INTRO_NEW_FEATURES },
      {
        type: "groups",
        heading: UPDATES_HEADING,
        groups: [
          {
            heading: "폴더별로 모아봐요.",
            items: [
              "과제 목록에서 원하는 폴더로 분류해서 볼 수 있어요.",
              "폴더 순서를 직접 관리하고, 자주 쓰는 폴더를 앞으로 배치할 수 있어요.",
              "폴더에도 우선순위를 남겨보세요!",
            ],
          },
          {
            heading: "개인 과제를 팀 과제로 바꿔보세요.",
            items: [
              "개인 과제로 만들었다가 팀원이 생기면, 새로 만들지 않고 그대로 팀 과제로 전환할 수 있어요.",
              "단, 팀 과제를 개인 과제로 되돌리는 것은 불가능해요.",
            ],
          },
        ],
      },
    ],
    closing: "",
    date: "2026.07.15",
  },
  {
    id: "2",
    title: "📢 1차 릴리즈 안내",
    sections: [
      {
        type: "intro",
        text: "CHECKTASK(채택) 서비스가 더 편리하게 발전됐어요! 👏",
      },
      {
        type: "groups",
        heading: UPDATES_HEADING,
        groups: [
          {
            heading: "자체 로그인이 가능해졌어요.",
            items: [
              "⚠️ 자체 회원가입 시 카카오 계정과 같은 이메일로 가입할 수 없어요.",
              "기존 사용자 분들은 카카오 로그인으로 진행해주세요.",
            ],
          },
        ],
      },
      { type: "text", heading: FEEDBACK_HEADING, text: FEEDBACK_TEXT },
    ],
    closing: "",
    date: "2026.06.03",
  },
  {
    id: "1",
    title: "📢 서비스 출시 안내",
    sections: [
      {
        type: "intro",
        text: "CHECKTASK(채택) 서비스가 정식 출시되었습니다 🥳\n\n과제 관리, 아직도 여러 앱을 오가며 하고 계신가요?\n채택은 흩어진 과제 관리 과정을 하나로 통합해 개인과 팀 과제 모두 더 효율적으로 과제를 수행할 수 있도록 돕습니다.",
      },
      {
        type: "list",
        heading: "🔑 주요 기능",
        items: [
          "캘린더 기반 과제 일정 관리",
          "개인 과제 / 팀 과제 통합 관리",
          "과제 진행 상황 및 세부 과제 관리",
          "폴더를 통한 과제 정리",
          "효율적인 알림 설정 (적절한 타이밍에 리마인드)",
          "프로필 설정 및 다크모드 지원",
        ],
      },
      {
        type: "text",
        heading: FEEDBACK_HEADING,
        text: `${FEEDBACK_TEXT}\n\n여러분의 피드백을 바탕으로 더 나은 서비스를 만들어가겠습니다.`,
      },
    ],
    closing:
      "CHECKTASK는 과제 등록부터 진행 관리, 협업까지 모든 흐름을 하나의 서비스에서 해결할 수 있도록 설계되었습니다.\n지금 바로 CHECKTASK를 경험해보세요.\n주변에도 많이 공유해주시면 큰 도움이 됩니다 🙇🏻‍♀️",
    date: "2026.04.20",
  },
];
