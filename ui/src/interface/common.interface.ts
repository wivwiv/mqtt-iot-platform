export interface ISearcnFields {
  // json 的 key
  key: string;
  // 触发搜索 input 为
  trigger?: '' | 'change' | 'input';
  // 转换数值
  transform?: (val: any) => any;
  attrs: {
    [key: string]: any;
  };
}
