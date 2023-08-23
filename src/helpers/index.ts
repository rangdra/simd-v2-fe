import { IRule } from '../screens/Rule';

export const transformMatrix = (arr: any) => {
  return arr[0]?.map((_: any, colIndex: any) =>
    arr?.map((row: any) => row[colIndex])
  );
};

export const calculateUtility = ({
  value,
  min,
  max,
  type,
}: {
  value: number;
  min: number;
  max: number;
  type: 'benefit' | 'cost';
}) => {
  let result;
  if (type === 'benefit') {
    result = (value - min) / (max - min);
  } else if (type === 'cost') {
    result = (max - value) / (max - min);
  }

  return result;
};

export function truncateTextWithEllipsis(text: string) {
  if (text.length > 60) {
    return text.substring(0, 60) + '...';
  }
  return text;
}

export function sortRules(rules: IRule[], idEvidence: string[]) {
  let res = [];

  for (const rule of rules) {
    if (rule.evidence._id && idEvidence.includes(rule.evidence._id)) {
      res.push(rule);
    }
  }

  return res;
}

export function removeDuplicateData(array: any) {
  const uniqueData: any = {};
  const resultArray = [];

  for (const item of array) {
    if (!uniqueData[item.evidence._id]) {
      uniqueData[item.evidence._id] = true;
      resultArray.push(item);
    }
  }

  resultArray.sort((a, b) => b.cf - a.cf);

  return resultArray;
}
