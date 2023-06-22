<script>
	let selectedDate = '';
	let selectedDuration = '';
	let selectedTimeSlot = '';
	let availableTimeSlots = [];

	const durations = ['15m', '30m', '45m', '1h'];

	function generateTimeSlots(durationInMinutes) {
		// Define the start and end times for the day (in minutes).
		const dayStartInMinutes = 8 * 60; // 8:00 AM
		const dayEndInMinutes = 17 * 60; // 5:00 PM

		// Generate the time slots based on the selected duration.
		const timeSlots = [];
		for (
			let time = dayStartInMinutes;
			time <= dayEndInMinutes - durationInMinutes;
			time += durationInMinutes
		) {
			const hours = Math.floor(time / 60);
			const minutes = time % 60;
			const timeSlot = `${hours.toString().padStart(2, '0')}:${minutes
				.toString()
				.padStart(2, '0')}`;
			timeSlots.push(timeSlot);
		}

		return timeSlots;
	}

	function updateAvailableTimeSlots() {
		// Parse the selected duration to get the duration in minutes.
		const durationInMinutes = parseInt(selectedDuration.replace(/[^\d]/g, ''), 10);

		// Generate the available time slots based on the selected duration.
		availableTimeSlots = generateTimeSlots(durationInMinutes);
	}

	function calculateEndTime(startTime, durationInMinutes) {
		const [startHours, startMinutes] = startTime.split(':').map(Number);
		const totalMinutes = startHours * 60 + startMinutes + durationInMinutes;
		const endHours = Math.floor(totalMinutes / 60);
		const endMinutes = totalMinutes % 60;
		return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
	}

	async function handleSubmit() {
		// Parse the selected duration to get the duration in minutes.
		const durationInMinutes = parseInt(selectedDuration.replace(/[^\d]/g, ''), 10);

		// Calculate the appointment end time based on the selected start time and duration.
		const appointmentStartTime = selectedTimeSlot;
		const appointmentEndTime = calculateEndTime(appointmentStartTime, durationInMinutes);

		const response = await fetch('/api/admin-submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				date: selectedDate,
				startTime: appointmentStartTime,
				endTime: appointmentEndTime
			})
		});
		const result = await response.json();
		console.log(result);
	}
</script>

<svelte:head>
	<title>Admin</title>
	<meta name="Admin" content="Update available appointments here" />
</svelte:head>

<form on:submit|preventDefault={handleSubmit}>
	<label for="date">Date:</label>
	<input id="date" type="date" bind:value={selectedDate} required />
	<br />
	<label for="duration">Duration:</label>
	<select id="duration" bind:value={selectedDuration} on:change={updateAvailableTimeSlots} required>
		<option value="">Select duration</option>
		{#each durations as duration}
			<option value={duration}>{duration}</option>
		{/each}
	</select>
	<br />
	<label for="timeSlot">Time Slot:</label>
	<select id="timeSlot" bind:value={selectedTimeSlot} required>
		<option value="">Select time slot</option>
		{#each availableTimeSlots as timeSlot}
			<option value={timeSlot}>{timeSlot}</option>
		{/each}
	</select>
	<br />
	<button type="submit">Submit</button>
</form>
