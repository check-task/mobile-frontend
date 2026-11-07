export type LegalTextSize = "md" | "sm";

export type LegalListItem = string | { text: string; bullets: string[] };

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | {
      type: "list";
      marker: "number" | "bullet";
      items: LegalListItem[];
      size?: LegalTextSize;
    }
  | {
      type: "groups";
      groups: { title: string; bullets: string[] }[];
      size?: LegalTextSize;
    }
  | { type: "table"; header: [string, string]; rows: [string, string][] };

export type LegalSection = {
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  title: string;
  intro: string;
  headingClassName: string;
  sections: LegalSection[];
};

export const TERMS_OF_SERVICE: LegalDocument = {
  title: "서비스 이용약관",
  intro:
    "본 약관은 ‘채택(CHECKTASK)’(이하 “서비스”)이 제공하는 웹 기반 경량 과제 관리 서비스의 이용과 관련하여, 서비스와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.",
  headingClassName: "text-gray-700",
  sections: [
    {
      title: "제1조 (목적)",
      blocks: [
        {
          type: "paragraph",
          text: "본 약관은 서비스가 제공하는 과제 및 세부과제 등록, 관리, 리마인드 기능 등 제반 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리와 의무, 책임사항을 정함을 목적으로 합니다.",
        },
      ],
    },
    {
      title: "제2조 (정의)",
      blocks: [
        {
          type: "paragraph",
          text: "본 약관에서 사용하는 용어의 정의는 다음과 같습니다.",
        },
        {
          type: "list",
          marker: "number",
          size: "sm",
          items: [
            "“회원”이란 카카오의 카카오 로그인을 통해 가입 후 서비스를 이용하는 자를 말합니다.",
            "“과제”란 회원이 등록·관리하는 할 일 또는 작업 단위를 의미합니다.",
            "“세부과제”란 과제를 구성하는 하위 작업 단위를 의미합니다.",
            "“콘텐츠”란 회원이 서비스에 작성·업로드하는 텍스트, 이미지, 파일 등 일체의 정보를 의미합니다.",
          ],
        },
      ],
    },
    {
      title: "제3조 (약관의 효력 및 변경)",
      blocks: [
        {
          type: "list",
          marker: "number",
          items: [
            "본 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.",
            "서비스는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있습니다.",
            "약관이 변경되는 경우 시행일 및 변경 내용을 사전에 공지하며, 변경 후 서비스를 계속 이용하는 경우 동의한 것으로 봅니다.",
          ],
        },
      ],
    },
    {
      title: "제4조 (회원 가입 및 계정 관리)",
      blocks: [
        {
          type: "list",
          marker: "number",
          items: [
            "회원 가입은 카카오 로그인 인증 완료 시 성립합니다.",
            "회원은 자신의 계정을 본인만 사용하여야 하며, 타인에게 양도·대여·공유할 수 없습니다.",
            "계정 관리 소홀로 발생하는 손해에 대한 책임은 회원 본인에게 있습니다.",
          ],
        },
      ],
    },
    {
      title: "제5조 (서비스의 제공)",
      blocks: [
        {
          type: "list",
          marker: "number",
          items: [
            {
              text: "서비스는 다음 기능을 제공합니다.",
              bullets: [
                "과제 및 세부과제 등록, 수정, 삭제",
                "일정 관리 및 리마인드 제공",
                "콘텐츠 저장 및 관리",
              ],
            },
            "서비스는 이미지 및 파일 저장을 위하여 Amazon Web Services의 Amazon S3을 이용할 수 있습니다.",
            "서비스는 운영상 또는 기술상 필요에 따라 제공 기능을 변경·추가·중단할 수 있으며, 중요한 변경 사항은 사전에 공지합니다.",
          ],
        },
      ],
    },
    {
      title: "제6조 (서비스 이용 제한 및 중단)",
      blocks: [
        {
          type: "paragraph",
          text: "서비스는 다음 각 호의 경우 서비스 이용을 제한하거나 중단할 수 있습니다.",
        },
        {
          type: "list",
          marker: "number",
          size: "sm",
          items: [
            "시스템 점검, 장애, 설비 보수, 천재지변 등 불가피한 사유가 있는 경우",
            "회원이 법령 또는 본 약관을 위반한 경우",
            "서비스 운영을 현저히 방해하는 행위를 한 경우",
          ],
        },
      ],
    },
    {
      title: "제7조 (회원의 의무)",
      blocks: [
        { type: "paragraph", text: "회원은 다음 행위를 하여서는 안 됩니다." },
        {
          type: "list",
          marker: "number",
          items: [
            "법령 또는 본 약관에 위반되는 행위",
            "타인의 개인정보 또는 계정을 무단 사용하는 행위",
            "허위 정보 등록 또는 서비스 운영 방해 행위",
            "불법, 음란, 명예훼손, 타인의 권리를 침해하는 콘텐츠 게시 행위",
          ],
        },
      ],
    },
    {
      title: "제8조 (콘텐츠의 권리와 책임)",
      blocks: [
        {
          type: "list",
          marker: "number",
          items: [
            "회원이 작성·업로드한 콘텐츠의 저작권은 해당 회원에게 귀속됩니다.",
            "회원은 본인이 등록한 콘텐츠를 자유롭게 수정 또는 삭제할 수 있습니다.",
            "서비스는 법령 위반 또는 운영 정책에 위배되는 콘텐츠에 대해 사전 통지 후 또는 긴급 시 사후 통지 후 삭제·제한할 수 있습니다.",
            "콘텐츠로 인해 발생하는 법적 책임은 해당 회원에게 있습니다.",
          ],
        },
      ],
    },
    {
      title: "제9조 (개인정보 보호)",
      blocks: [
        {
          type: "paragraph",
          text: "서비스는 관련 법령에 따라 회원의 개인정보를 보호하며, 구체적인 사항은 「개인정보 처리방침」에 따릅니다.",
        },
      ],
    },
    {
      title: "제10조 (책임의 제한)",
      blocks: [
        {
          type: "list",
          marker: "number",
          items: [
            "서비스는 천재지변, 시스템 장애 등 불가항력적 사유로 인한 손해에 대해 책임을 지지 않습니다.",
            "서비스는 회원의 귀책사유로 발생한 손해에 대해 책임을 지지 않습니다.",
            "서비스는 무료로 제공되는 기능과 관련하여 법령상 허용되는 범위 내에서 책임을 제한할 수 있습니다.",
          ],
        },
      ],
    },
    {
      title: "제11조 (준거법 및 관할)",
      blocks: [
        {
          type: "paragraph",
          text: "본 약관은 대한민국 법령에 따르며, 서비스 이용과 관련하여 분쟁이 발생한 경우 관할 법원은 대한민국 민사소송법에 따릅니다.",
        },
      ],
    },
  ],
};

