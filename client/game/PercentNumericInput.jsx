import React from "react";
import number_format from "./FormatNumbers";

export default class PercentNumericInput extends React.Component {
		
	state={
		inputValue: "",
		valid: true,
	}
  
	
	handleChange = event => {
		// get element because event is not persistent
	  const el = event.currentTarget;		
		
		// remove all commas and spaces from number for processing
		const formValue  = event.currentTarget.value.replace(/\s/g, '').replace(/,\s?/g, "");
		const formValid = ( !isNaN( formValue ) && (formValue <= 100 && formValue >=0) && formValue!="" );
		
		
		this.setState({
			formValid: formValid,
			inputValue : formValue ,
		})
		
		
			
		
		this.props.setValid(formValid);
		this.props.handleChange(event);
  };

  render() {
    return (
			<div>
				<span className="labeledInputWrapper"><input 
							type="text" 
							name={"percentTextInput"+round.index+"-"+stage.index}
							placeholder="Enter your answer"
							value={this.state.inputValue}
							onChange={this.handleChange}
							size="15"
						/>%&nbsp;&nbsp;</span>
						{this.state.formValid ? "" : <><br/><span className="validateInput">You must enter a number between 0 and 100</span></>}
			</div>
    );
  }

}