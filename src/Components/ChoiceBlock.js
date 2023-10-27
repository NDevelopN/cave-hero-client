export default function ChoiceBlock({ ops, choose }) {
  let i = 0;
  return (
    <>
      {ops.map(op => {
        return <button key={i++} onClick={() => choose(op)}>{op}</button>;
      })}
    </>
  );
}