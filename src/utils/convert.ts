import { pinyin } from 'pinyin-pro';
import { withTonesDict, withoutTonesDict, excludeList } from '../dict/dict';
import { config } from '../config/config';

export default async (text: string): Promise<string> => {
  const charArray = [...text]; // 转换为字符数组

  const userConfig = await LiteLoader.api.config.get('Kemisago', config);

  const resultArray: string[] = [];

  if(userConfig.ignoreTones){
    for(const char of charArray){
      if(excludeList.includes(char)) continue;

      if(withoutTonesDict.get(pinyin(char, { toneType: 'none' }))){
        const chemCharArray = withoutTonesDict.get(pinyin(char, { toneType: 'none' }))!;
        const chemChar = chemCharArray[Math.floor(Math.random() * chemCharArray.length)];
        resultArray.push(chemChar);
      }
      else resultArray.push(char);
    }
  }
  else{
    for(const char of charArray){
      if(excludeList.includes(char)) continue;

      if(withTonesDict.get(pinyin(char))){
        const chemCharArray = withTonesDict.get(pinyin(char))!;
        const chemChar = chemCharArray[Math.floor(Math.random() * chemCharArray.length)];
        resultArray.push(chemChar);
      }
      else resultArray.push(char);
    }
  }

  let result = '';
  // 使用forEach循环而非Array.toString，防止误伤英文逗号
  resultArray.forEach((char) => {
    result += char;
  });

  return result;
};