
const wait = (duration = 0) => {

	if (isDurationUsable(duration)) {
		duration = 0;
		console.warn(`Redux-Sugar: \n unable to use method wait(). Passed duration needs to be a number.`);
	}

	return new Promise(resolve => setTimeout(resolve, duration))
}

const isDurationUsable = duration => (
	!isNaN(duration)
)

export default wait;