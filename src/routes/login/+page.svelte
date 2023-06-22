<script>
	import { isAuthenticated } from '../../lib/auth.js';
	let email = '';
	let password = '';

	async function handleSubmit(event) {
		event.preventDefault();

		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				credentials: 'include', // This is important for sending and receiving cookies
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			if (response.ok) {
				// const { token } = await response.json();
				// Save the token and handle successful login, e.g., redirect to a protected page
				console.log('success');
				// localStorage.setItem('authToken', token);

				// Redirect authenticated users to the protected page
				window.location.href = '/account';
			} else {
				// Handle unsuccessful login, e.g., show an error message
				console.log('error');
			}
		} catch (error) {
			// Handle network errors or other exceptions
		}
	}
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login page" />
</svelte:head>

<form on:submit={handleSubmit}>
	<label for="email">Email:</label>
	<input id="email" bind:value={email} required />

	<label for="password">Password:</label>
	<input type="password" id="password" bind:value={password} required />

	<button type="submit">Login</button>
</form>

<style>
	/* Add your custom styles here */
</style>
