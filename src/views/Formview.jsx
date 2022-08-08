import Form from "../components/form/Form";
import Header from "../components/UI/header";

const FormView = () => {
  return (
    <div>
      <Header></Header>
      <div className="center">
        <div className="box">
          <Form></Form>;
        </div>
      </div>
    </div>
  );
};

export default FormView;
