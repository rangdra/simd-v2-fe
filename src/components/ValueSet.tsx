export default function ValueSet({ value }: { value: string }) {
  return <div>{value ? value : 'Not Set'}</div>;
}
