
export default function(duration = 0) {

	if (!isDurationUsable(duration)) {
		duration = 0;
		console.error(`Redux-Honey: \n unable to use method nap(). Passed duration needs to be a number.`);
	}

	return new Promise(function (resolve) {
		setTimeout(resolve, duration)
	})
}

function isDurationUsable(duration) {
	return !isNaN(duration)
}
