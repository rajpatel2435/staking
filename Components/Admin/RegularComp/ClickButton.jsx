import React from "react";

const ClickButton = ({ name, handleClick}) => {
  return (
    <div className="col-12">
      <button type="button" className="form__btn" onClick={handleClick}>
        {name}
      </button>
      </div>
  );
};

export default ClickButton;
