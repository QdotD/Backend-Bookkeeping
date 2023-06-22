<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let appointmentsByDay = {};
	let currentWeekStart = getStartOfWeek(new Date());
	let currentWeekEnd;
	let dateRange;
	let errorMessage;
	let datesOfTheWeek = Array(7).fill(new Date());

	let changeWeekTimeoutId = null;
	let pendingWeekChange = 0;

	let controller = new AbortController(); // The AbortController that will be used to cancel fetch requests

	let loading = writable(false); // svelte loading store
	let isAdmin = writable(false); // svelte admin check store

	let currentDateIndex;

	$: {
		currentDateIndex = datesOfTheWeek.findIndex(
			(date) => date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
		);
	}

	async function fetchData(weekStart) {
		// Abort any ongoing fetch
		controller.abort();

		// Create a new AbortController for the new fetch
		controller = new AbortController();

		const start = currentWeekStart.toISOString().split('T')[0];
		const end = new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split('T')[0];

		try {
			const response = await fetch(`/api/admin-range?start=${start}&end=${end}`, {
				signal: controller.signal
			});

			const text = await response.text();
			console.log(text); // Log the actual response text

			if (!response.ok) {
				throw new Error(`Fetch failed with status ${response.status}`);
			}

			const result = JSON.parse(text);

			if (result.success) {
				// Populate with new data
				appointmentsByDay = groupAppointmentsByDay(result.data);
				loading.set(false); // Update the loading state by calling set on the loading store
			}
		} catch (err) {
			if (err.name === 'AbortError') {
				console.log('Fetch aborted');
			} else {
				console.error(err);
				// Handle fetch error...
				console.log(err);
				errorMessage = `Fetch failed: ${err.message}`;
			}
		}
	}

	// Function to format a date as "Month Day, Year"
	function formatDate(date) {
		return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	}

	// Reactive statement to update the date range
	$: {
		currentWeekEnd = new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
		dateRange = `${formatDate(currentWeekStart)} - ${formatDate(currentWeekEnd)}`;

		// Update the datesOfTheWeek array
		for (let i = 0; i < 7; i++) {
			datesOfTheWeek[i] = new Date(currentWeekStart.getTime() + i * 24 * 60 * 60 * 1000);
		}
	}

	function groupAppointmentsByDay(appointments) {
		return appointments.reduce((acc, appointment) => {
			const dateParts = appointment.date.split('-').map(Number);
			// Create the Date object using the year, month, and day parts
			// Note: Subtract 1 from the month value since months are zero-based in JavaScript
			const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
			const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
			if (!acc[dayOfWeek]) {
				acc[dayOfWeek] = [];
			}
			acc[dayOfWeek].push(appointment);
			return acc;
		}, {});
	}

	function getStartOfWeek(date) {
		const startOfWeek = new Date(date);
		const dayOfWeek = startOfWeek.getDay();
		startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
		return startOfWeek;
	}

	function changeWeek(offset) {
		loading.set(true); // Update the loading state by calling set on the loading store

		pendingWeekChange += offset;

		const newWeekStart = new Date(currentWeekStart.getTime());
		newWeekStart.setDate(newWeekStart.getDate() + 7 * pendingWeekChange);

		clearTimeout(changeWeekTimeoutId);
		changeWeekTimeoutId = setTimeout(() => {
			appointmentsByDay = {}; // Clear the appointments
			currentWeekStart = newWeekStart;
			fetchData(newWeekStart); // pass newWeekStart as an argument
			pendingWeekChange = 0; // reset pendingWeekChange
		}, 200);
	}

	function goToToday() {
		loading.set(true); // Update the loading state by calling set on the loading store

		appointmentsByDay = {}; // Clear the appointments
		currentWeekStart = getStartOfWeek(new Date());
		fetchData();
	}

	async function deleteAppointment(id) {
		try {
			const response = await fetch(`/api/delete-appointment?id=${id}`, {
				method: 'DELETE'
			});
			if (!response.ok) {
				throw new Error(`Delete failed with status ${response.status}`);
			}
			// Remove the deleted appointment from the appointmentsByDay object
			for (let day of Object.keys(appointmentsByDay)) {
				appointmentsByDay[day] = appointmentsByDay[day].filter(
					(appointment) => appointment.id !== id
				);
			}
		} catch (err) {
			console.error(err);
			errorMessage = `Delete failed: ${err.message}`;
		}
	}

	// Fetch data on component mount
	onMount(() => fetchData(currentWeekStart));
</script>

<svelte:head>
	<title>Appointments</title>
	<meta name="appointments" content="Book an appointment here" />
</svelte:head>

<div class="container">
	<!-- Display the date range -->
	<div class="date-range">
		{dateRange}
	</div>

	<!-- Navigation buttons -->
	<button on:click={() => changeWeek(-1)}>Previous Week</button>
	<button on:click={() => changeWeek(1)}>Next Week</button>
	<button on:click={goToToday}>Today</button>

	<!-- Render the appointments for each day -->
	{#each ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as day, index}
		<div class="day {day} {index === currentDateIndex ? 'current-day' : ''}">
			<div class="header">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
			<div class="date">{formatDate(datesOfTheWeek[index])}</div>
			<div class="appointment-container">
				{#if $loading}
					<!-- Use $loading to get the value of the loading store -->
					<div>Loading...</div>
				{:else}
					{#each appointmentsByDay[day] || [] as appointment}
						<div class="appointment">
							{appointment.startTime}-{appointment.endTime}
							{#if $isAdmin}
								<!-- Access the value of the isAdmin store with $ -->
								<button on:click={() => deleteAppointment(appointment.id)}>Delete</button>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.container {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin: 40px auto;
		gap: 20px;
	}

	.day {
		flex: 1;
		min-width: 120px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		padding: 20px;
		text-align: center;
	}

	.current-day {
		background-color: lightblue;
	}

	.header {
		font-size: 1.2rem;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.appointment-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.appointment {
		font-size: 1rem;
		min-width: 125px;
		color: #666;
		background-color: #f5f5f5;
		border-radius: 4px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		padding: 8px;
		margin-top: 10px;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.appointment:hover {
		background-color: #e5e5e5;
	}
</style>
