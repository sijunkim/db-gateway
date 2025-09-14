// 4. 엄격한 타입 적용: 인자가 객체이고 특정 키를 가졌는지 확인하는 타입 가드
export function hasStringProperty<T extends string>(
  obj: any,
  prop: T
): obj is { [K in T]: string } {
  return obj && typeof obj === "object" && typeof obj[prop] === "string";
}
