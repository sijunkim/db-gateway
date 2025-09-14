// SDK에서 스키마 관련 타입을 명시적으로 export하지 않으므로, 범용 타입을 사용합니다.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}
