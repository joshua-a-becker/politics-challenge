import moment from "moment-timezone";

function getChicagoTimeZoneOffset() {
	
	var jan = new moment.tz("2014-01-01 12:00", "America/Chicago");			
	var jul = new moment.tz("2014-06-01 12:00", "America/Chicago");		
	
	const stdTimezoneOffset = Math.max(jan.utcOffset(), jul.utcOffset() );
	
	
	const now = moment(new Date());	
	const todayInHometown = now.clone().tz("America/Chicago");
	
	
	// if today's offset in NYC is smaller than the larger of the
	// Standard/Daylight offset, then the current offset is the smaller option.
  return todayInHometown.utcOffset() < stdTimezoneOffset ? todayInHometown.utcOffset() : stdTimezoneOffset;
}

export default function calcTimeRemaining(timeToStart, now, bufferTime) {
	if(!bufferTime){bufferTime=0};
	const hour_minute = timeToStart.split(":");
	const targetHour = hour_minute[0];
	const targetMinute = hour_minute[1];
	const targetSecond = hour_minute[2]==undefined ? 0 : hour_minute[2];

	
	
	// this is the subject's local time
	const localTime = now;
	
	// now we have to convert a difference to chicago time
	const d = new Date();
	const localOffset = d.getTimezoneOffset() * 60000;
	
	
	//NYC IS OFFSET 4 HOURS DURING DAYLIGHT SAVINGS TIME
	var chicagoOffset = getChicagoTimeZoneOffset()*60000;

	
	
	// this could probably be more concise 
	const chicagoDate = new Date(localTime + localOffset + chicagoOffset);
	const targetDate = new Date(chicagoDate.getYear()+1900, chicagoDate.getMonth(), chicagoDate.getDate(), targetHour, targetMinute, targetSecond)
	const time_to_start = (targetDate.getTime()-chicagoDate.getTime())/1000;
	
	
	return(time_to_start+bufferTime);
}