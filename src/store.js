import { writable } from 'svelte/store';

export const jwt = writable(null);

export const loading = writable(null);

export const isAdmin = writable(null);
