
const nap = (duration = 0) => {

	if (!isDurationUsable(duration)) {
		duration = 0;
		console.warn(`Redux-Honey: \n unable to use method nap(). Passed duration needs to be a number.`);
	}

	return new Promise(resolve => setTimeout(resolve, duration))
}

const isDurationUsable = duration => (
	!isNaN(duration)
)

export default nap;