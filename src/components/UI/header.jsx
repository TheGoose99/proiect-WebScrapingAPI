import "./header.css";

function Title(props) {
  return (
    <div className="outer">
      <div className="Title">
        <h1>{props.name}</h1>
      </div>
    </div>
  );
}

export default Title;