export const PRIVACY_POLICY: LegalDocument = {
  title: "개인정보 처리방침",
  intro:
    "본 서비스는 「개인정보 보호법」 및 「위치정보의 보호 및 이용 등에 관한 법률」을 준수하며, 이용자의 개인정보를 안전하게 보호하고 권익을 보장하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.",
  headingClassName: "text-gray-800",
  sections: [
    {
      title: "제1조 (총칙)",
      blocks: [
        {
          type: "paragraph",
          text: "서비스는 관련 법령에 따라 개인정보를 적법하고 안전하게 처리하며, 이용자의 개인정보 보호를 최우선 가치로 합니다.",
        },
      ],
    },
    {
      title: "제2조 (수집하는 개인정보 항목)",
      blocks: [
        {
          type: "paragraph",
          text: "서비스는 다음과 같은 개인정보를 수집합니다.",
        },
        {
          type: "groups",
          size: "sm",
          groups: [
            {
              title: "1. 회원가입 및 로그인",
              bullets: [
                "카카오 로그인 계정 식별값(고유 ID)",
                "프로필 정보(닉네임, 프로필 이미지)\n※ 이용자가 공개에 동의한 경우",
              ],
            },
            {
              title:
                "2. 서비스 이용 과정에서 이용자가 직접 입력 또는 생성하는 정보",
              bullets: [
                "TASK, 댓글, 팀 과제 등 콘텐츠 정보",
                "프로필 이미지 및 첨부 파일",
              ],
            },
            {
              title: "3. 자동 수집 항목",
              bullets: [
                "서비스 이용 기록",
                "접속 로그",
                "기기 및 브라우저 정보",
                "쿠키 및 세션 정보 (로그인 유지 목적)",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "제3조 (개인정보의 이용 목적)",
      blocks: [
        {
          type: "paragraph",
          text: "수집한 개인정보는 다음 목적에 한하여 이용합니다.",
        },
        {
          type: "list",
          marker: "bullet",
          size: "sm",
          items: [
            "회원 식별 및 로그인 인증",
            "서비스 제공 및 기능 운영",
            "프로필 이미지 설정 등 개인화 서비스 제공",
            "콘텐츠 저장 및 관리",
            "서비스 품질 개선 및 이용 통계 분석",
            "부정 이용 방지 및 보안 관리",
          ],
        },
      ],
    },
    {
      title: "제4조 (카카오 로그인 이용에 관한 사항)",
      blocks: [
        {
          type: "paragraph",
          text: "서비스는 간편 회원가입 및 로그인을 위하여 카카오의 카카오 로그인을 이용합니다.",
        },
        {
          type: "list",
          marker: "bullet",
          size: "sm",
          items: [
            "이용자는 카카오 로그인 과정에서 제공 항목에 대해 동의 후 서비스를 이용할 수 있습니다.",
            "서비스는 인증 목적 범위 내에서 필요한 최소한의 정보만 수집합니다.",
            "카카오 계정 관리 및 인증 절차는 카카오 정책에 따릅니다.",
          ],
        },
      ],
    },
    {
      title: "제5조 (개인정보의 보관 기간 및 파기)",
      blocks: [
        {
          type: "list",
          marker: "number",
          items: [
            "회원 탈퇴 시 계정 정보(닉네임, 로그인 식별값, 프로필 이미지)는 분쟁 방지 및 복구 요청 대응을 위해 7일간 보관 후 지체 없이 삭제합니다.",
            "이용자가 서비스 내 생성한 팀 과제 등 콘텐츠 데이터는 서비스 운영 기록으로 남을 수 있으며, 삭제를 원하는 경우 탈퇴 전에 직접 삭제하여야 합니다.",
            "개인정보는 보관 기간 경과 또는 처리 목적 달성 시 복구 불가능한 방법으로 즉시 파기합니다.",
          ],
        },
      ],
    },
    {
      title: "제6조 (개인정보의 제3자 제공)",
      blocks: [
        {
          type: "paragraph",
          text: "서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않으며, 다음의 경우에만 예외적으로 제공합니다.",
        },
        {
          type: "list",
          marker: "bullet",
          size: "sm",
          items: [
            "법령에 근거가 있는 경우",
            "수사기관 등의 적법한 요청이 있는 경우",
            "이용자의 사전 동의를 받은 경우",
          ],
        },
      ],
    },
    {
      title: "제7조 (개인정보 처리의 위탁 및 보관)",
      blocks: [
        {
          type: "paragraph",
          text: "서비스 운영을 위해 일부 업무를 외부 업체에 위탁할 수 있으며, 관련 법령에 따라 안전하게 관리·감독합니다.",
        },
        {
          type: "table",
          header: ["수탁업체", "위탁업무 내용"],
          rows: [
            [
              "Amazon Web Services",
              "이미지 및 파일 데이터 저장, 클라우드 인프라 운영 (Amazon S3 포함)",
            ],
          ],
        },
        {
          type: "list",
          marker: "bullet",
          size: "sm",
          items: [
            "위탁된 개인정보는 계약에 따라 안전하게 관리됩니다.",
            "위탁업무 종료 시 즉시 파기 또는 반환됩니다.",
          ],
        },
      ],
    },
    {
      title: "제8조 (이용자의 권리 및 행사 방법)",
      blocks: [
        {
          type: "list",
          marker: "number",
          items: [
            "이용자는 언제든지 자신의 개인정보를 열람, 수정, 삭제하거나 회원 탈퇴를 요청할 수 있습니다.",
            "관련 요청은 서비스 내 기능 또는 관리자 이메일을 통해 가능합니다.",
            "위치 기반 기능이 제공되는 경우, 해당 기능에 대해 별도의 동의 또는 철회를 할 수 있습니다.",
          ],
        },
      ],
    },
    {
      title: "제9조 (개인정보 보호를 위한 안전성 확보 조치)",
      blocks: [
        {
          type: "paragraph",
          text: "서비스는 개인정보 보호를 위하여 다음과 같은 기술적·관리적 조치를 시행합니다.",
        },
        {
          type: "list",
          marker: "bullet",
          size: "sm",
          items: [
            "주요 데이터 암호화 저장",
            "세션 기반 인증 관리",
            "접근 권한 최소화 및 통제",
            "정기적 보안 점검 및 로그 모니터링",
          ],
        },
      ],
    },
    {
      title: "제10조 (개인정보 보호책임자)",
      blocks: [
        {
          type: "paragraph",
          text: "개인정보 보호 관련 문의 및 민원 처리를 위하여 아래와 같이 책임자를 지정하고 있습니다.",
        },
        {
          type: "list",
          marker: "bullet",
          size: "sm",
          items: ["책임자: 김민지", "이메일: amber_lucy@naver.com"],
        },
      ],
    },
    {
      title: "제11조 (개정 및 고지)",
      blocks: [
        {
          type: "paragraph",
          text: "본 개인정보 처리방침은 법령, 정책 또는 서비스 내용 변경에 따라 개정될 수 있으며, 변경 시 서비스 내 공지사항을 통해 사전 안내합니다.",
        },
      ],
    },
  ],
};
