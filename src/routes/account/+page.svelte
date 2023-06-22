<script>
	import { onMount } from 'svelte';

	let accountData = null;

	onMount(async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/account`, {
				method: 'GET',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' }
			});

			if (response.ok) {
				accountData = await response.json();
				console.log(accountData.email);
			} else {
				console.log('Error fetching account data');
			}
		} catch (error) {
			console.error('Error fetching account data:', error);
		}
	});

	async function logout() {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' }
			});

			if (response.ok) {
				console.log('Logout successful');
				// optionally, redirect to login or home page here
				window.location.href = '/';
			} else {
				console.log('Error during logout');
			}
		} catch (error) {
			console.error('Error during logout:', error);
		}
	}
</script>

<svelte:head>
	<title>Account</title>
	<meta name="description" content="Account page" />
</svelte:head>

<div class="text-column">
	<h1>Account</h1>
	<p>{accountData ? accountData.email : 'Loading...'}</p>

	<!-- Logout button -->
	<button on:click={logout}>Logout</button>

	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
		laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
		voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
		non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	</p>
</div>
