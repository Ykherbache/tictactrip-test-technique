// this type is mainly used in conjunction with simple POJO to replace enums (futur-proof)
// check this for more info: https://youtu.be/jjMbPt_H3RQ?t=317
export type ObjectValues<T> = T[keyof T];
