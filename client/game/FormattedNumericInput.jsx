import React from "react";
import number_format from "./FormatNumbers";

export default class FormattedNumericInput extends React.Component {
		
	state={inputValue: ""}
  
	
	handleChange = event => {
	
	  // note cursor location in case of re-render due to formatting
		const cursorLocation = event.currentTarget.selectionStart;
		
		// get element because event is not persistent
	  const el = event.currentTarget;		
		
		// remove all commas and spaces from number for processing
		const formValue  = event.currentTarget.value.replace(/\s/g, '').replace(/,\s?/g, "");
		
		
		// either format the number and adjust the cursor
		// or return the string as-is
		// use Number() because isNaN() alone returns false positives
		if( !isNaN(Number(formValue )) && el.value != "" ) {
			//format number and, if necessary, advance cursor
			const newText = number_format(formValue )
			const cursorAdvance = newText.length - el.value.length;

			this.setState(
				{inputValue : newText},
				()=>{el.setSelectionRange(cursorLocation+cursorAdvance,cursorLocation+cursorAdvance)}
			)
		} else {
			this.setState({inputValue : formValue })
		} 
		
		// add commas back in for display, only if its a valid number		
		this.props.setValid(!isNaN(Number(formValue)) && formValue != "")
		this.props.handleChange(event);
  };

  render() {
	
    const formValue  = this.state.inputValue.replace(/\s/g, '').replace(/,\s?/g, "");
		const isValid = !isNaN(formValue );
		
		
    return (
			<div>
				<input 
							type="text" 
							name="formTextInput" 
							placeholder="Enter your answer"
							value={this.state.inputValue}
							onChange={this.handleChange}
						/>
						{isValid ? "" : <br/>}
						{isValid ? "" : <span className="validateInput">You must enter a number</span>}
			</div>
    );
  }

}