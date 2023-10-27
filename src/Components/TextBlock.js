import '../App.css';

export default function TextBlock({ text }) {
    let i=0;
    return (
        <div className={"displaylinebreak"}>
            {text.map(line => {
                return <p key={i++}>{line}</p>;
            })}
        </div>
    )
}